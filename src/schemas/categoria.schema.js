import { z } from "zod";    

export const categoriaSchema = z.object({
    nombre: z.string({
        invalid_type_error: "El nombre debe ser un string",
        required_error: "El nombre es requerido"
    }),
    status: z.boolean({ 
        invalid_type_error: "El estatus debe ser un booleano",
    })
    .optional(),
});