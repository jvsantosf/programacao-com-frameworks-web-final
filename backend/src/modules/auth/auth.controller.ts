import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schemas";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  res.status(201).json(await authService.register(data));
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  res.json(await authService.login(data));
}

export async function me(req: Request, res: Response) {
  res.json(await authService.getProfile(req.userId!));
}
