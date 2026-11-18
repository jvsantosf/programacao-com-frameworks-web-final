import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function signToken(userId: number) {
  const options: SignOptions = {
    subject: String(userId),
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({}, env.JWT_SECRET, options);
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Invalid token payload");
  }
  return Number(payload.sub);
}
