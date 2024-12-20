import { hashPassword } from "../libs/bycript.js";
import prisma from "../libs/client.js";
import { getImage, getRolByUser, guardarImagen, userExist } from "./helper.controller.js";
import { emailSchema, passwordSchema } from "../schemas/usuarios.schema.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      // where: {
      //   status: true,
      // },
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
    const usuario = await prisma.usuarios.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!usuario) return res.status(500).json(["Usuario no encontrado"]);
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
    const usuarioExist = await prisma.usuarios.findFirst({ where: { email } });
    if (usuarioExist) return res.status(400).json(["Usuario ya existe"]);

    const rolAsignado = await prisma.roles.findUnique({ where: { id: parseInt(rol) } });
    if (!rolAsignado) return res.status(500).json( ["Rol no encontrado"] );
    if (!rolAsignado.status) return res.status(500).json(["Rol deshabilitado"]);

    const passwordHash = await hashPassword(password);

    // Crear el usuario
    const usuario = await prisma.usuarios.create({
      data: {
        name: username,
        password: passwordHash,
        email,
        status,
      },
    });

    // Asignar el rol al usuario
    const rolUser = await prisma.usuarios_roles.create({
      data: {
        id_rol: parseInt(rol),
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
    res.status(500).json([ error.message ]);
  }
};


export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, status, rol } = req.body;

    // Validar el ID de usuario
    const userId = parseInt(id);

    // Buscar el usuario
    const usuario = await prisma.usuarios.findUnique({ where: { id: userId } });

    if (!usuario) return res.status(500).json(["Usuario no encontrado" ]);

    // Validar email si ha cambiado
    if (email && email !== usuario.email) {
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) return res.status(400).json([emailValidation.error.issues[0].message]);
    }

    // Validar y hashear la contraseña si ha cambiado
    let passwordHash = usuario.password;
    if (password && password !== usuario.password) {
      const passwordValidation = passwordSchema.safeParse(password);
      if (!passwordValidation.success) return res.status(400).json([passwordValidation.error.issues[0].message]);
      passwordHash = await hashPassword(password);
    }

    // Actualizar usuario
    const usuarioUpdate = await prisma.usuarios.update({
      where: { id: userId },
      data: {
        name: username,
        email,
        password: passwordHash,
        status,
      },
    });

    // Buscar y actualizar rol si ha cambiado
    const rolAsignado = await prisma.roles.findUnique({ where: { id: rol } });
    
    if (!rolAsignado) return res.status(500).json(["Rol no encontrado"] );
    if (!rolAsignado.status) return res.status(500).json(["Rol deshabilitado"]);
    const rolUsuario = await prisma.usuarios_roles.findFirst({ where: { id_usuario: userId } });
    
    if (rolUsuario && rolUsuario.id_rol !== rolAsignado.id) {
      await prisma.usuarios_roles.update({
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
    res.status(500).json([ error.message ]);
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioDeleted = await prisma.usuarios.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });

    if (!usuarioDeleted) return res.json(["Usuario no encontrado"]);

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
    const { id } = req.params;

    const usuario = await userExist(id);
    if (!usuario) return res.json(["Usuario no encontrado"]);

    const ubicaciones = await prisma.ubicaciones_usuario.findMany({
      where: {
        id_usuario: parseInt(id),
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
      complemento,
      estado,
      pais,
      alias,
      numero_telefonico,
      status,
      tipo_direccion,
    } = req.body;

    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json(["Usuario no encontrado"]);

    const ubicacion = await prisma.ubicaciones_usuario.create({
      data: {
        id_usuario : parseInt(id_usuario),
        direccion,
        codigo_postal : codigo_postal,
        ciudad,
        estado,
        pais,
        complemento,
        alias,
        numero_telefonico : numero_telefonico,
        status,
        tipo_direccion: tipo_direccion,
      },
    });
    
    if (!ubicacion) return res.json(["Error al agregar ubicacion"]);

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
      id_usuario,
      direccion,
      codigo_postal,
      ciudad,
      complemento,
      estado,
      pais,
      alias,
      numero_telefonico,
      status,
      tipo_direccion,
    } = req.body;

    const { id } = req.params;

    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json(["Usuario no encontrado"]);

    const ubicacion = await prisma.ubicaciones_usuario.update({
      where: {
        id: parseInt(id),
      },
      data: {
        id_usuario : parseInt(id_usuario),
        direccion,
        codigo_postal : codigo_postal,
        ciudad,
        estado,
        pais,
        complemento,
        alias,
        numero_telefonico : numero_telefonico,
        status,
        tipo_direccion: tipo_direccion,
      },
    });

    if (!ubicacion) return res.json(["Error al editar ubicacion" ]);

    res.json({
      message: "Ubicacion editada exitosamente",
      ubicacion,
    });

  } catch (error) {
    // console.log(error);
    res.json([error.message]);
  }
}

export const deleteUbicacion = async (req, res) => {
  try {
    const { id } = req.params;

    const ubicacionDeleted = await prisma.ubicaciones_usuario.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: false,
      },
    });

    if (!ubicacionDeleted) return res.json(["Ubicacion no encontrada"]);

    res.json({
      message: "Ubicacion eliminada exitosamente",
      ubicacion: ubicacionDeleted,
    });
  } catch (error) {
    // console.log(error);
    res.json([error.message]);
  }
}


//Perfiles de usuarios 
export const getPerfil = async (req, res) => {
  try { 
    // console.log(req.body)
    const {id_usuario} = req.body;
    const usuario = await userExist(id_usuario);
    if (!usuario) return res.json(["Usuario no encontrado"]);
    //console.log(usuario);

    const perfil = await prisma.perfil_usuario.findFirst({
      where: {
        id_usuario: parseInt(id_usuario)
      },
    });

    if (!perfil) return res.json(["Perfil no encontrado"]);

    //obtenemos la imagen del perfil
    let imagen = perfil.imagen;
    if (imagen != null) {
      const base64 = getImage(imagen);
      perfil.imagen = base64;
    }
    
    res.json(perfil);
  } catch (error) {
    // console.log(error);
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

    if (!usuario) return res.json(["Usuario no encontrado"]);
    let perfilData = {};

    if (image != null) {
      imgReference = await guardarImagen(image, "Perfiles");
      perfilData = {
        id_usuario : parseInt(id_usuario),
        nombres : nombres ?? null,
        apellidos : apellidos ?? null,
        genero : genero ?? null,
        ubicacion_default : parseInt(ubicacion_default) ?? null,
        fecha_nacimiento : fechaNacimiento ?? null,
        telefono : parseInt(telefono) ?? null,
        imagen : imgReference,
      }
    }else{
      perfilData = {
        id_usuario : parseInt(id_usuario),
        nombres : nombres ?? null,
        apellidos : apellidos ?? null,
        genero : genero ?? null,
        ubicacion_default : parseInt(ubicacion_default) ?? null,
        fecha_nacimiento : fechaNacimiento ?? null,
        telefono : parseInt(telefono) ?? null,
      }
    }

    const perfilExist = await prisma.perfil_usuario.findFirst({
      where: {
        id_usuario: parseInt(id_usuario),
      },
    });
    let perfil;

    if (!perfilExist) {
      perfil = await prisma.perfil_usuario.create({
        data: perfilData,
      });
    }else{
      perfil = await prisma.perfil_usuario.update({
        where: {
          id: perfilExist.id,
        },
        data: perfilData,
      });
    
    }
    
    res.json({
      message: "Perfil agregado exitosamente",
      perfil,
    });

  } catch (error) {
    // console.log(error);
    res.json([error.message]);
  }
}

export const getImagePerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await prisma.perfil_usuario.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!perfil) return res.status(400).json(["Perfil no encontrado"]);

    let imagen = perfil.imagen;
    
    if (imagen == null) {
      return res.status(400).json(["No image found"]);
    }
    
    const base64 = getImage(imagen);
    return res.status(200).json(base64);
  } catch (error) {
    // console.log(error);
    res.json([error.message]);
  }
}