import prisma from "../libs/client.js";

export const getCaracteristicas = async (req,res) => {
    const {id} = req.params;
    try {
        if (id) {
            const caracteristica = await prisma.cARACTERISTICAS.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return res.status(200).json(caracteristica);
        }
        const caracteristicas = await prisma.cARACTERISTICAS.findMany();
        return res.status(200).json(caracteristicas);
    } catch (error) {
        return res.status(500).json([error.message]);
    }
}

export const createCaracteristicas = async (req,res) => {
    const { nombre, valor, status } = req.body;

    try {
        const caracteristica = await prisma.cARACTERISTICAS.create({
            data: {
                nombre,
                valor,
                status
            }
        });

        res.status(200).json({
            message: "Caracteristica created successfully",
            caracteristica
        });
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const updateCaracteristicas = async (req,res) => {
    const { id } = req.params;
    const { nombre, valor, status } = req.body;

    try {
        const caracteristica = await prisma.cARACTERISTICAS.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nombre,
                valor,
                status
            }
        });

        res.status(200).json({
            message: "Caracteristica updated successfully",
            caracteristica
        });
    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const deleteCaracteristicas = async (req,res) => {
    const { id } = req.params;

    try {
       const caracteristicaDelete = await prisma.cARACTERISTICAS.update({
            where: {
                id: parseInt(id)
            },data: {
                status: false
            }
        });

        res.status(200).json({
            message: "Caracteristica deleted successfully",
            caracteristicaDelete
        });
    } catch (error) {
        res.status(500).json([error.message]);
    }
}