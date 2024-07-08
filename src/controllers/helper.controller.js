import prisma from "../libs/client.js"
import fs from "fs";

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
        
        const newPath = `./public/${modulo}/${nombreArchivo}`;

        //creamos el directorio si no existe
        if (!fs.existsSync(`./public/${modulo}`)) {
            fs.mkdirSync(`./public/${modulo}`, { recursive: true });
        }
        fs.renameSync(file.path, newPath);
      
        // Devolvemos el directorio donde se guardó la imagen
        return `/public/${modulo}/${nombreArchivo}`;
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

export const getImage = async (path) => {
    try {
        const image = fs.readFileSync('.' + path,{encoding: 'base64'});
        let pathSplit = path.split('/');
        let name = pathSplit[pathSplit.length - 1];
        let extension = name.split('.')[1];

        console.log(name,extension);

        let image64 = `data:image/${extension};base64,${image}`;

        return image64;
        
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

