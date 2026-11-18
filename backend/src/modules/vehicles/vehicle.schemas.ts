import { VehicleCategory } from "@prisma/client";
import { z } from "zod";

const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
const maxYear = new Date().getFullYear() + 1;

export const vehicleSchema = z.object({
  brand: z.string().trim().min(2, "Marca é obrigatória").max(60),
  model: z.string().trim().min(1, "Modelo é obrigatório").max(60),
  year: z.coerce.number().int().min(1990, "Ano inválido").max(maxYear, "Ano inválido"),
  plate: z
    .string()
    .trim()
    .toUpperCase()
    .transform((value) => value.replace(/[^A-Z0-9]/g, ""))
    .pipe(z.string().regex(plateRegex, "Placa inválida (ex.: ABC1D23 ou ABC1234)")),
  color: z.string().trim().min(2, "Cor é obrigatória").max(30),
  category: z.enum(VehicleCategory, "Categoria inválida"),
  dailyRate: z.coerce.number().positive("A diária deve ser maior que zero").max(99999999),
});

export const vehicleQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.enum(VehicleCategory).optional(),
  available: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleQuery = z.infer<typeof vehicleQuerySchema>;
