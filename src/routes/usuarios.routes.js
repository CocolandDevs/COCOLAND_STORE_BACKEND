import { Router } from "express";
import { usuarioSchema } from "../schemas/usuarios.schema.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { authRequired } from "../middlewares/validateToken.js";

import {
  createUsuario,
  deleteUsuario,
  getUsuario,
  getUsuarios,
  updateUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/usuarios/get", authRequired, getUsuarios);
router.get("/usuarios/get/:id", authRequired, getUsuario);
router.post(
  "/usuarios/create",
  authRequired,
  validateschema(usuarioSchema),
  createUsuario
);
router.put("/usuarios/update/:id", authRequired, updateUsuario);
router.delete("/usuarios/delete/:id", authRequired, deleteUsuario);

export default router;
