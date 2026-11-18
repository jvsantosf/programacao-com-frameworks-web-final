import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { verifyToken } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Token não informado", 401);
  }

  try {
    req.userId = verifyToken(token);
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }

  next();
}
