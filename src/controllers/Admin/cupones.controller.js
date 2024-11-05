import prisma from "../../libs/client.js";

export const getAllCupones = async (req, res) => {
    try {
        const cupones = await prisma.cupones.findMany();
        return res.status(200).json(cupones);
    } catch (error) {
        return res.status(500).json([error.message]);
    }
}

export const getCupon = async (req, res) => {
    const { id } = req.params;
    try {
        const cupon = await prisma.cupones.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!cupon) return res.status(400).json(["Cupon not found"]);
        return res.status(200).json(cupon);
    } catch (error) {
        return res.status(500).json([error.message]);
    }
}

export const createCupon = async (req, res) => {
    const {
      nombre,
      descripcion,
      porcentaje_descuento,
      limite_usos,
      fecha_inicio,
      fecha_fin,
      status,
    } = req.body;

    try {
        let dateInicio = new Date(fecha_inicio);
        let dateFin = new Date(fecha_fin);
        let today = new Date();

        if (dateFin < today) {
            return res.status(400).json(["La fecha de inicio debe ser mayor a la fecha actual"]);
        }

        const cupon = await prisma.cupones.create({
            data: {
                nombre,
                descripcion,
                porcentaje_descuento : parseFloat(porcentaje_descuento),
                limite_usos :limite_usos? parseInt(limite_usos) : 1,
                fecha_inicio: dateInicio,
                fecha_fin: dateFin,
                status,
            },
        });

        res.status(200).json({
            message: "Cupon created successfully",
            cupon,
        });

    } catch (error) {
        res.status(500).json([error.message]);
    }
}

export const updateCupon = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            porcentaje_descuento,
            limite_usos,
            fecha_inicio,
            fecha_fin,
            status,
        } = req.body;

        let dateInicio = new Date(fecha_inicio);
        let dateFin = new Date(fecha_fin);
        let today = new Date();

        if (dateFin < today) {
            return res.status(400).json(["La fecha de inicio debe ser mayor a la fecha actual"]);
        }

        const cupon = await prisma.cupones.update({
            where: {
                id: parseInt(id),
            },
            data: {
                nombre,
                descripcion,
                porcentaje_descuento : parseFloat(porcentaje_descuento),
                limite_usos :limite_usos ? parseInt(limite_usos) : 1,
                fecha_inicio : dateInicio,
                fecha_fin : dateFin,
                status,
            },
        });

        res.status(200).json({
            message: "Cupon updated successfully",
            cupon,
        });

    } catch (error) {
        res.status(500).json([error.message]);        
    }
}

export const deleteCupon = async (req, res) => {
    const { id } = req.params;
    try {
        const cupon = await prisma.cupones.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!cupon) return res.status(400).json(["Cupon not found"]);

        const cuponDeleted = await prisma.cupones.update({
            where: {
                id: parseInt(id),
            },
            data: {
                status: false,
            },
        })

        return res.status(200).json({
            message: "Cupon deleted successfully",
            cuponDeleted,
        });

    } catch (error) {
        return res.status(500).json([error.message]);
    }
}
