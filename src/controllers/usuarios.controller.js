import { hashPassword } from "../libs/bycript.js";
import prisma from "../libs/client.js";
import { getImage, getRolByUser, guardarImagen, userExist } from "./helper.controller.js";
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
            usuario.rol = rolUsuario.nombre;
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

//Ubicaciones de usuarios
export const getUbicaciones = async (req, res) => {
  try {
    const { id_usuario } = req.body;

    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json({ message: "Usuario no encontrado" });

    const ubicaciones = await prisma.uBICACIONES_USUARIO.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
        status: true,
      },
    });

    if (ubicaciones.length !== 0) {
      res.json(ubicaciones);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.json([error.message]);
  }
}


export const agregarUbicacion = async (req, res) => {
  try {
    const {
      id_usuario,
      direccion,
      codigo_postal,
      ciudad,
      estado,
      pais,
      numero_interior,
      numero_exterior,
      alias,
      numero_telefonico,
      status,
    } = req.body;

    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json({ message: "Usuario no encontrado" });

    const ubicacion = await prisma.uBICACIONES_USUARIO.create({
      data: {
        id_usuario : parseInt(id_usuario),
        direccion,
        codigo_postal : parseInt(codigo_postal),
        ciudad,
        estado,
        pais,
        numero_interior,
        numero_exterior,
        alias,
        numero_telefonico : parseInt(numero_telefonico),
        status,
      },
    });
    
    if (!ubicacion) return res.json({ message: "Error al agregar ubicacion" });

    res.json({
      message: "Ubicacion agregada exitosamente",
      ubicacion,
    });

  } catch (error) {
    console.log(error);
    res.json([error.message]);
  }
};

export const editarUbicacion = async (req, res) => {
  try {
    const {
      id,
      id_usuario,
      direccion,
      codigo_postal,
      ciudad,
      estado,
      pais,
      numero_interior,
      numero_exterior,
      alias,
      numero_telefonico,
      status,
    } = req.body;

    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json({ message: "Usuario no encontrado" });

    const ubicacion = await prisma.uBICACIONES_USUARIO.update({
      where: {
        id: parseInt(id),
      },
      data: {
        id_usuario : parseInt(id_usuario),
        direccion,
        codigo_postal : parseInt(codigo_postal),
        ciudad,
        estado,
        pais,
        numero_interior,
        numero_exterior,
        alias,
        numero_telefonico : parseInt(numero_telefonico),
        status,
      },
    });

    if (!ubicacion) return res.json({ message: "Error al editar ubicacion" });

    res.json({
      message: "Ubicacion editada exitosamente",
      ubicacion,
    });

  } catch (error) {
    console.log(error);
    res.json([error.message]);
  }
}

export const deleteUbicacion = async (req, res) => {
  try {
    const { id } = req.body;

    const ubicacionDeleted = await prisma.uBICACIONES_USUARIO.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });

    if (!ubicacionDeleted) return res.json({ message: "Ubicacion no encontrada" });

    res.json({
      message: "Ubicacion eliminada exitosamente",
      ubicacion: ubicacionDeleted,
    });
  } catch (error) {
    console.log(error);
    res.json([error.message]);
  }
}


//Perfiles de usuarios
export const getPerfil = async (req, res) => {
  try {
    const {id_usuario} = req.body;
    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json({ message: "Usuario no encontrado" });

    const perfil = await prisma.pERFIL_USUARIO.findFirst({
      where: {
        id_usuario: parseInt(id_usuario),
        status: true,
      },
    });

    if (!perfil) return res.json({ message: "Perfil no encontrado" });

    res.json(perfil);
  } catch (error) {
    console.log(error);
    res.json([error.message]);
  }
}

export const agregarPerfil = async (req, res) => {
  try {
    const {
      id_usuario,
      nombres,
      apellidos,
      genero,
      ubicacion_default,
      fecha_nacimiento,
      telefono,
    } = req.body;
    
    
    let image = req?.files?.imagen ?? null;
    let imgReference = null;
    const fechaNacimiento = new Date(fecha_nacimiento);
    const usuario = await userExist(id_usuario);

    if (!usuario) return res.json({ message: "Usuario no encontrado" });

    if (image != null) {
      imgReference = await guardarImagen(image, "Perfiles");
    }

    const dataPerfil = {
      id_usuario : parseInt(id_usuario),
      nombres : nombres ?? null,
      apellidos : apellidos ?? null,
      genero : genero ?? null,
      ubicacion_default : parseInt(ubicacion_default) ?? null,
      fecha_nacimiento : fechaNacimiento ?? null,
      telefono : parseInt(telefono) ?? null,
      imagen : imgReference ?? null,
    };

    const perfilExist = await prisma.pERFIL_USUARIO.findFirst({
      where: {
        id_usuario: parseInt(id_usuario),
      },
    });
    let perfil;

    if (!perfilExist) {
      perfil = await prisma.pERFIL_USUARIO.create({
        data: dataPerfil,
      });
    }else{
      perfil = await prisma.pERFIL_USUARIO.update({
        where: {
          id: perfilExist.id,
        },
        data: dataPerfil,
      });
    
    }
    
    res.json({
      message: "Perfil agregado exitosamente",
      perfil,
    });

  } catch (error) {
    console.log(error);
    res.json([error.message]);
  }
}

export const getImagePerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await prisma.pERFIL_USUARIO.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!perfil) return res.status(400).json({ message: "Perfil no encontrado" });

    let imagen = perfil.imagen;
    
    if (imagen == null) {
      return res.status(400).json(["No image found"]);
    }
    
    const base64 = await getImage(imagen);
    return res.status(200).json(base64);
  } catch (error) {
    console.log(error);
    res.json([error.message]);
  }
}