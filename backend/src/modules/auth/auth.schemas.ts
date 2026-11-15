import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres").max(120),
  email: z.email("E-mail inválido").trim().toLowerCase(),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
});

export const loginSchema = z.object({
  email: z.email("E-mail inválido").trim().toLowerCase(),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
