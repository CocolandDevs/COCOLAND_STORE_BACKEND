import { z } from "zod";

export const cuponSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un string",
    })
    .min(3)
    .max(255),
  descripcion: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser un string",
    })
    .min(3)
    .max(255),
  porcentaje_descuento: z
    .number({
      invalid_type_error: "El porcentaje de descuento debe ser un número",
      required_error: "El porcentaje de descuento es requerido",
    })
    .min(1)
    .max(100),
  limite_usos: z
    .number({
      invalid_type_error: "El limite de usos debe ser un número",
    })
    .min(1)
    .optional()
    .nullable(),
  fecha_inicio: z.
    string({
        required_error: "La fecha de inicio es requerida",
        invalid_type_error: "La fecha de inicio debe ser una fecha",
    }).date({
        message: "La fecha de inicio debe ser una fecha",
    }),
  fecha_fin: z
    .string({
        required_error: "La fecha de fin es requerida",
        invalid_type_error: "La fecha de fin debe ser una fecha",
    })
    .date({
        required_error: "La fecha de fin es requerida",
        invalid_type_error: "La fecha de fin debe ser una fecha",
    }),
  status: z
    .boolean({
      invalid_type_error: "El estatus debe ser un booleano",
    })
    .optional(),
});
