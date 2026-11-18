import { RentalStatus } from "@prisma/client";
import { z } from "zod";

const dateTime = z.iso
  .datetime({ offset: true, error: "Data inválida" })
  .transform((value) => new Date(value));

export const createRentalSchema = z
  .object({
    vehicleId: z.coerce.number().int().positive("Veículo inválido"),
    startDate: dateTime,
    expectedReturnDate: dateTime,
  })
  .refine((data) => data.expectedReturnDate > data.startDate, {
    message: "A devolução prevista deve ser posterior ao início",
    path: ["expectedReturnDate"],
  });

export const rentalQuerySchema = z.object({
  status: z.enum(RentalStatus).optional(),
});

export type CreateRentalInput = z.infer<typeof createRentalSchema>;
export type RentalQuery = z.infer<typeof rentalQuerySchema>;
