import prisma from "../libs/client.js"
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const getRolByUser = async (user) => {
    try {
        
        const userFound = await prisma.usuarios.findUnique( { where: { id : user } });
        if (!userFound) return "No se encontró el usuario";
        
        const rolFound = await prisma.usuarios_roles.findFirst({ where: { id_usuario: userFound.id } });
        
        if (!rolFound) return "No se encontró el rol del usuario";

        const rol = await prisma.roles.findUnique({ where: { id: rolFound.id_rol } });
        if (!rol) return "No se encontró el rol";
        // console.log(rol);
        return rol;
        
    } catch (error) {
        // console.log(error.message);
        return null;
    }
}

/**
 * @param file Archivo de imagen;
 * @param modulo Nombre del módulo donde se guardará la imagen;
 */
export const guardarImagen = async (file, modulo) => {
    try {
        const STORE_PATH = '/storage/public/data';
        // Generamos un token único para la imagen
        const token = Math.random().toString(36).substring(2);

        // Renombramos la imagen con ese token
        const extension = file?.type.split('/').pop();
        const nombreArchivo = `${token}.${extension}`;
        
        file.name = nombreArchivo;
        //obtenemos el path donde se guardará la imagen

        
        const newPath = `${STORE_PATH}/${modulo}/${nombreArchivo}`;

        //creamos el directorio si no existe
        if (!fs.existsSync(`${STORE_PATH}/${modulo}`)) {
            fs.mkdirSync(`${STORE_PATH}/${modulo}`, { recursive: true });
        }
        fs.renameSync(file.path, newPath);
      
        // Devolvemos el directorio donde se guardó la imagen
        return `${STORE_PATH}/${modulo}/${nombreArchivo}`;
    } catch (error) {
        // console.log(error.message);
        return null;
    }
}

export const userExist = async (id) => {
    try {
        const user = await prisma.usuarios.findUnique({ where: { id : parseInt(id) } });
        return user ? user : null;
    } catch (error) {
        return null;
    }
}

export const carritoExist = async (id) => {
    try {
        const carrito = await prisma.carrito_compra.findUnique({ where: { id : parseInt(id) } });
        return carrito ? carrito : null;
    } catch (error) {
        return null;
    }
}



export const productoDisponible = async (id) => {
    try {

        const producto = await prisma.productos.findUnique({
            where: {
                id : parseInt(id)
            }
        });

        if (!producto) {
            return {
                estatus: false,
                message: "No se encontró el producto",
                producto: null
            };
        }

        if (!producto.status) {
            return {
                estatus: false,
                message: "El producto no está disponible",
                producto: producto
            };
        }

        return {
            estatus: true,
            message: "Producto disponible",
            producto: producto
        };
    } catch (error) {
        return {
            estatus: false,
            message: error.message,
            producto: null
        };
    }
}

export const getImage = (path) => {
    try {
        const image = fs.readFileSync( path,{encoding: 'base64'});
        let pathSplit = path.split('/');
        let name = pathSplit[pathSplit.length - 1];
        let extension = name.split('.')[1];

        // console.log(name,extension);

        let image64 = `data:image/${extension};base64,${image}`;

        return image64;
        
    } catch (error) {
        // console.log(error.message);
        return null;
    }
}

