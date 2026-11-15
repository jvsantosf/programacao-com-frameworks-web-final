import { RentalStatus } from "@prisma/client";
import { z } from "zod";

const isoDate = z.iso.date("Data inválida (use AAAA-MM-DD)").transform((value) => new Date(value));

export const createRentalSchema = z
  .object({
    vehicleId: z.coerce.number().int().positive(),
    startDate: isoDate,
    expectedReturnDate: isoDate,
  })
  .refine((data) => data.expectedReturnDate > data.startDate, {
    message: "A devolução prevista deve ser posterior à retirada",
    path: ["expectedReturnDate"],
  });

export const rentalQuerySchema = z.object({
  status: z.enum(RentalStatus).optional(),
});

export type CreateRentalInput = z.infer<typeof createRentalSchema>;
export type RentalQuery = z.infer<typeof rentalQuerySchema>;
