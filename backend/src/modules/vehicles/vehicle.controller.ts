import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/params";
import { updateVehicleSchema, vehicleQuerySchema, vehicleSchema } from "./vehicle.schemas";
import * as vehicleService from "./vehicle.service";

export async function index(req: Request, res: Response) {
  const query = vehicleQuerySchema.parse(req.query);
  res.json(await vehicleService.list(query));
}

export async function show(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await vehicleService.findById(id));
}

export async function store(req: Request, res: Response) {
  const data = vehicleSchema.parse(req.body);
  res.status(201).json(await vehicleService.create(data));
}

export async function update(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const data = updateVehicleSchema.parse(req.body);
  res.json(await vehicleService.update(id, data));
}

export async function destroy(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  await vehicleService.remove(id);
  res.status(204).send();
}
