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

/**
 *  @param file Archivo de imagen;
 * @param modulo Nombre del módulo donde se guardará la imagen;
 */
export const guardarImagen = async (file, modulo) => {
    try {
        // Generamos un token único para la imagen
        const token = Math.random().toString(36).substring(2);

        // Renombramos la imagen con ese token
        const extension = file?.type.split('/').pop();
        const nombreArchivo = `${token}.${extension}`;
        file.name = nombreArchivo;

        // Creamos el directorio
        const imagePath = `../storage/img/${modulo}/${nombreArchivo}`;
        // console.log(imagePath);
        // Guardamos la imagen en el directorio especificado
        await file.move(imagePath);

        // Devolvemos el directorio donde se guardó la imagen
        return imagePath;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}
