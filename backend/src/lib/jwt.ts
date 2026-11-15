import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env";

export interface TokenPayload {
  sub: string;
  role: Role;
}

export function signToken(userId: number, role: Role) {
  const options: SignOptions = {
    subject: String(userId),
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({ role }, env.JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
