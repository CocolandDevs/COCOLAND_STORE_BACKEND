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

      let imagen = producto.ima;

      if (imagen) {
        producto.imagen_default = await getImage(imagen);
      }

      return res.status(200).json(producto);
    }

    const producto = await prisma.pRODUCTOS.findMany();

    if (producto.length > 0) {
        let newProd = await Promise.allSettled(
          producto.map(async (prod)=>{
            let imagen = prod.imagen_default;
            let baseImg = null;
    
            if (imagen != null) {
              baseImg = await getImage(imagen);
            }
    
            prod.imagen_default = baseImg;
    
            return prod;
          })
        ) 
        if (newProd.status === "rejected") {
          res.status(500).json([newProd.reason.message]);
        }
        return res.status(200).json(newProd.map((prod)=>prod.value));
    }

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const createProducto = async (req, res) => {
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
      status: status 
      },
    });

    res.status(200).json({
      message: "Producto created successfully",
      producto,
    });
  } catch (error) {
    console.log(error.message);
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
    imagen_default,
    status 
    } = req.body;

    let precioFloat = parseFloat(precio);
    let id_categoriaInt = parseInt(id_categoria);

  try {
    const producto = await prisma.pRODUCTOS.update({
      where: {
        id: parseInt(id),
      },
      data: {
          nombre,
          descripcion,
          id_categoria: id_categoriaInt,
          precio: precioFloat,
          imagen_default,
          status
      },
    });
    res.status(200).json({
      message: "Producto updated successfully",
      producto,
    });
  } catch (error) {
    console.log(error.message);
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
