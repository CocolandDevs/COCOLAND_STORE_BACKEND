//aquí van las validaciones pára los datos que reciben las peticiones

import { z } from "zod";

export const registerSchema = z.object({
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
});

export const loginSchema = z.object({
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
});

export const passwordRecoverySchema = z.object({
   email: z .string({ 
    required_error: "Email is required", 
  }) 
  .email({ message: "Invalid email",

   }), 
});

export const resetPasswordSchema = z.object({
  password: z.string({ 
    required_error: "Password is required", 
  }).min(6, { message: "Password must be at least 6 characters long" }),
  
  confirmPassword: z.string({
    required_error: "Confirm Password is required", 
  })
}).refine((data) => data.password === data.confirmPassword, { 
  message: "Passwords do not match", 
  path: ["confirmPassword"], 
});

