import prisma from "../libs/client.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.rOLES.findMany();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const createRol = async (req, res) => {
  const { nombre, estatus } = req.body;
  try {
    const rol = await prisma.rOLES.create({
      data: {
        nombre,
        status: estatus || true,
      },
    });
    res.status(200).json({
      message: "Rol created successfully",
      rol,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const updateRol = async (req, res) => {
  const { id } = req.params;
  const { nombre, estatus } = req.body;
  try {
    const rol = await prisma.rOLES.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nombre,
        status: estatus || true,
      },
    });
    res.status(200).json({
      message: "Rol updated successfully",
      rol,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const deleteRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await prisma.rOLES.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!rol) return res.status(400).json(["Rol not found"]);

    const rolDeleted = await prisma.rOLES.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });
    res.status(200).json({
      message: "Rol deleted successfully",
      rolDeleted,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};
