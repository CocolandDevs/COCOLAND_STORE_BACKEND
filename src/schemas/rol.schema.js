//aquí van las validaciones pára los datos que reciben las peticiones

import { nullable, z } from "zod";

export const rolSchema = z.object({
  nombre: z.string({
    required_error: "Nombre del rol is required",
  }),
  status: z.boolean({
    invalid_type_error: "El estatus debe ser un booleano",
  }).optional(),
});
