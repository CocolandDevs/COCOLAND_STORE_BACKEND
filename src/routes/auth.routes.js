import { Router } from "express";
import { hashPasswordTest, login, logout, register, verifyToken,sendMail, requestPasswordReset, resetPassword  } from "../controllers/auth.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema, passwordRecoverySchema, resetPasswordSchema } from "../schemas/auth.schema.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.post("/auth/register", validateschema(registerSchema) ,register);
router.post("/auth/login",validateschema(loginSchema) , login);
router.post("/auth/logout", logout);
router.get("/auth/verify" , verifyToken );

router.post("/auth/requestpasswordreset", validateschema(passwordRecoverySchema), requestPasswordReset); 
router.post("/auth/resetpassword", validateschema(resetPasswordSchema), resetPassword);

//rutas para pruebas
router.post("/auth/passwordTest",hashPasswordTest);
router.post("/auth/sendmail", async (req, res) => { const { templateName, recipientEmail } = req.body; await sendMail(templateName, recipientEmail, res); res.send("Correo enviado"); });



export default router;