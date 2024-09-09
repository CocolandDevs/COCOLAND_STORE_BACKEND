import { z } from "zod";

export const paymentMethodSchema = z.object({
  nombre: z.string({
    required_error: "Nombre del método de pago es requerido",
  }),
  id_usuario: z.union(
    [
      z
        .string({
          required_error: "el Usuario es requerido",
        })
        .regex(/^\d+$/, {
          message: "El id del usuario debe ser un número positivo",
        }),
      z
        .number({
          required_error: "id del usuario es requerido",
        })
        .int({
          message: "El id del usuario debe ser un número entero",
        })
        .positive({
          message: "El id del usuario debe ser un número positivo",
        }),
    ],
    {
      invalid_type_error: "id del usuario debe ser un número entero positivo",
      required_error: "id del usuario es requerido",
    }
  ),
  id_paypal: z.string({
    required_error: "Id de paypal es requerido",
  }),
  numero_tarjeta: z.string({
    required_error: "Número de tarjeta es requerido",
  }),
  fecha_vencimiento: z
    .string({
      required_error: "Fecha de vencimiento de la tarjeta es requerida",
    })
    .date({
      message: "Fecha de nacimiento no es válida",
    }),
  cvv: z
    .number({
      required_error: "CVV de la tarjeta es requerido",
    })
    .int({
      message: "CVV de la tarjeta debe ser un número entero",
    }),
  status: z.boolean({
    required_error: "Status del método de pago es requerido",
  }),
});
