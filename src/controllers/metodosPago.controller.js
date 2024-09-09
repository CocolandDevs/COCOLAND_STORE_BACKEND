import { Prisma } from "@prisma/client"
import prisma from "../libs/client.js";

export const getMethodsPayment = async (req, res) => {
    try {
        const {id} = req.params;
        if (id) {
            const methodPayment = await  prisma.mETODOS_PAGO.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!methodPayment) return res.status(400).json(["Método no encontrado"]);

            return res.status(200).json(methodPayment);
        }

        const methodPayment = await prisma.mETODOS_PAGO.findMany();
        res.status(200).json(methodPayment);

    } catch (error) {
        res.status(400).json([error.message]);
    }
}

export const createMethodPayment = async (req, res) => {
    try {
        const {nombre, id_usuario, id_paypal, numero_tarjeta, fecha_vencimiento, cvv, status, tipo} = req.body;

        const methodPayment = await prisma.mETODOS_PAGO.create({
            data: {
                nombre,
                id_usuario : parseInt(id_usuario),
                id_paypal : id_paypal ?? null,
                tipo,
                numero_tarjeta : numero_tarjeta ?? null,
                fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
                cvv: cvv ? parseInt(cvv) : null,
                status: status ?? true
            }
        });

        res.status(200).json(methodPayment);
    } catch (error) {
        res.status(400).json([error.message]);
    }
}

export const updateMethodPayment = async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre, id_usuario, id_paypal, numero_tarjeta, fecha_vencimiento, cvv, status, tipo} = req.body;

        const methodPayment = await prisma.mETODOS_PAGO.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nombre,
                id_usuario : parseInt(id_usuario),
                id_paypal : id_paypal ?? null,
                tipo,
                numero_tarjeta : numero_tarjeta ?? null,
                fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
                cvv: cvv ? parseInt(cvv) : null,
                status: status ?? true
            }
        });

        res.status(200).json(methodPayment);
    } catch (error) {
        res.status(400).json([error.message]);
    }
}

export const deleteMethodPayment = async (req, res) => {
    try {
        const {id} = req.params;

        const methodPayment = await prisma.mETODOS_PAGO.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status: false
            }   
        });
        res.status(200).json(methodPayment);
    } catch (error) {
        res.status(400).json([error.message]);
    }
}