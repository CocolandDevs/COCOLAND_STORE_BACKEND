import { Router } from "express";
import { validateschema } from "../middlewares/validator.middleware.js";
import { rolSchema } from "../schemas/rol.schema.js";
import { createRol, getRoles } from "../controllers/rol.controller.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.get("/roles", validateschema(rolSchema) , getRoles);
router.post("/create", validateschema(rolSchema) , createRol);


export default router;