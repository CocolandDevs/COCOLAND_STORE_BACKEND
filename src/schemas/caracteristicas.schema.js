import { z } from "zod";

export const caracteristicasSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un string",
    }).max(255,{
      message: "El nombre no puede tener mas de 255 caracteres"
    }),
  valor: z
    .string({
      invalid_type_error: "El valor debe ser un string",
      required_error: "El valor es requerido",
    }).max(255,{
      message: "El valor no puede tener mas de 255 caracteres"
    }),
  status: z
    .boolean({
      invalid_type_error: "El status debe ser un boolean",
    }).optional()
});