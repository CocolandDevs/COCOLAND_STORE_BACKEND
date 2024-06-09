import prisma from "../libs/client.js"

export const getRolByUser = async (user) => {
    try {
        const userFound = await prisma.uSUARIOS.findUnique( { where: { id : user } });
        if (!userFound) return "No se encontró el usuario";

        const rolFound = await prisma.uSUARIOS_ROLES.findFirst({ where: { id_usuario: userFound.id } });

        if (!rolFound) return "No se encontró el rol del usuario";

        const rol = await prisma.rOLES.findUnique({ where: { id: rolFound.id_rol } });
        if (!rol) return "No se encontró el rol";

        return rol;
        
    } catch (error) {
        console.log(error.message);
        return null;
    }
}
