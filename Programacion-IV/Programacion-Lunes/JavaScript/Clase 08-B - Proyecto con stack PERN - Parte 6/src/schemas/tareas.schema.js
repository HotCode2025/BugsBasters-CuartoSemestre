import { z } from "zod";

export const tareaSchema = z.object({
  titulo: z
    .string({ required_error: "El título es obligatorio" })
    .trim()
    .min(1, "El título es obligatorio"),
  descripcion: z
    .string({ required_error: "La descripción es obligatoria" })
    .trim()
    .min(1, "La descripción es obligatoria"),
});