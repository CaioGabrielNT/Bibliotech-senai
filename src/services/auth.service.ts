import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface LoginInput {
  email: string;
  senha: string;
}

export async function login(dados: LoginInput) {
  const bibliotecario = await prisma.bibliotecario.findUnique({ where: { email: dados.email } });

  const senhaConfere = await bcrypt.compare(dados.senha, bibliotecario?.senha ?? '');

  if (!bibliotecario || !senhaConfere) {
    throw new AppError('E-mail ou senha inválidos.', 401);
  }

  const token = jwt.sign(
    { id: bibliotecario.id, email: bibliotecario.email },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'] }
  );

  return { token, bibliotecario: { id: bibliotecario.id, nome: bibliotecario.nome, email: bibliotecario.email } };
}