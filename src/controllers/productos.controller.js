import { date } from "zod";
import prisma from "../libs/client.js";
import { getImage, guardarImagen } from "./helper.controller.js";

export const getProductos = async (req, res) => {
  const {id} = req.params;
  try {
    if (id) {
      const producto = await prisma.pRODUCTOS.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      
      if (!producto) return res.status(400).json(["Producto not found"]);

      return res.status(200).json(producto);
    }

    const producto = await prisma.pRODUCTOS.findMany();

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const getProductosImage = async(req,res) => {
  const {id} = req.params;
  try {

    if (id) {
      const producto = await prisma.pRODUCTOS.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!producto) return res.status(400).json(["Producto not found"]);
      
      if (producto.imagen_default != null) {
        producto.imagen_default = getImage(imagen);
      }

      return res.status(200).json(producto);
    }

    const productos = await prisma.pRODUCTOS.findMany({
      where: {
        status: true,
      
      }
    });

    if (productos.length > 0) {
      productos.forEach(async (producto) => {
        if (producto.imagen_default != null) {
          producto.imagen_default = getImage(producto.imagen_default);
        }
      });
    }

    return res.status(200).json(productos);


  } catch (error) {
      return res.status(500).json([error.message]);
  }
}

export const createProducto = async (req, res) => {
  const { 
    nombre ,
    descripcion,
    id_categoria,
    precio,
    status 
    } = req.body;
    // console.log(req);
    let imagen = req?.files?.imagen_default ?? null;
    let imgReference = null;
    let precioFloat = parseFloat(precio);
    let id_categoriaInt = parseInt(id_categoria);
 
  try {

    if (imagen) {
      imgReference = await guardarImagen(imagen,"Productos");
    }

    const producto = await prisma.pRODUCTOS.create({
      data: {
      nombre,
      descripcion,
      id_categoria: id_categoriaInt,
      precio: precioFloat,
      imagen_default: imgReference,
      status: status == "true" ? true : false,
      },
    });

    res.status(200).json({
      message: "Producto created successfully",
      producto,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json([error.message]);
  }
};

export const updateProductos = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre ,
    descripcion,
    id_categoria,
    precio,
    status 
    } = req.body;

    let imagen = req?.files?.imagen_default ?? null;
    let imgReference = null;
    let precioFloat = parseFloat(precio);
    let id_categoriaInt = parseInt(id_categoria);
    let dataProducto = {};

  try {
    if (imagen) {
      imgReference = await guardarImagen(imagen,"Productos");
      dataProducto = {
        nombre,
        descripcion,
        id_categoria: id_categoriaInt,
        precio: precioFloat,
        imagen_default: imgReference,
        status: status == "true" ? true : false,
      };
    }else{
      dataProducto = {
        nombre,
        descripcion,
        id_categoria: id_categoriaInt,
        precio: precioFloat,
        status: status == "true" ? true : false,
      }
    }

    const producto = await prisma.pRODUCTOS.update({
      where: {
        id: parseInt(id),
      },
      data: dataProducto
    });
    res.status(200).json({
      message: "Producto updated successfully",
      producto,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json([error.message]);
  }
};

export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.pRODUCTOS.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!producto) return res.status(400).json(["Producto not found"]);

    const productoDeleted = await prisma.pRODUCTOS.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });
    res.status(200).json({
      message: "Producto deleted successfully",
      productoDeleted,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const getImageProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.pRODUCTOS.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!producto) return res.status(400).json(["Producto not found"]);

    let imagen = producto.imagen_default;

    if (imagen) {
      const base64 = await getImage(imagen);
      return res.status(200).json(base64);
    }

    return res.status(400).json(["No image found"]);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
}
