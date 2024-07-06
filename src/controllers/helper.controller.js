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
        console.log(file);
        // Generamos un token único para la imagen
        const token = Math.random().toString(36).substring(2);

        // Renombramos la imagen con ese token
        const extension = file?.type.split('/').pop();
        const nombreArchivo = `${token}.${extension}`;
        file.name = nombreArchivo;

        
        // Creamos el directorio
        const imagePath = `..\\storage\\img\\${modulo}\\${nombreArchivo}`;

        const pathname = new URL(imagePath, import.meta.url);

        console.log(pathname);

        // Guardamos la imagen en el directorio especificado
        await file.move(file.path,pathname?.pathname,err =>{
            if (err) {
                console.log(err.message);
                return null;
            }
        });

        // Devolvemos el directorio donde se guardó la imagen
        return imagePath;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

export const userExist = async (id) => {
    try {
        const user = await prisma.uSUARIOS.findUnique({ where: { id : parseInt(id) } });
        return user ? user : null;
    } catch (error) {
        return null;
    }
}
