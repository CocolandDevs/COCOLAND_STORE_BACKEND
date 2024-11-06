import jwt from 'jsonwebtoken';
import prisma from '../libs/client.js';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const authRequired = async (req, res, next,) => {
    const { access_token } = req.cookies;

    if (!access_token) {
        return res.status(401).json({ message: "No se encontró un Token de acceso, por favor inicie sesión" });
    }

    try {
        const decoded = jwt.verify(access_token, TOKEN_SECRET_KEY);
        req.user = decoded;

        const userFound = await prisma.usuarios.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!userFound) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const rolUsuario = await prisma.usuarios_roles.findFirst({
            where: {
                id_usuario: userFound?.id
            }
        });

        if (!rolUsuario) {
            return res.status(401).json({ message: "Usuario no tiene un rol asignado" });
        }

        const rol = await prisma.roles.findUnique({
            where: {
                id: rolUsuario?.id_rol
            }
        });

        if (!rol) {
            return res.status(401).json({ message: "Rol no encontrado" });
        }

        if (rol.nombre !== "Administrador") {
            return res.status(401).json({ message: "Usuario no autorizado" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token Inválido" });
    }
}

