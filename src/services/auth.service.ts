import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface LoginInput{
    email: string;
    senha: string;
}

export async function login(dados: LoginInput){
    const cliente = await prisma.cliente.findUnique({where: {email: dados.email} });
    const senhaConfere = await bcrypt.compare(dados.senha, cliente?.senha ?? '');

    if (!cliente || !senhaConfere){
        throw new AppError ('Email ou senha inválidos.', 401);
    }

    const token = jwt.sign(
        {id: cliente.clienteId, email: cliente.email},
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn']}
    );

    return{
        token,
        cliente: {id: cliente.clienteId, nome: cliente.nome, email: cliente.email},
    };
}