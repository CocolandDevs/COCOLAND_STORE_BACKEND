import prisma from '../libs/client.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword, } from '../libs/bycript.js';
import { getRolByUser } from './helper.controller.js';
import nodemailer from '../libs/nodemailer.js';
import fs from 'fs';
import path from 'path'; 



const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const DOMAIN = process.env.FRONTEND_DOMAIN || "localhost:5173";

export const register = async (req,res) => {
    const { username, email, password } = req.body;
    try {
        const userFound = await prisma.usuarios.findUnique( { where: { email } });

        if (userFound) return res.status(400).json(["User already exists"]);

        const passwordHash = await hashPassword(password);

        const user = await prisma.usuarios.create({
            data: {
                name: username,
                email,
                password : passwordHash
            }
        });
        //obtenemos el rol de Administrador
        const rol = await prisma.roles.findFirst({where : {nombre :  "Usuario"}});

        //creamos el rol del usuario
        await prisma.usuarios_roles.create({
            data : {
                id_usuario : user.id,
                id_rol : rol.id
            }
        });

        const token = await createAccessToken({ id: user.id });

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        await sendMail('bienvenida', email, res);

        res.status(200).json({
            message: "User created successfully",
            usuario: user,
            access_token: token,
            rol: rol      
        });

    } catch (error) {
        res.status(500).json([error.message]);
    }

}


export const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        
        const userfound = await prisma.usuarios.findUnique({ where: { email } });
        
        if (!userfound) return res.status(400).json(["User not found"]);

        const isMatch =  await comparePassword(password, userfound.password);

        if (!isMatch) return res.status(400).json(["Invalid credentials"]);

        const token = await createAccessToken({ id: userfound.id });

        const rol = await getRolByUser(userfound.id);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        await sendMail('bienvenida', email, res);

        res.status(200).json({
            message: "User logged in successfully",
            usuario: userfound,
            access_token: token,
            rol: rol
        });

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const logout = (req,res) =>{
    try {

        res.cookie('access_token',"",{
            expires : new Date(0),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
           });
        return res.status(200).json(["User logged out"]);

    } catch (error) {
        res.status(500).json([error.message]);
    }
    
 
}

export const verifyToken = async (req, res) => {
    try {
        const { access_token } = req.cookies;

        if (!access_token) {
            // console.log("No token provided");
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        jwt.verify(access_token, TOKEN_SECRET_KEY, async (err, user) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized: Invalid token" });
            }

            try {
                const userFound = await prisma.usuarios.findUnique({ where: { id: user.id } });

                if (!userFound) {
                    return res.status(404).json({ error: "User not found" });
                }

                const rol = await getRolByUser(user.id);

                res.json({
                    message: "Token is active",
                    usuario: userFound,
                    access_token: access_token,
                    rol: rol
                });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const hashPasswordTest = async (req,res) => {
    const { password } = req.body;
    try {
        const passwordHash = await hashPassword(password);
        res.status(200).json({ 
            contraseñaGenerada : passwordHash 
        });
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const sendMail = async (templateName, recipientEmail, res) => {
    try {
        let images = [];
        const productos = await prisma.productos.findMany({
            where: {
                imagen_default: {
                    not: null
                }
            }
        });

        productos.forEach(producto => {
            let obj = {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                descripcion: producto.descripcion,
                imagen_default: producto.imagen_default
            }

            images.push(obj);
        });

        //verificamos si existen las imagens o el directorio
        images = images.filter((imagen) => {
            return fs.existsSync(imagen.imagen_default);
        });

        const imagesAttachments = images.map((imagen) => {
            return {
                filename: imagen.nombre,
                content: fs.createReadStream(imagen.imagen_default),
                nombreProducto: imagen.nombre,
                precio: imagen.precio,
                descripcion: imagen.descripcion,
                cid: `image${imagen.id}@cid`
            }
        });

        let logo = fs.createReadStream(path.join(path.resolve(), '/src/resources/img/logo.png'));

        const template = await new Promise((resolve, reject) => {
            res.render(templateName, { productos: imagesAttachments, logo }, (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            }); 
        });

        if (recipientEmail == "demo@gmail.com") {
            recipientEmail = process.env.SMTP_USER;
        }

        nodemailer.sendMail({
            from: process.env.SMTP_USER,
            to: recipientEmail,
            subject: "Bienvenido",
            html: template,
            attachments: imagesAttachments.concat({ filename: 'logo.png', content: logo, cid: `logo@cid` })
        }, (error, info) => {
            if (error) {
                console.error("Error al enviar el correo:", error);
            } else {
                console.log("Correo enviado:", info.response);
            }
        });
    } catch (error) {
        console.error("Error en sendMail:", error.message);
    }
}


export const resetPassword = async (req, res) => {
  const { id, password, confirmPassword } = req.body;

  console.log("Datos recibidos:", { id, password, confirmPassword });

  if (!id || !password || !confirmPassword) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  try {
    const passwordHash = await hashPassword(password);

    await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: { password: passwordHash },
    });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  
  
  



 // Función para enviar el correo de restablecimiento de contraseña con plantilla fija
 export const sendMailPassword = async (recipientEmail, res, context = {}) => {
   const templateName = 'cambiarPass'; // Nombre fijo de la plantilla
   try {
     const template = await new Promise((resolve, reject) => {
       res.render(templateName, context, (err, html) => {
         if (err) {
           reject(err);
         } else {
           resolve(html);
         }
       });
     });
 
     // Configuración de nodemailer para enviar el correo
     nodemailer.sendMail({
       from: process.env.SMTP_USER,
       to: recipientEmail,
       subject: "Recuperación de Contraseña",
       html: template,
     }, (error, info) => {
       if (error) {
         console.error("Error al enviar el correo:", error);
       } else {
         console.log("Correo enviado:", info.response);
       }
     });
   } catch (error) {
     console.error("Error en sendMail:", error.message);
   }
 };
 
 // Función para manejar la solicitud de restablecimiento de contraseña
 export const requestPasswordReset = async (req, res) => {
   const { email } = req.body;
 
   try {
     const user = await prisma.usuarios.findUnique({ where: { email } });
     console.log(user);
 
     if (!user) return res.status(404).json({ error: "User not found" });
 
     // Crea la URL de restablecimiento con los parámetros necesarios
     const resetUrl = `http://localhost:5173/ResetPassword?id=${user.id}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`;
 
     // Llama a la función sendMailPassword cuando se encuentra el usuario
     await sendMailPassword(email, res, { name: user.name, resetUrl });
 
     return res.status(200).json({ message: "Password reset email sent" });
 
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 };
 




  

 
        
