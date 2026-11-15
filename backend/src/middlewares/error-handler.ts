import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      message: "Dados inválidos",
      issues: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Registro já existe" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Registro não encontrado" });
    }
  }

  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
