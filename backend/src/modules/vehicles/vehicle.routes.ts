import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as vehicleController from "./vehicle.controller";

export const vehicleRoutes = Router();

const adminOnly = [authenticate, authorize(Role.ADMIN)];

vehicleRoutes.get("/", vehicleController.index);
vehicleRoutes.get("/:id", vehicleController.show);
vehicleRoutes.post("/", adminOnly, vehicleController.store);
vehicleRoutes.put("/:id", adminOnly, vehicleController.update);
vehicleRoutes.delete("/:id", adminOnly, vehicleController.destroy);
