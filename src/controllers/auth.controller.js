import prisma from '../libs/client.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../libs/bycript.js';
import { getRolByUser } from './helper.controller.js';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const register = async (req,res) => {
    const { username, email, password } = req.body;
    try {
        const userFound = await prisma.uSUARIOS.findUnique( { where: { email } });

        if (userFound) return res.status(400).json(["User already exists"]);

        const passwordHash = await hashPassword(password);

        const user = await prisma.uSUARIOS.create({
            data: {
                name: username,
                email,
                password : passwordHash
            }
        });
        //obtenemos el rol de Administrador
        const rol = await prisma.rOLES.findFirst({where : {nombre :  "Usuario"}});

        //creamos el rol del usuario
        await prisma.uSUARIOS_ROLES.create({
            data : {
                id_usuario : user.id,
                id_rol : rol.id
            }
        });

        const token = await createAccessToken({ id: user.id });

        res.cookie("access_token", token);

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
        
        const userfound = await prisma.uSUARIOS.findUnique({ where: { email } });
        
        if (!userfound) return res.status(400).json(["User not found"]);

        const isMatch =  await comparePassword(password, userfound.password);

        if (!isMatch) return res.status(400).json(["Invalid credentials"]);

        const token = await createAccessToken({ id: userfound.id });

        const rol = await getRolByUser(userfound.id);

        res.cookie("access_token", token);

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
            expires : new Date(0)
           });
        return res.status(200).json({message : "User logged out"});

    } catch (error) {
        res.status(500).json([error.message]);
    }
    
 
}

export const veifyToken = async (req,res) =>{
    const {access_token} = req.cookies;

    if (!access_token) return res.status(401).json(["Unauthorized"]);
    
    jwt.verify(access_token,TOKEN_SECRET_KEY,async (err,user)=>{

        if(err) return res.status(401).json(["Unauthorized"]);
        
        const userFound  = await prisma.uSUARIOS.findUnique({where : {id : user.id}});

        if (!userFound) return res.status(400).json( ["User not found"]);

        res.json({
            message: "Token Activo",
            usuario: userFound,
            access_token: access_token
        });
    })

}

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