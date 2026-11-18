import { PrismaClient, RentalStatus, VehicleCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const users = [
  { name: "Maria Silva", email: "maria@locadora.com", password: "123456" },
  { name: "João Souza", email: "joao@locadora.com", password: "123456" },
];

const vehicles = [
  { brand: "Fiat", model: "Mobi", year: 2023, plate: "QSA1B23", color: "Azul", category: VehicleCategory.ECONOMY, dailyRate: 89.9 },
  { brand: "Volkswagen", model: "Polo", year: 2024, plate: "RFT2C34", color: "Azul", category: VehicleCategory.HATCH, dailyRate: 129.9 },
  { brand: "Toyota", model: "Corolla", year: 2024, plate: "PBX3D45", color: "Branco", category: VehicleCategory.SEDAN, dailyRate: 219.9 },
  { brand: "Jeep", model: "Compass", year: 2023, plate: "OJK4E56", color: "Branco", category: VehicleCategory.SUV, dailyRate: 289.9 },
  { brand: "Hyundai", model: "Creta", year: 2025, plate: "SLM5F67", color: "Prata", category: VehicleCategory.SUV, dailyRate: 249.9 },
  { brand: "Fiat", model: "Toro", year: 2024, plate: "QWE6G78", color: "Vermelho", category: VehicleCategory.PICKUP, dailyRate: 319.9 },
];

async function main() {
  const createdUsers = [];
  for (const user of users) {
    const password = await bcrypt.hash(user.password, 10);
    createdUsers.push(
      await prisma.user.upsert({ where: { email: user.email }, update: {}, create: { ...user, password } }),
    );
  }

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({ where: { plate: vehicle.plate }, update: {}, create: vehicle });
  }

  const [maria] = createdUsers;
  const hasHistory = await prisma.rental.count({ where: { userId: maria.id } });

  if (!hasHistory) {
    const corolla = await prisma.vehicle.findUniqueOrThrow({ where: { plate: "PBX3D45" } });
    const startDate = new Date(Date.now() - 10 * DAY_IN_MS);
    const expectedReturnDate = new Date(startDate.getTime() + 3 * DAY_IN_MS);

    await prisma.rental.create({
      data: {
        userId: maria.id,
        vehicleId: corolla.id,
        startDate,
        expectedReturnDate,
        returnedAt: expectedReturnDate,
        dailyRate: corolla.dailyRate,
        totalAmount: corolla.dailyRate.mul(3),
        status: RentalStatus.FINISHED,
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
