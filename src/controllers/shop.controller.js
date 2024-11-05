import prisma from "../libs/client.js";
import { getImage } from "./helper.controller.js";
import { userExist, productoDisponible, carritoExist } from "./helper.controller.js";
import { stripe } from "../libs/stripe.js";

export const createShop = async (req, res) => {
  const {
    id_usuario,
    id_producto,
    id_ubicacion,
    id_metodo_pago,
    id_cupon,
    cantidad,
    fecha_compra,
    tipo_pago,
  } = req.body;
  try {
    const shop = await prisma.compras_usuario.create({
      data: {
        id_usuario : parseInt(id_usuario),
        id_producto : parseInt(id_producto),
        id_ubicacion : parseInt(id_ubicacion),
        cantidad : parseInt(cantidad),
        fecha_compra: new Date(fecha_compra),
        tipo_pago,
        id_metodo_pago : id_metodo_pago ? parseInt(id_metodo_pago) : null,
        id_cupon : id_cupon ? parseInt(id_cupon) : null,
      },
    });
    res.status(200).json({
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const getShop = async (req, res) => {
  try {
    // console.log("el body es ",req.body);
    const { id_usuario } = req.body;
    if (!id_usuario)
      return res.status(400).json("el id del usuario es requerido");

    const shop = await prisma.compras_usuario.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
      },
    });
    let compras = [];
    if (shop.length > 0) {
      compras = await Promise.allSettled(
        shop.map(async (compra) => {
          const producto = await prisma.productos.findUnique({
            where: {
              id: compra.id_producto,
            },
          });
          let imagen = null;
          if (producto && producto.imagen_default != null) {
            imagen = getImage(producto.imagen_default);
          }
          const ubicacion = await prisma.ubicaciones_usuario.findUnique({
            where: {
              id: compra.id_ubicacion,
            },
          });
          return {
            id: compra.id,
            id_usuario: compra.id_usuario,
            cantidad: compra.cantidad,
            fecha_compra: compra.fecha_compra,
            tipo_pago: compra.tipo_pago,
            producto: producto.nombre,
            ubicacion: ubicacion?.alias,
            imagen: imagen,
          };
        })
      );

      compras = compras.map((compra) => {
        if (compra.status === "fulfilled") {
          return compra.value;
        }
      });
    }
    // console.log(compras);
    res.status(200).json(compras);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

// export const addCart = async (req, res) => {
//   try {
//     const { id_usuario } = req.body;
//     //validamos queel usuario y el producto estén disponibles
//     const user = await userExist(id_usuario);

//     //const { estatus, producto, message } = await productoDisponible(id_producto);

//     if (!user) return res.status(400).json("El usuario no existe");
//     if (!estatus) return res.status(400).json(message);

    
    
//     const carrito = await prisma.carrito_compra.create({
//       data: {
//         id_usuario: parseInt(id_usuario),
//         status: ,
//         subtotal: parseInt(cantidad),
//         total:
//       },
//     });

//     res.status(200).json({
//       message: "Producto agregado al carrito",
//       producto: producto,
//     });
//   } catch (error) {
//     res.status(500).json([error.message]);
//   }
// };

export const addCart = async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.body;

    // 1. Validar si el usuario existe usando tu helper `userExist`
    const user = await userExist(id_usuario);
    if (!user) return res.status(400).json({ message: "El usuario no existe" });

    // 2. Validar si el producto está disponible usando tu helper `productoDisponible`
    const { estatus, producto, message } = await productoDisponible(id_producto);
    if (!estatus) return res.status(400).json({ message });

    // 3. Buscar o crear un carrito para el usuario
    let carrito = await prisma.CARRITO_COMPRA.findFirst({
      where: { id_usuario: parseInt(id_usuario) },
    });

    if (!carrito) {
      // Si no existe un carrito, crear uno nuevo
      carrito = await prisma.CARRITO_COMPRA.create({
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
          cantidad: productoEnCarrito.cantidad + 1,
        },
      });
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      productoEnCarrito = await prisma.carrito_productos.create({
        data: {
          id_carrito: carrito.id,
          id_producto: parseInt(id_producto),
          cantidad: 1,
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
      const producto = await prisma.PRODUCTOS.findUnique({
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

    const total = subtotal; // Total será igual al subtotal

    // 7. Actualizar el carrito con el nuevo subtotal y total
    await prisma.CARRITO_COMPRA.update({
      where: { id: carrito.id },
      data: {
        subtotal: subtotal,
        total: total,
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


// export const getCart = async (req, res) => {
//   try {

//     const { id_usuario } = req.body;
//     if (!id_usuario) return res.status(400).json("El id del usuario es requerido");

//     const user = userExist(id_usuario);
//     if (!user) return res.status(400).json("El usuario no existe");

//     let productosAgregados = await prisma.carrito_compra.findMany({
//       where: {
//         id_usuario: parseInt(id_usuario),
//         status: true,
//       },
//     });

//     let carrito = [];

//     if (productosAgregados.length > 0) {
//       carrito = await Promise.allSettled(
//         productosAgregados.map(async (producto) => {
//           const productoInfo = await prisma.productos.findUnique({
//             where: {
//               id: producto.id_producto,
//             },
//           });

//           let imagen = null;

//           if (productoInfo && productoInfo.imagen_default != null) {
//             imagen = getImage(productoInfo.imagen_default);
//           }

//           return {
//             id: producto.id,
//             id_producto: producto.id_producto,
//             cantidad: producto.cantidad,
//             producto: productoInfo.nombre,
//             imagen: imagen,
//           };
//         })
//       );

//       carrito = carrito.map((producto) => {
//         if (producto.status === "fulfilled") {
//           return producto.value;
//         }
//       });
//     }
//     res.status(200).json(carrito);
//   } catch (error) {
//     res.status(500).json([error.message]);
//   }
// };

export const getCart = async (req, res) => {
  try {
    const { id_usuario } = req.body;

    // Verificar si se envió el id_usuario
    if (!id_usuario) return res.status(400).json("El id del usuario es requerido");

    const user = userExist(id_usuario);
    if (!user) return res.status(400).json("El usuario no existe");

    // Buscar el carrito del usuario
    const carrito = await prisma.CARRITO_COMPRA.findFirst({
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
        const productoInfo = await prisma.PRODUCTOS.findUnique({
          where: { id: producto.id_producto },
        });

        // Si no se encuentra el producto
        if (!productoInfo) {
          return null;
        }

        // Obtener la imagen (si existe)
        const imagen = productoInfo.imagen_default ? getImage(productoInfo.imagen_default) : null;

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
        const { id } = req.body;
        if (!id) return res.status(400).json("El id es requerido");
    
        const producto = await prisma.carrito_compra.findUnique({
          where: {
              id: parseInt(id),
          },
        });
    
        if (!producto) return res.status(400).json("El producto no existe");
    
        const deleteProducto = await prisma.carrito_compra.update({
          where: {
              id: parseInt(id),
          },
          data: {
              status: false,
          },
        });
    
        res.status(200).json({
          message: "Producto eliminado del carrito",
          producto: deleteProducto,
        });
    } catch (error) {
        res.status(500).json([error.message]);
    }
};

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
