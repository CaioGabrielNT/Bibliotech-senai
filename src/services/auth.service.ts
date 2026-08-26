import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface LoginInput {
  email: string;
  senha: string;
}

export async function login(dados: LoginInput) {
  const cliente = await prisma.leitor.findUnique({ where: { email: dados.email } });


  const matriculaConfere = await bcrypt.compare(dados.matricula, cliente?.matricula ?? '');


  if (!cliente || !matriculaConfere) {
    throw new AppError('E-mail ou senha inválidos.', 401);
  }

  const token = jwt.sign(
    { id: cliente.id, email: cliente.email },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'] }
  );

  return {
    token,
    cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email },
  };
}