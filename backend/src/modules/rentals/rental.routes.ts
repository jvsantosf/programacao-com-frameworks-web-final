import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import * as rentalController from "./rental.controller";

export const rentalRoutes = Router();

rentalRoutes.use(authenticate);
rentalRoutes.get("/", rentalController.index);
rentalRoutes.get("/:id", rentalController.show);
rentalRoutes.post("/", rentalController.store);
rentalRoutes.patch("/:id/finish", rentalController.finish);
