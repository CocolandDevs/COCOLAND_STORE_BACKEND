import prisma from '../libs/client.js';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const getUsers = async () => {
    const users = await prisma.uSUARIOS.findMany();
    return users;
}


export const register = async (req,res) => {
    const { username, email, password, isAdmin } = req.body;
    try {
        const userFound = await prisma.uSUARIOS.findUnique( { where: { email } });

        if (userFound) return res.status(400).json(["User already exists"]);

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.uSUARIOS.create({
            data: {
                name: username,
                email,
                password : passwordHash
            }
        });
        const token = await createAccessToken({ id: user.id });

        res.cookie("access_token", token);

        res.status(200).json({
            message: "User created successfully",
            usuario: user,
            access_token: token       
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

        const isMatch = await bcrypt.compare(password, userfound.password);

        if (!isMatch) return res.status(400).json(["Invalid credentials"]);

        const token = await createAccessToken({ id: userfound.id });

        res.cookie("access_token", token);

        res.status(200).json({
            message: "User logged in successfully",
            usuario: userfound,
            access_token: token,
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