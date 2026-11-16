import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre es obligatorio"),
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .toLowerCase()
    .email("El correo no tiene un formato válido"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const signinSchema = z.object({
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .toLowerCase()
    .email("El correo no tiene un formato válido"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria"),
});