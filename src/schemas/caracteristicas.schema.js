import { z } from "zod";

export const caracteristicasSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es requerido",
  }).max(255,{
    message: "El nombre no puede tener mas de 255 caracteres"
  }),
  valor: z.string({
    required_error: "El valor es requerido",
  }).max(255,{
    message: "El valor no puede tener mas de 255 caracteres"
  }),
  status: z.boolean({
    required_error: "El status es requerido",
  }),
});