import { Router } from "express";
import { perfilUsuarioSchema, ubicacionSchema, updateUsuarioSchema, usuarioSchema } from "../schemas/usuarios.schema.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { authRequired } from "../middlewares/validateToken.js";

import {
  agregarPerfil,
  agregarUbicacion,
  createUsuario,
  deleteUbicacion,
  deleteUsuario,
  editarUbicacion,
  getImagePerfil,
  getUbicaciones,
  getUsuario,
  getUsuarios,
  updateUsuario,
  getPerfil,
} from "../controllers/usuarios.controller.js";

const router = Router();
//dar de alta usuarios

router.get(
  "/usuarios/get", 
  authRequired, 
  getUsuarios
);

router.get(
  "/usuarios/get/:id", 
  authRequired, 
  getUsuario
);

router.post(
  "/usuarios/create",
  authRequired,
  validateschema(usuarioSchema),
  createUsuario
);

router.put(
  "/usuarios/update/:id", 
  authRequired, 
  // validateschema(updateUsuarioSchema),
  updateUsuario
);

router.delete(
  "/usuarios/delete/:id", 
  authRequired, 
  deleteUsuario
);

//agregar ubicaciones
router.get(
  "/usuarios/getUbicaciones/:id",
  getUbicaciones
);

router.post(
  "/usuarios/agregarUbicacion",
  validateschema(ubicacionSchema),
  agregarUbicacion
);

router.put(
  "/usuarios/updateUbicacion/:id",
  validateschema(ubicacionSchema),
  editarUbicacion
);

router.delete(
  "/usuarios/deleteUbicacion/:id",
  deleteUbicacion
);


//agregarPerfil
router.post(
  "/usuarios/perfil",
  getPerfil
)

router.post(
  "/usuarios/agregarPerfil",
  validateschema(perfilUsuarioSchema),
  agregarPerfil
);

router.get(
  "/usuarios/getImage/:id",
  getImagePerfil
);


export default router;
