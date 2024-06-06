//aquí van las validaciones pára los datos que reciben las peticiones

import {z} from "zod";

export const usuarioSchema = z.object({
    nombres: z.string({
        required_error: 'Nombres is required'
    }),
    apellidos: z.string({
        required_error: 'Apellidos is required'
    }),
    edad: z.number({
        required_error: 'Edad is required'
    }),
    grado: z.number({
        required_error: 'Grado is required'
    }),
})