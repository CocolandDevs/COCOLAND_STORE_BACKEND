import { z } from "zod";    

export const categoriaSchema = z.object({
    nombre: z.string({
        required_error: "El nombre es requerido"
    }),
    status: z.boolean({
        required_error: "El status es requerido"
    }),
});