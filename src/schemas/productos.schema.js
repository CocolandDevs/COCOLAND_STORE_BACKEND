import { z } from "zod";

export const productosSchema = z.object({
    nombre: z.string({
        required_error: "Nombre del producto es requerido",
    }),
    descripcion: z.string({
        required_error: "Descripción del producto es requerida",
    }).max(255,{
        message: "La descripción del producto no puede tener más de 255 caracteres"
    }),
    id_categoria: z.number({
        required_error: "Categoria del producto es requerida",
    }).int({
        message: "La categoria del producto debe ser un número entero"
    }).positive({
        message: "La categoria del producto debe ser un número positivo"
    }),
    precio: z.number({
        required_error: "Precio del producto es requerido",
    
    }).positive({
        message: "El precio del producto debe ser un número positivo"
    }),
    imagen_defualt: z.string({
        required_error: "imagen del producto es requerido",
    }),
    status: z.boolean().nullable(),
});