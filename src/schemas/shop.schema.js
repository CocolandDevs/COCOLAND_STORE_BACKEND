import {z} from 'zod';
const validationId = [
    z.string({
        required_error: "Id es requerido",
    }).regex(/^\d+$/, {
        message: "El id debe ser un número positivo"
    }),
    z.number({
        required_error: "Id es requerido",
    }).int({
        message: "El id debe ser un número entero"
    }).positive({
        message: "El id debe ser un número positivo"
    }),
];


export const shopSchema = z.object({
    id_usuario : z
        .union(validationId,{
            invalid_type_error: "Usuario debe ser un número entero positivo",
            required_error: "Usuario es requerido",
        }),
    id_producto : z
        .union(validationId,{
            invalid_type_error: "Producto debe ser un número entero positivo",
            required_error: "Producto es requerido",
        }),
    id_ubicacion : z.union(validationId,{
        invalid_type_error: "Ubicación debe ser un número entero positivo",
        required_error: "Ubicación es requerida",
    }),
    cantidad: z
        .number({
            invalid_type_error: "Cantidad debe ser un número",
            required_error: "Cantidad",
        })
        .int({
            message: "La cantidad debe ser un número entero"
        })
        .positive({
            message: "La cantidad debe ser un número positivo"
        }),
    fecha_compra :z
        .string()
        .date("La fecha de compra debe ser una fecha"),
    tipo_pago : z
        .string({
            invalid_type_error: "Tipo de pago debe ser un texto",
            required_error: "Tipo de pago es requerido",
        }),
});