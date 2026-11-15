import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/params";
import { createRentalSchema, rentalQuerySchema } from "./rental.schemas";
import * as rentalService from "./rental.service";

export async function index(req: Request, res: Response) {
  const query = rentalQuerySchema.parse(req.query);
  res.json(await rentalService.list(req.user!, query));
}

export async function show(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await rentalService.findById(req.user!, id));
}

export async function store(req: Request, res: Response) {
  const data = createRentalSchema.parse(req.body);
  res.status(201).json(await rentalService.create(req.user!, data));
}

export async function giveBack(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await rentalService.returnVehicle(req.user!, id));
}
