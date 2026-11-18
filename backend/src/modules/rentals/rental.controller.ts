import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/params";
import { createRentalSchema, rentalQuerySchema } from "./rental.schemas";
import * as rentalService from "./rental.service";

export async function index(req: Request, res: Response) {
  const query = rentalQuerySchema.parse(req.query);
  res.json(await rentalService.list(req.userId!, query));
}

export async function show(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await rentalService.findById(req.userId!, id));
}

export async function store(req: Request, res: Response) {
  const data = createRentalSchema.parse(req.body);
  res.status(201).json(await rentalService.create(req.userId!, data));
}

export async function finish(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await rentalService.finish(req.userId!, id));
}
