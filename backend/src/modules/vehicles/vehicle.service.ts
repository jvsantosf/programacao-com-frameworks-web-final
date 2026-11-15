import { VehicleStatus, type Prisma } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { prisma } from "../../lib/prisma";
import type { UpdateVehicleInput, VehicleInput, VehicleQuery } from "./vehicle.schemas";

export async function list(query: VehicleQuery) {
  const where: Prisma.VehicleWhereInput = {
    status: query.status,
    category: query.category,
  };

  if (query.search) {
    where.OR = [
      { brand: { contains: query.search } },
      { model: { contains: query.search } },
      { plate: { contains: query.search.toUpperCase() } },
    ];
  }

  return prisma.vehicle.findMany({ where, orderBy: [{ brand: "asc" }, { model: "asc" }] });
}

export async function findById(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw new AppError("Veículo não encontrado", 404);
  }
  return vehicle;
}

export async function create(data: VehicleInput) {
  await ensurePlateIsFree(data.plate);
  return prisma.vehicle.create({ data });
}

export async function update(id: number, data: UpdateVehicleInput) {
  const vehicle = await findById(id);

  if (data.status && vehicle.status === VehicleStatus.RENTED) {
    throw new AppError("Não é possível alterar o status de um veículo locado", 409);
  }

  if (data.plate && data.plate !== vehicle.plate) {
    await ensurePlateIsFree(data.plate);
  }

  return prisma.vehicle.update({ where: { id }, data });
}

export async function remove(id: number) {
  const vehicle = await findById(id);

  if (vehicle.status === VehicleStatus.RENTED) {
    throw new AppError("Não é possível excluir um veículo locado", 409);
  }

  const rentals = await prisma.rental.count({ where: { vehicleId: id } });
  if (rentals > 0) {
    throw new AppError("Veículo possui histórico de locações e não pode ser excluído", 409);
  }

  await prisma.vehicle.delete({ where: { id } });
}

async function ensurePlateIsFree(plate: string) {
  const existing = await prisma.vehicle.findUnique({ where: { plate } });
  if (existing) {
    throw new AppError("Já existe um veículo com essa placa", 409);
  }
}
