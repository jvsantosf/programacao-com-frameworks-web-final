import { VehicleCategory, VehicleStatus } from "@prisma/client";
import { z } from "zod";

const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
const maxYear = new Date().getFullYear() + 1;

export const vehicleSchema = z.object({
  brand: z.string().trim().min(2).max(60),
  model: z.string().trim().min(1).max(60),
  year: z.coerce.number().int().min(1990).max(maxYear),
  plate: z
    .string()
    .trim()
    .toUpperCase()
    .transform((value) => value.replace(/[^A-Z0-9]/g, ""))
    .pipe(z.string().regex(plateRegex, "Placa inválida (ex.: ABC1D23 ou ABC1234)")),
  color: z.string().trim().min(2).max(30),
  category: z.enum(VehicleCategory),
  dailyRate: z.coerce.number().positive("Diária deve ser maior que zero").max(99999999),
  status: z.enum([VehicleStatus.AVAILABLE, VehicleStatus.MAINTENANCE]).optional(),
  imageUrl: z
    .url("URL da imagem inválida")
    .max(500)
    .nullish()
    .or(z.literal("").transform(() => null)),
});

export const updateVehicleSchema = vehicleSchema.partial();

export const vehicleQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(VehicleStatus).optional(),
  category: z.enum(VehicleCategory).optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleQuery = z.infer<typeof vehicleQuerySchema>;
