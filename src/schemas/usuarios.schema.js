import { z } from "zod";

const validationId = [
  z.string().regex(/^\d+$/),
  z.number().int().positive(),
];

export const usuarioSchema = z.object({
  username: z
    .string({
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
  status: z
    .boolean({
      invalid_type_error: "Status must be a boolean",
    })
    .optional(),
  rol: z
  .number({
    required_error: "Rol is required",
    invalid_type_error: "Rol must be a number"
  })
  .positive({
    message: "Rol must be a positive number"
  })
  .int({
    message: "Rol must be an integer"
  })
});

export const updateUsuarioSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    })
    .optional(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .optional(),
  status: z
    .boolean({
      invalid_type_error: "Status must be a boolean",
    })
    .optional(),
  rol: z
  .number({
    required_error: "Rol is required",
    invalid_type_error: "Rol must be a number"
  })
  .positive({
    message: "Rol must be a positive number"
  })
  .int({
    message: "Rol must be an integer"
  })
});

export const emailSchema = z
  .string({
    required_error: "El email es requerido",
  })
  .email({
    message: "El email no es valido",
  });

export const passwordSchema = z
  .string({
    required_error: "La contraseña es requerida",
  })
  .min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  });

export const perfilUsuarioSchema = z.object({
  idUsuario: z
    .number({
      invalid_type_error: "El id del usuario debe ser un número"
    })
    .int({
      message: "El id del usuario debe ser un número entero"
    })
    .positive({
      message: "El id del usuario debe ser un número positivo"
    })
    .optional(),
});

export const ubicacionSchema = z.object({
  id_usuario: z
    .union([...validationId, z.string()],{
      invalid_type_error: "Usuario debe ser un número entero positivo",
      required_error: "Usuario es requerido",
    }),
  direccion : z
    .string({
      required_error: "La dirección es requerida",
    }),
  codigo_postal : z
    .union([...validationId, z.string()],{
      invalid_type_error: "Código postal debe ser un número entero positivo",
      required_error: "Código postal es requerido",
    }),
  ciudad: z
    .string({
      required_error: "La ciudad es requerida",
    }),
  estado: z
    .string({
      required_error: "El estado es requerido",
    }),
  pais: z
    .string({
      required_error: "El país es requerido",
    }),
  numero_interior: z
    .string({
      required_error: "El número interior es requerido",
    })
    .optional(),
  numero_exterior: z
    .string({
      required_error: "El número exterior es requerido",
    })
    .optional(),
  alias: z
    .string({
      required_error: "El alias es requerido",
    })
    .optional(),
  numero_telefonico: z
    .union([...validationId],{
      invalid_type_error: "Número telefónico debe ser un número entero positivo",
      required_error: "Número telefónico es requerido",
    }),
  status: z
    .boolean({
      invalid_type_error: "Status must be a boolean",
    })
    .optional(),
});
