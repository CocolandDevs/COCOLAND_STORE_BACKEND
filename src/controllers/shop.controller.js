import prisma from "../libs/client.js";
import { getImage } from "./helper.controller.js";

export const createShop = async (req,res) => {
    const {
        id_usuario,
        id_producto,
        id_ubicacion,
        cantidad,
        fecha_compra,
        tipo_pago
    } = req.body;
    try {
        const shop = await prisma.cOMPRAS_USUARIO.create({
            data: {
            id_usuario,
            id_producto,
            id_ubicacion,
            cantidad,
            fecha_compra: new Date(fecha_compra),
            tipo_pago
            }
        });
        res.status(200).json({
            message: "Shop created successfully",
            shop
        });
        
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const getShop = async (req,res) => {
    
    try {
        // console.log("el body es ",req.body);
        const {id_usuario} = req.body;
        if(!id_usuario) return res.status(400).json("el id del usuario es requerido");

        const shop = await prisma.cOMPRAS_USUARIO.findMany({
            where: {
                id_usuario: parseInt(id_usuario)
            }
        });
        let compras = [];
        if (shop.length > 0) {
            compras = await Promise.allSettled(shop.map(async (compra) => {
                const producto = await prisma.pRODUCTOS.findUnique({
                    where: {
                    id: compra.id_producto
                    }
                });
                let imagen = null;
                if(producto && producto.imagen_default != null){
                    imagen = getImage(producto.imagen_default);
                }
                const ubicacion = await prisma.uBICACIONES_USUARIO.findUnique({
                    where: {
                    id: compra.id_ubicacion
                    }
                });
                return {
                    id: compra.id,
                    id_usuario: compra.id_usuario,
                    cantidad: compra.cantidad,
                    fecha_compra: compra.fecha_compra,
                    tipo_pago: compra.tipo_pago,
                    producto : producto.nombre,
                    ubicacion: ubicacion?.alias,
                    imagen: imagen
                }
            }))

            compras = compras.map((compra) => {
                if (compra.status === "fulfilled") {
                    return compra.value;
                }
            });
        }
        // console.log(compras);
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json([error.message]);
    }
}