import prisma from "../libs/client.js";

export const getCategoria = async (req, res) => {
  try {
    const categoria = await prisma.cATEGORIAS.findMany();
    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const createCagoria = async (req, res) => {
  const { nombre, estatus } = req.body;
  try {
    const categoria = await prisma.cATEGORIAS.create({
      data: {
        nombre,
        status: estatus || true,
      },
    });
    res.status(200).json({
      message: "Categoria created successfully",
      categoria,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, estatus } = req.body;
  try {
    const rol = await prisma.cATEGORIAS.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nombre,
        status: estatus || true,
      },
    });
    res.status(200).json({
      message: "Categoria updated successfully",
      rol,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.cATEGORIAS.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!categoria) return res.status(400).json(["Categoria not found"]);

    const categoriaDeleted = await prisma.cATEGORIAS.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });
    res.status(200).json({
      message: "Categoria deleted successfully",
      categoriaDeleted,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};
