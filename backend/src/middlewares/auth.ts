import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { AppError } from "../errors/app-error";
import { verifyToken } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: Role };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Token não informado", 401);
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: Number(payload.sub), role: payload.role };
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }

  next();
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Acesso negado", 403);
    }
    next();
  };
}
