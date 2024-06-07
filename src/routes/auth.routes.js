import { Router } from "express";
import { getUsers, register } from "../controllers/auth.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../schemas/auth.schema.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.post("/register", validateschema(registerSchema) ,register);

export default router;