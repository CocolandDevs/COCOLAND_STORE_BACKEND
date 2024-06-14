import { Router } from "express";
import { validateschema } from "../middlewares/validator.middleware.js";
import { categoriaSchema } from "../schemas/categoria.schema.js";
import {
  getCategoria,
  createCagoria,
  updateCategoria,
  deleteCategoria

} from "../controllers/categorias.controller.js";
import { authRequired } from "../middlewares/validateToken.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.get("/categoria/get", authRequired, getCategoria);

router.post(
  "/categoria/create",
  authRequired,
  validateschema(categoriaSchema),
  createCagoria
);
router.put("/categoria/update/:id", authRequired, updateCategoria);
router.delete("/categoria/delete/:id", authRequired, deleteCategoria);

export default router;
