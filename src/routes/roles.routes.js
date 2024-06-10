import { Router } from "express";
import { validateschema } from "../middlewares/validator.middleware.js";
import { rolSchema } from "../schemas/rol.schema.js";
import {
  createRol,
  deleteRol,
  getRoles,
  updateRol,
} from "../controllers/rol.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.get("/roles/get", authRequired, getRoles);
router.post(
  "/roles/create",
  authRequired,
  validateschema(rolSchema),
  createRol
);
router.put("/roles/update/:id", authRequired, updateRol);
router.delete("/roles/delete/:id", authRequired, deleteRol);

export default router;
