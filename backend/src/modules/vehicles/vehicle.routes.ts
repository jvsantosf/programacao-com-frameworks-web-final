import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import * as vehicleController from "./vehicle.controller";

export const vehicleRoutes = Router();

vehicleRoutes.use(authenticate);
vehicleRoutes.get("/", vehicleController.index);
vehicleRoutes.get("/:id", vehicleController.show);
vehicleRoutes.post("/", vehicleController.store);
