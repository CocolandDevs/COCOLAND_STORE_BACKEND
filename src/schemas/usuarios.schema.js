import { z } from "zod";

export const usuarioSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
    status: z.
      boolean(),
});

export const emailSchema = z.string({
  required_error: "El email es requerido",
}).email({
  message: "El email no es valido",
});

export const passwordSchema = z.string({
  required_error: "La contraseña es requerida",
}).min(6,{
  message: "La contraseña debe tener al menos 6 caracteres"
});