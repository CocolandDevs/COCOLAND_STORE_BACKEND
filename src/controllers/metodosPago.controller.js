import prisma from "../libs/client.js";
import {stripe} from "../libs/stripe.js";

export const getMethodsPayment = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const methodPayment = await prisma.mETODOS_PAGO.findFirst({
                where: {
                    id_usuario: parseInt(id)
                }
            });

            if (!methodPayment) return res.status(400).json(["Método no encontrado"]);

            // Si es necesario, también podrías hacer una consulta a Stripe usando el `id_stripe`
            if (methodPayment.id_stripe) {
                const stripePaymentMethod = await stripe.paymentMethods.retrieve(methodPayment.id_stripe);
                return res.status(200).json({
                    ...methodPayment,
                    stripePaymentMethod
                });
            }

            return res.status(200).json(methodPayment);
        }

        const methodPayments = await prisma.mETODOS_PAGO.findMany();
        res.status(200).json(methodPayments);

    } catch (error) {
        res.status(400).json([error.message]);
    }
};


export const createMethodPayment = async (req, res) => {
    try {
        const {nombre, id_usuario, id_paypal, numero_tarjeta, fecha_vencimiento, cvv, status, tipo} = req.body;

        // Crear PaymentMethod en Stripe si el tipo es tarjeta
        let paymentMethodId = null;

        if (tipo === 'card') {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: numero_tarjeta,
                    exp_month: new Date(fecha_vencimiento).getMonth() + 1,  // Mes de vencimiento
                    exp_year: new Date(fecha_vencimiento).getFullYear(),     // Año de vencimiento
                    cvc: cvv,
                }
            });

            paymentMethodId = paymentMethod.id;
        } else if (tipo === 'paypal') {
            // Aquí puedes integrar la API de PayPal si decides incluir PayPal como método de pago
            paymentMethodId = id_paypal;
        }

        // Guarda el método de pago en tu base de datos
        const methodPayment = await prisma.mETODOS_PAGO.create({
            data: {
                nombre,
                id_usuario: parseInt(id_usuario),
                id_paypal: id_paypal ?? null,
                tipo,
                numero_tarjeta: numero_tarjeta ?? null,
                fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
                cvv: cvv ? parseInt(cvv) : null,
                status: status ?? true,
                id_stripe: paymentMethodId  // Guarda el ID del método de pago en Stripe
            }
        });

        res.status(200).json(methodPayment);
    } catch (error) {
        res.status(400).json([error.message]);
    }
};

export const updateMethodPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_usuario, id_paypal, numero_tarjeta, fecha_vencimiento, cvv, status, tipo } = req.body;

        // Busca el método de pago en la base de datos
        const existingPaymentMethod = await prisma.mETODOS_PAGO.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingPaymentMethod) return res.status(400).json(["Método no encontrado"]);

        // Actualiza el método de pago en Stripe si es necesario
        if (existingPaymentMethod.id_stripe) {
            await stripe.paymentMethods.update(existingPaymentMethod.id_stripe, {
                card: {
                    number: numero_tarjeta,
                    exp_month: new Date(fecha_vencimiento).getMonth() + 1,
                    exp_year: new Date(fecha_vencimiento).getFullYear(),
                    cvc: cvv,
                }
            });
        }

        // Actualiza el método de pago en la base de datos
        const updatedMethodPayment = await prisma.mETODOS_PAGO.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nombre,
                id_usuario: parseInt(id_usuario),
                id_paypal: id_paypal ?? null,
                tipo,
                numero_tarjeta: numero_tarjeta ?? null,
                fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
                cvv: cvv ? parseInt(cvv) : null,
                status: status ?? true
            }
        });

        res.status(200).json(updatedMethodPayment);
    } catch (error) {
        res.status(400).json([error.message]);
    }
};


export const deleteMethodPayment = async (req, res) => {
    try {
        const { id } = req.params;

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
};
