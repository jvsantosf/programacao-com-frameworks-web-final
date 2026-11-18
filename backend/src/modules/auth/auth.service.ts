import bcrypt from "bcryptjs";
import { AppError } from "../../errors/app-error";
import { signToken } from "../../lib/jwt";
import { prisma } from "../../lib/prisma";
import type { LoginInput, RegisterInput } from "./auth.schemas";

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const;

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError("E-mail já cadastrado", 409);
  }

  const password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { ...data, password },
    select: publicUserFields,
  });

  return { user, token: signToken(user.id) };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const valid = user && (await bcrypt.compare(data.password, user.password));

  if (!user || !valid) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  const { password: _password, updatedAt: _updatedAt, ...publicUser } = user;
  return { user: publicUser, token: signToken(user.id) };
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserFields });
  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }
  return user;
}
