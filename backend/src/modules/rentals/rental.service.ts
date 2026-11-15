import { RentalStatus, Role, VehicleStatus, type Prisma } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { daysBetween, today } from "../../lib/dates";
import { prisma } from "../../lib/prisma";
import type { CreateRentalInput, RentalQuery } from "./rental.schemas";

interface Requester {
  id: number;
  role: Role;
}

const rentalInclude = {
  vehicle: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.RentalInclude;

export async function list(requester: Requester, query: RentalQuery) {
  return prisma.rental.findMany({
    where: {
      status: query.status,
      userId: requester.role === Role.ADMIN ? undefined : requester.id,
    },
    include: rentalInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(requester: Requester, id: number) {
  const rental = await prisma.rental.findUnique({ where: { id }, include: rentalInclude });

  if (!rental || (requester.role !== Role.ADMIN && rental.userId !== requester.id)) {
    throw new AppError("Locação não encontrada", 404);
  }

  return rental;
}

export async function create(requester: Requester, data: CreateRentalInput) {
  if (data.startDate < today()) {
    throw new AppError("A data de retirada não pode estar no passado");
  }

  const days = daysBetween(data.startDate, data.expectedReturnDate);

  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) {
      throw new AppError("Veículo não encontrado", 404);
    }

    const { count } = await tx.vehicle.updateMany({
      where: { id: vehicle.id, status: VehicleStatus.AVAILABLE },
      data: { status: VehicleStatus.RENTED },
    });
    if (count === 0) {
      throw new AppError("Veículo indisponível para locação", 409);
    }

    return tx.rental.create({
      data: {
        userId: requester.id,
        vehicleId: vehicle.id,
        startDate: data.startDate,
        expectedReturnDate: data.expectedReturnDate,
        dailyRate: vehicle.dailyRate,
        estimatedAmount: vehicle.dailyRate.mul(days),
      },
      include: rentalInclude,
    });
  });
}

export async function returnVehicle(requester: Requester, id: number) {
  const rental = await findById(requester, id);

  if (rental.status !== RentalStatus.ACTIVE) {
    throw new AppError("Esta locação já foi encerrada", 409);
  }

  const daysUsed = Math.max(1, daysBetween(rental.startDate, today()));

  const [updated] = await prisma.$transaction([
    prisma.rental.update({
      where: { id },
      data: {
        status: RentalStatus.RETURNED,
        returnedAt: new Date(),
        totalAmount: rental.dailyRate.mul(daysUsed),
      },
      include: rentalInclude,
    }),
    prisma.vehicle.update({
      where: { id: rental.vehicleId },
      data: { status: VehicleStatus.AVAILABLE },
    }),
  ]);

  return updated;
}
