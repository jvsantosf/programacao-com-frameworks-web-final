import { RentalStatus } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { chargeableDays } from "../../lib/dates";
import { prisma } from "../../lib/prisma";
import type { CreateRentalInput, RentalQuery } from "./rental.schemas";

const START_TOLERANCE_MS = 5 * 60 * 1000;

export async function list(userId: number, query: RentalQuery) {
  return prisma.rental.findMany({
    where: { userId, status: query.status },
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(userId: number, id: number) {
  const rental = await prisma.rental.findFirst({ where: { id, userId }, include: { vehicle: true } });
  if (!rental) {
    throw new AppError("Locação não encontrada", 404);
  }
  return rental;
}

export async function create(userId: number, data: CreateRentalInput) {
  if (data.startDate.getTime() < Date.now() - START_TOLERANCE_MS) {
    throw new AppError("A data de início não pode estar no passado");
  }

  const days = chargeableDays(data.startDate, data.expectedReturnDate);

  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) {
      throw new AppError("Veículo não encontrado", 404);
    }

    const { count } = await tx.vehicle.updateMany({
      where: { id: vehicle.id, available: true },
      data: { available: false },
    });
    if (count === 0) {
      throw new AppError("Veículo indisponível para locação", 409);
    }

    return tx.rental.create({
      data: {
        userId,
        vehicleId: vehicle.id,
        startDate: data.startDate,
        expectedReturnDate: data.expectedReturnDate,
        dailyRate: vehicle.dailyRate,
        totalAmount: vehicle.dailyRate.mul(days),
      },
      include: { vehicle: true },
    });
  });
}

export async function finish(userId: number, id: number) {
  return prisma.$transaction(async (tx) => {
    const rental = await tx.rental.findFirst({ where: { id, userId } });
    if (!rental) {
      throw new AppError("Locação não encontrada", 404);
    }

    const { count } = await tx.rental.updateMany({
      where: { id, status: RentalStatus.ACTIVE },
      data: { status: RentalStatus.FINISHED, returnedAt: new Date() },
    });
    if (count === 0) {
      throw new AppError("Esta locação já foi finalizada", 409);
    }

    await tx.vehicle.update({ where: { id: rental.vehicleId }, data: { available: true } });

    return tx.rental.findUniqueOrThrow({ where: { id }, include: { vehicle: true } });
  });
}
