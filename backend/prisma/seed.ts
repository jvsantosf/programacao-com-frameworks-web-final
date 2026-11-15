import { PrismaClient, Role, VehicleCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const vehicles = [
  { brand: "Fiat", model: "Mobi", year: 2023, plate: "QSA1B23", color: "Branco", category: VehicleCategory.ECONOMY, dailyRate: 89.9 },
  { brand: "Volkswagen", model: "Polo", year: 2024, plate: "RFT2C34", color: "Prata", category: VehicleCategory.HATCH, dailyRate: 129.9 },
  { brand: "Toyota", model: "Corolla", year: 2024, plate: "PBX3D45", color: "Preto", category: VehicleCategory.SEDAN, dailyRate: 219.9 },
  { brand: "Jeep", model: "Compass", year: 2023, plate: "OJK4E56", color: "Cinza", category: VehicleCategory.SUV, dailyRate: 289.9 },
  { brand: "Hyundai", model: "Creta", year: 2025, plate: "SLM5F67", color: "Azul", category: VehicleCategory.SUV, dailyRate: 249.9 },
  { brand: "Fiat", model: "Toro", year: 2024, plate: "QWE6G78", color: "Vermelho", category: VehicleCategory.PICKUP, dailyRate: 319.9 },
];

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@locadora.com" },
    update: {},
    create: { name: "Administrador", email: "admin@locadora.com", password, role: Role.ADMIN },
  });

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({ where: { plate: vehicle.plate }, update: {}, create: vehicle });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
