import prisma from "../libs/client.js";
import { getImage } from "./helper.controller.js";
import { userExist, productoDisponible } from "./helper.controller.js";

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
    const shop = await prisma.cOMPRAS_USUARIO.create({
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

    const shop = await prisma.cOMPRAS_USUARIO.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
      },
    });
    let compras = [];
    if (shop.length > 0) {
      compras = await Promise.allSettled(
        shop.map(async (compra) => {
          const producto = await prisma.pRODUCTOS.findUnique({
            where: {
              id: compra.id_producto,
            },
          });
          let imagen = null;
          if (producto && producto.imagen_default != null) {
            imagen = getImage(producto.imagen_default);
          }
          const ubicacion = await prisma.uBICACIONES_USUARIO.findUnique({
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

export const addCart = async (req, res) => {
  try {
    const { id_usuario, id_producto, cantidad } = req.body;
    //validamos queel usuario y el producto estén disponibles
    const user = await userExist(id_usuario);

    const { estatus, producto, message } = await productoDisponible(id_producto);

    if (!user) return res.status(400).json("El usuario no existe");
    if (!estatus) return res.status(400).json(message);
    
    const carrito = await prisma.cARRITO_COMPRA.create({
      data: {
        id_usuario: parseInt(id_usuario),
        id_producto: parseInt(id_producto),
        cantidad: parseInt(cantidad),
      },
    });

    res.status(200).json({
      message: "Producto agregado al carrito",
      producto: producto,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const getCart = async (req, res) => {
  try {

    const { id_usuario } = req.body;
    if (!id_usuario) return res.status(400).json("El id del usuario es requerido");

    const user = userExist(id_usuario);
    if (!user) return res.status(400).json("El usuario no existe");

    let productosAgregados = await prisma.cARRITO_COMPRA.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
        status: true,
      },
    });

    let carrito = [];

    if (productosAgregados.length > 0) {
      carrito = await Promise.allSettled(
        productosAgregados.map(async (producto) => {
          const productoInfo = await prisma.pRODUCTOS.findUnique({
            where: {
              id: producto.id_producto,
            },
          });

          let imagen = null;

          if (productoInfo && productoInfo.imagen_default != null) {
            imagen = getImage(productoInfo.imagen_default);
          }

          return {
            id: producto.id,
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
            producto: productoInfo.nombre,
            imagen: imagen,
          };
        })
      );

      carrito = carrito.map((producto) => {
        if (producto.status === "fulfilled") {
          return producto.value;
        }
      });
    }
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const deleteProdcutCart = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json("El id es requerido");
    
        const producto = await prisma.cARRITO_COMPRA.findUnique({
          where: {
              id: parseInt(id),
          },
        });
    
        if (!producto) return res.status(400).json("El producto no existe");
    
        const deleteProducto = await prisma.cARRITO_COMPRA.update({
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

    const productosDelete = await prisma.cARRITO_COMPRA.updateMany({
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
