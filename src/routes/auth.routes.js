import { Router } from "express";
import { hashPasswordTest, login, logout, register, veifyToken } from "../controllers/auth.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authRequired } from "../middlewares/validateToken.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.post("/auth/register", validateschema(registerSchema) ,register);
router.post("/auth/login",validateschema(loginSchema) , login);
router.post("/auth/logout", logout);
router.get("/auth/verify", authRequired , veifyToken );

//rutas para pruebas
router.post("/auth/passwordTest",hashPasswordTest);


export default router;