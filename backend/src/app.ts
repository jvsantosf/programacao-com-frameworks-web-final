import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import { authRoutes } from "./modules/auth/auth.routes";
import { rentalRoutes } from "./modules/rentals/rental.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",") }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rentals", rentalRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.use(errorHandler);
