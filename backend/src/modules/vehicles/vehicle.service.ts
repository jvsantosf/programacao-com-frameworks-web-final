import type { Prisma } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { prisma } from "../../lib/prisma";
import type { VehicleInput, VehicleQuery } from "./vehicle.schemas";

export async function list(query: VehicleQuery) {
  const where: Prisma.VehicleWhereInput = {
    category: query.category,
    available: query.available,
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
  const existing = await prisma.vehicle.findUnique({ where: { plate: data.plate } });
  if (existing) {
    throw new AppError("Já existe um veículo com essa placa", 409);
  }
  return prisma.vehicle.create({ data });
}
