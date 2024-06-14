import prisma from "../libs/client.js";

export const getProductos = async (req, res) => {
  try {
    const producto = await prisma.productos.findMany();
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
    imagen_defualt,
    status 
    } = req.body;
  try {
    const producto = await prisma.productos.create({
      data: {
        nombre,
        descripcion,
        id_categoria,
        precio,
        imagen_defualt,
        status: status || true
      },
    });
    res.status(200).json({
      message: "Producto created successfully",
      producto,
    });
  } catch (error) {
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
    imagen_defualt,
    estatus 
    } = req.body;
  try {
    const producto = await prisma.productos.update({
      where: {
        id: parseInt(id),
      },
      data: {
          nombre,
          descripcion,
          id_categoria,
          precio,
          imagen_defualt,
          status: estatus || true
      },
    });
    res.status(200).json({
      message: "Producto updated successfully",
      producto,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.productos.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!producto) return res.status(400).json(["Producto not found"]);

    const productoDeleted = await prisma.productos.update({
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
