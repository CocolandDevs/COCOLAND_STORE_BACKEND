import prisma from "../libs/client.js";

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
        console.log("el body es ",req.body);
        const {id_usuario} = req.body;
        if(!id_usuario) return res.status(400).json("el id del usuario es requerido");

        const shop = await prisma.cOMPRAS_USUARIO.findMany({
            where: {
                id_usuario: parseInt(id_usuario)
            }
        });
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json([error.message]);
    }
}