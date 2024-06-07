import prisma from '../libs/client.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcrypt';

export const getUsers = async () => {
    const users = await prisma.uSUARIOS.findMany();
    return users;
}

export const register = async (req,res) => {
    const { username, email, password } = req.body;
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

        res.cookie("token", token);

        res.status(200).json({
            message: "User created successfully",
            user        
        });

    } catch (error) {
        res.status(500).json([error.message]);
    }

}