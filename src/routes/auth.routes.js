import { Router } from "express";
import { login, register, veifyToken } from "../controllers/auth.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authRequired } from "../middlewares/validateToken.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.post("/register", validateschema(registerSchema) ,register);
router.post("/login",validateschema(loginSchema) , login);
router.get("/auth/verify", authRequired , veifyToken );

export default router;