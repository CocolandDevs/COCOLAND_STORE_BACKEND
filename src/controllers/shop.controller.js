import prisma from "../libs/client.js";
import { getImage } from "./helper.controller.js";
import { userExist, productoDisponible, carritoExist } from "./helper.controller.js";
import { stripe } from "../libs/stripe.js";
import { sendMail } from "./auth.controller.js";

export const intentPayment = async (req, res) => {
  const { amount, userId, products,tipoPago } = req.body;
  //tipoPago es el tipo de pago que se va a realizar, si es oxxo o tarjeta

  let customer;
  //transformamos el arreglo de productos para que lo muestre en el detalle de stripe
  try {
    let productos = await Promise.all(
      products.map(async (prod) => {
        
        const producto = await prisma.productos.findUnique({
          where: {
            id: prod.productId,
          },
        });
         
        //devolvemos el objeto como lo necesita stripe
        return {
          name: producto.nombre,
          description: producto.descripcion,
          amount: producto.precio * 100,
          currency: 'mxn',
          quantity: prod.quantity,
        };
      })
    );
    //si el cliente no esta registrado lo registramos en stripe
    const usuario = await prisma.usuarios.findUnique({
      where: {
        id: userId,
      },
    });

    if (!usuario.is_stripe_customer) {

      customer = await stripe.customers.create({
        email: usuario.email,
      });

      await prisma.usuarios.update({
        where: {
          id: userId,
        },
        data: {
          is_stripe_customer: customer.id,
        },
      });
    }
    else{
      customer = await stripe.customers.retrieve(usuario.is_stripe_customer);
    }

    // Obtener el siguiente número de orden
    let nextOrder = await prisma.compras_usuario.count() + 1;

    // Crear Payment Intent en Stripe y agregamos los productos
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'mxn',
      payment_method_types: [tipoPago],
      customer: customer.id,
      metadata: {
        integration_check: 'accept_a_payment',
        products: JSON.stringify(productos),
        order: nextOrder,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
}
export const guardarTarjeta = async (req,res) => {
  const { userId, paymentIntentId } = req.body;
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: {
        id: userId,
      },
    });

    if (!usuario.is_stripe_customer) {
      const customer = await stripe.customers.create({
        email: usuario.email,
      });

      await prisma.usuarios.update({
        where: {
          id: userId,
        },
        data: {
          is_stripe_customer: customer.id,
        },
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    const paymentMethod = paymentIntent.payment_method;
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethod, {
      customer: usuario.is_stripe_customer,
    });

    // Set the payment method as the default
    await stripe.customers.update(usuario.is_stripe_customer, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    res.json({ success: true, message: 'Payment method saved' });
  } catch (error) {
    console.error('Error saving payment method:', error);
    res.status(500).json({ error: 'Payment method not saved' });
  }
}

export const crearPago = async (req,res) => {
  const {
    paymentIntentId,
    userId,
    products,
    id_metodo,
    id_ubicacion,
    id_cupon,
    total,
    subtotal,
    descuento,
    isCarrito,
  } = req.body;
  

  try {
    // Confirmar el Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //obtenemos el metodo de pago utilizado
    const metodoPago = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    console.log(metodoPago);
    
    

    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_action') {
      // Crear registro de la compra en la tabla compras_usuario
      const compra = await prisma.compras_usuario.create({
        data:{
          id_usuario: userId ? parseInt(userId) : null,
          id_metodo_pago: id_metodo ?? 1,
          id_ubicacion: id_ubicacion ? parseInt(id_ubicacion) : null,
          id_cupon: id_cupon ? parseInt(id_cupon) : null,
          total: total ? parseFloat(parseFloat(total).toFixed(2)) : 0,
          subtotal: subtotal ? parseFloat(parseFloat(subtotal).toFixed(2)) : 0,
          descuento: descuento ? parseFloat(parseFloat(descuento).toFixed(2)) : 0,
          tipo_pago: metodoPago.type,
          id_stripe_transaccion: paymentIntent.id,
          status_transaccion: paymentIntent.status,
        }
      });

      // Crear registro de los productos comprados en la tabla productos_comprados
      for (const producto of products) {
        await prisma.productos_compra.create({
          data: {
            id_compra: compra.id,
            id_producto: parseInt(producto.id_producto),
            cantidad: parseInt(producto.cantidad),
          },
        });
      }

      if(isCarrito){
        //borrar el carrito
        const carrito = await prisma.carrito_compra.findFirst({
          where: {
            id_usuario: userId,
          },
        });
  
        const productosEnCarrito = await prisma.carrito_productos.findMany({
          where: {
            id_carrito: carrito.id,
          },
        });
  
        for (const item of productosEnCarrito) {
          await prisma.carrito_productos.delete({
            where: { id: item.id },
          });
        }
  
        await prisma.carrito_compra.update({
          where: { id: carrito.id },
          data: {
            subtotal: 0,
            total: 0,
            descuento: 0,
            aplica_cupon: false,
            id_cupon: null,
          },
        });
      }

      const usuario = await prisma.usuarios.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      //mandamos el correo
      await sendMail('compra',usuario.email,res)

      res.json({ success: true, message: 'Purchase confirmed and recorded.' });
    } else {
      res.status(400).json({ error: 'Payment not confirmed.' });
    }
  } catch (error) {
    console.error('Error confirming purchase:', error);
    res.status(500).json({ error: 'Purchase confirmation failed' });
  }
}

// este es el webhook
export const confirmarPagoOxxo = async (req,res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type == 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      //buscamos la compra confirmada y la actualizamos
      const compra = await prisma.compras_usuario.findFirst({
        where: {
          id_stripe_transaccion: paymentIntent.id,
        },
      });

      if (compra) {
        await prisma.compras_usuario.update({
          where: {
            id: compra.id,
          },
          data: {
            status_transaccion: paymentIntent.status,
          },
        });

        //enviamos un correo al usuario con los detalles de la compra
        //enviamos un correo al administrador con los detalles de la compra
        res.json({ success: true, message: 'Purchase confirmed and recorded.' });
      } else {
        res.status(400).json({ error: 'Purchase not found.' });
      }
    } else if(event.type == 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      
      //buscamos la compra confirmada y la actualizamos
      const compra = await prisma.compras_usuario.findFirst({
        where: {
          id_stripe_transaccion: paymentIntent.id,
        },
      });

      if (compra) {
        await prisma.compras_usuario.update({
          where: {
            id: compra.id,
          },
          data: {
            status_transaccion: paymentIntent.status,
          },
        });

        //enviamos un correo al usuario con los detalles de la compra
        //enviamos un correo al administrador con los detalles de la compra
        res.json({ success: true, message: 'Purchase confirmed and recorded.' });
      } else {
        res.status(400).json({ error: 'Purchase not found.' });
      }

    }
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

export const getShop = async (req, res) => {
  try {
    const { id_usuario } = req.body;
    if (!id_usuario) {
      return res.status(400).json("El id del usuario es requerido");
    }

    const compras = await prisma.compras_usuario.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
        status_transaccion: 'succeeded',
      },
    });

    let resultado = [];

    for (const compra of compras) {
      const productosCompra = await prisma.productos_compra.findMany({
        where: {
          id_compra: compra.id,
        },
      });

      const productosConInfo = await Promise.all(productosCompra.map(async (productoCompra) => {
        const producto = await prisma.productos.findUnique({
          where: {
            id: productoCompra.id_producto,
          },
        });

        const categoria = producto ? await prisma.categorias.findUnique({
          where: {
            id: producto.id_categoria,
          },
        }) : null;

        return {
          id_producto: producto.id,
          cantidad: productoCompra.cantidad,
          nombre_producto: producto.nombre,
          categoria: categoria ? categoria.nombre : null,
          imagen: producto.imagen_default ? getImage(producto.imagen_default) : null,
        };
      }));

      resultado.push({
        id_compra: compra.id,
        fecha_compra: compra.fecha_compra,
        productos: productosConInfo,
      });
    }

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error obteniendo los productos comprados:', error);
    res.status(500).json([error.message]);
  } finally {
    await prisma.$disconnect();
  }
};

export const addCart = async (req, res) => {
  try {
    const { id_usuario, id_producto, cantidad } = req.body;

    // 1. Validar si el usuario existe usando tu helper `userExist`
    const user = await userExist(id_usuario);
    if (!user) return res.status(400).json({ message: "El usuario no existe" });

    // 2. Validar si el producto está disponible usando tu helper `productoDisponible`
    const { estatus, producto, message } = await productoDisponible(id_producto);
    if (!estatus) return res.status(400).json({ message });

    // 3. Buscar o crear un carrito para el usuario
    let carrito = await prisma.carrito_compra.findFirst({
      where: { id_usuario: parseInt(id_usuario) },
    });

    if (!carrito) {
      // Si no existe un carrito, crear uno nuevo
      carrito = await prisma.carrito_compra.create({
        data: {
          id_usuario: parseInt(id_usuario),
          status: true,
          subtotal: 0,
          total: 0,
        },
      });
    }

    // 4. Verificar si el producto ya está en el carrito
    let productoEnCarrito = await prisma.carrito_productos.findFirst({
      where: {
        id_carrito: carrito.id,
        id_producto: parseInt(id_producto),
      },
    });

    // 5. Actualizar la cantidad si el producto ya está en el carrito
    if (productoEnCarrito) {
      productoEnCarrito = await prisma.carrito_productos.update({
        where: { id: productoEnCarrito.id },
        data: {
          cantidad: productoEnCarrito.cantidad + parseInt(cantidad),
        },
      });
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      productoEnCarrito = await prisma.carrito_productos.create({
        data: {
          id_carrito: carrito.id,
          id_producto: parseInt(id_producto),
          cantidad: parseInt(cantidad),
        },
      });
    }

    // 6. Recalcular el subtotal y total
    const productosEnCarrito = await prisma.carrito_productos.findMany({
      where: { id_carrito: carrito.id },
    });

    let subtotal = 0;

    for (const item of productosEnCarrito) {
      // Obtener el producto de la tabla PRODUCTOS
      const producto = await prisma.productos.findUnique({
        where: { id: item.id_producto },
      });

      // Verificar si el producto tiene descuento activo y calcular el precio final
      let precioFinal;
      if (producto.en_descuento && producto.precio_descuento) {
        precioFinal = parseFloat(producto.precio_descuento);
      } else {
        precioFinal = parseFloat(producto.precio);
      }

      // Calcular el subtotal sumando (precio * cantidad) por cada producto en el carrito
      subtotal += item.cantidad * precioFinal;
    }

    let total = subtotal; // Total será igual al subtotal
    let descuento = 0;

    if (carrito.aplica_cupon) {
      const cupon = await prisma.cupones.findFirst({
        where: {
          id: carrito.id_cupon,
        },
      });
      
      descuento = total * (cupon.porcentaje_descuento / 100);
      total = total - descuento;
    }

    // 7. Actualizar el carrito con el nuevo subtotal y total
    await prisma.carrito_compra.update({
      where: { id: carrito.id },
      data: {
        subtotal: subtotal,
        total: total,
        descuento: descuento,
      },
    });

    // 8. Responder con el carrito actualizado
    res.status(200).json({
      message: "Producto agregado o actualizado en el carrito",
      carrito
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const { id_usuario } = req.body;

    // Verificar si se envió el id_usuario
    if (!id_usuario) return res.status(400).json("El id del usuario es requerido");

    const user = userExist(id_usuario);
    if (!user) return res.status(400).json("El usuario no existe");

    // Buscar el carrito del usuario
    const carrito = await prisma.carrito_compra.findFirst({
      where: { id_usuario: parseInt(id_usuario) },
    });

    // Si no se encuentra el carrito, devolver un carrito vacío
    if (!carrito) return res.status(200).json({ carrito: null, productos: [] });

    let productosAgregados = await prisma.carrito_productos.findMany({
      where: {
        id_carrito: carrito.id, 
      },
    });

    // Si no hay productos en el carrito, devolver el carrito con productos vacíos
    if (!productosAgregados.length) return res.status(200).json({ carrito, productos: [] });

    // Obtener los detalles de los productos y sus imágenes
    let productos = await Promise.all(
      productosAgregados.map(async (producto) => {
        const productoInfo = await prisma.productos.findUnique({
          where: { id: producto.id_producto },
        });

        // Si no se encuentra el producto
        if (!productoInfo) {
          return null;
        }

        // Obtener la imagen (si existe)
        const imagen = productoInfo.imagen_default ? getImage(productoInfo.imagen_default) : null;

        const categoria = await prisma.categorias.findUnique({
          where: { id: productoInfo.id_categoria },
        })

        return {
          id: producto.id,
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
          nombre: productoInfo.nombre,
          descripcion: productoInfo.descripcion,
          precio: productoInfo.precio,
          en_descuento: productoInfo.en_descuento,
          precio_descuento: productoInfo.precio_descuento,
          stock: productoInfo.stock,
          imagen: imagen,
          categoria: categoria.nombre,
        };
      })
    );

    // Filtrar los productos que no son nulos
    productos = productos.filter((producto) => producto !== null);

    // Responder con los datos del carrito y los productos
    res.status(200).json({ carrito, productos });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};


export const deleteProdcutCart = async (req, res) => {
    try {
        const { id_usuario, id_producto, cantidad } = req.body;
        

        if (!id_producto || !cantidad || !id_usuario) return res.status(400).json("El producto y la cantidad son requeridos");
        //validamos el usuario
        let user = await userExist(id_usuario);
        if (!user) return res.status(400).json("El usuario no existe");

        //validamos el carrito
        let carrito = await prisma.carrito_compra.findFirst({
            where: { id_usuario: parseInt(id_usuario) },
        });
        if (!carrito) return res.status(400).json("El carrito no existe");

        //validamos el producto
        let productoEnCarrito = await prisma.carrito_productos.findFirst({
            where: {
                id_carrito: carrito.id,
                id_producto: parseInt(id_producto),
            },
        });
        if (!productoEnCarrito) return res.status(400).json("El producto no está en el carrito");

        //elmiminamos o actualizamos la cantidad del producto en el carrito
        if (productoEnCarrito.cantidad <= cantidad) {
            await prisma.carrito_productos.delete({
                where: { id: productoEnCarrito.id },
            });
            await prisma.carrito_compra.update({
                where: { id: carrito.id },
                data: {
                    subtotal: 0,
                    total: 0,
                    descuento: 0,
                    aplica_cupon: false,
                    id_cupon: null,
                },
            })
        } else {
            await prisma.carrito_productos.update({
                where: { id: productoEnCarrito.id },
                data: {
                    cantidad: productoEnCarrito.cantidad - cantidad,
                },
            });
        }

        //calculamos el nuevo subtotal y total del carrito 
        const productosEnCarrito = await prisma.carrito_productos.findMany({
            where: { id_carrito: carrito.id },
        });

        let total = 0;
        let subtotal = 0;
        let descuento = 0;

        for (const item of productosEnCarrito) {
          const producto = await prisma.productos.findUnique({
              where: { id: item.id_producto },
          });

          if (producto.en_descuento && producto.precio_descuento) {
              subtotal += item.cantidad * parseFloat(producto.precio_descuento);
              total += item.cantidad * parseFloat(producto.precio_descuento);
          } else {
              subtotal += item.cantidad * parseFloat(producto.precio);
              total += item.cantidad * parseFloat(producto.precio);
          }
        }

        if(carrito.aplica_cupon) {
          const cupon = await prisma.cupones.findFirst({
            where: {
              id: carrito.id_cupon,
            },
          });
          
          descuento = total * (cupon.porcentaje_descuento / 100);
          total = total - descuento;
        }

        //actualizamos el carrito
        await prisma.carrito_compra.update({
            where: { id: carrito.id },
            data: {
                subtotal: subtotal,
                total: total,
                descuento: descuento,
            },
        });

        res.status(200).json({
            message: "Producto eliminado del carrito",
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json([error.message]);
    }
};

export const aplicarcupon = async (req,res) => {
  try {
    const { cupon, id_usuario } = req.body;
    if (!cupon) return res.status(400).json("El cupón es requerido");
    if (!id_usuario) return res.status(400).json("El id del usuario es requerido");

    const cuponFind = await prisma.cupones.findFirst({
      where: {
        nombre: cupon,
      },
    });

    if (!cuponFind) return res.status(400).json("Cupón no válido");
    if(cuponFind.status == false) return res.status(400).json("Cupón no disponible");
    
    const carrito = await prisma.carrito_compra.findFirst({
      where: {
        id_usuario: parseInt(id_usuario),
      },
    });

    if (!carrito) return res.status(400).json("El carrito no existe");

    //aplicamos el descuento del cupón
    let descuento = parseFloat(carrito.total) * (parseFloat(cuponFind.porcentaje_descuento)/ 100);
    let newTotal = parseFloat(carrito.total) - descuento;

    //actualizamos el carrito
    await prisma.carrito_compra.update({
      where: {
        id: parseInt(carrito.id),
      },
      data: {
        total: parseFloat(newTotal),
        aplica_cupon: true,
        id_cupon: cuponFind.id,
        descuento: parseFloat(descuento),
      },
    });

    res.status(200).json({  
      message: "Cupón aplicado correctamente",
      total: newTotal,
    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json([error.message]);
  }
}

export const deleteCart = async (req,res) => {
  try {
    const { id_usuario } = req.body;
    if (!id_usuario) return res.status(400).json("El id del usuario es requerido");

    const user = userExist(id_usuario);
    if (!user) return res.status(400).json("El usuario no existe");

    const productosDelete = await prisma.carrito_compra.updateMany({
      where: {
        id_usuario: parseInt(id_usuario),
        status: true,
      },
      data: {
        status: false,
      },
    });

    res.status(200).json({
      message: "Carrito eliminado correctamente",
    })
  } catch (error) {
    res.status(500).json([error.message]);
  }
}
