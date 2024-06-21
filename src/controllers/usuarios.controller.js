import { hashPassword } from "../libs/bycript.js";
import prisma from "../libs/client.js";
import { getRolByUser } from "./helper.controller.js";
import { emailSchema, passwordSchema } from "../schemas/usuarios.schema.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.uSUARIOS.findMany({
      where: {
        status: true,
      },
    });

    if (usuarios.length !== 0) {
      const usuariosConRol = await Promise.all(
        usuarios.map(async (usuario) => {
          const rolUsuario = await getRolByUser(usuario.id);

          if (rolUsuario) {
            usuario.rol = rolUsuario;
          } else {
            usuario.rol = { name: "Sin Rol" };
          }
          return usuario;
        })
      );

      res.json(usuariosConRol);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.json([error.message]);
  }
};

export const getUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.uSUARIOS.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!usuario) return res.status(500).json({ message: "Usuario no encontrado" });
    const rolUsuario = await getRolByUser(usuario.id);

    if (rolUsuario) usuario.rol = rolUsuario;

    res.json(usuario);
  } catch (error) {
    res.json([error.message]);
  }
};


export const createUsuario = async (req, res) => {
  const { username, password, email, status, rol } = req.body;

  try {
    const usuarioExist = await prisma.uSUARIOS.findFirst({ where: { email } });
    if (usuarioExist) return res.status(400).json({ message: "Usuario ya existe" });

    const rolAsignado = await prisma.rOLES.findUnique({ where: { id: rol } });
    if (!rolAsignado) return res.status(500).json({ message: "Rol no encontrado" });
    if (!rolAsignado.status) return res.status(500).json({ message: "Rol deshabilitado" });

    const passwordHash = await hashPassword(password);

    // Crear el usuario
    const usuario = await prisma.uSUARIOS.create({
      data: {
        name: username,
        password: passwordHash,
        email,
        status,
      },
    });

    // Asignar el rol al usuario
    const rolUser = await prisma.uSUARIOS_ROLES.create({
      data: {
        id_rol: rol,
        id_usuario: usuario.id,
      },
    });

    usuario.rol = rolAsignado;

    res.json({
      message: "Usuario creado exitosamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, status, rol } = req.body;

    // Validar el ID de usuario
    const userId = parseInt(id);

    // Buscar el usuario
    const usuario = await prisma.uSUARIOS.findUnique({ where: { id: userId } });

    if (!usuario) return res.status(500).json({ message: "Usuario no encontrado" });

    // Validar email si ha cambiado
    if (email && email !== usuario.email) {
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) return res.status(400).json({ message: emailValidation.error.issues[0].message });
    }

    // Validar y hashear la contraseña si ha cambiado
    let passwordHash = usuario.password;
    if (password && password !== usuario.password) {
      const passwordValidation = passwordSchema.safeParse(password);
      if (!passwordValidation.success) return res.status(400).json({ message: passwordValidation.error.issues[0].message });
      passwordHash = await hashPassword(password);
    }

    // Actualizar usuario
    const usuarioUpdate = await prisma.uSUARIOS.update({
      where: { id: userId },
      data: {
        name: username,
        email,
        password: passwordHash,
        status,
      },
    });

    // Buscar y actualizar rol si ha cambiado
    const rolAsignado = await prisma.rOLES.findUnique({ where: { id: rol } });
    
    if (!rolAsignado) return res.status(500).json({ message: "Rol no encontrado" });
    if (!rolAsignado.status) return res.status(500).json({ message: "Rol deshabilitado" });
    const rolUsuario = await prisma.uSUARIOS_ROLES.findFirst({ where: { id_usuario: userId } });
    
    if (rolUsuario && rolUsuario.id_rol !== rolAsignado.id) {
      await prisma.uSUARIOS_ROLES.update({
        where: { id: rolUsuario.id },
        data: { id_rol: rolAsignado.id },
      });
    }

    // Asignar el rol actualizado al usuario
    usuarioUpdate.rol = rolAsignado;

    res.json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioDeleted = await prisma.uSUARIOS.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });

    if (!usuarioDeleted) return res.json({ message: "Usuario no encontrado" });

    res.json({
      message: "Usuario eliminado exitosamente",
      usuario: usuarioDeleted,
    });
  } catch (error) {
    res.json([error.message]);
  }
};
