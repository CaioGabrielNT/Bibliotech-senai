import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

const SELECT_CLIENTE_PUBLICO = {
    id: true,
    nome: true,
    cpf: true,
    email: true,
    telefone: true,
    criadoEm: true
} as const;

interface CriarClienteInput {
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    matricula:string
}

export async function CriarCliente(dados: CriarClienteInput){

    const clienteCriado = await prisma.leitor.create({
        data: {...dados},
        select: SELECT_CLIENTE_PUBLICO
    })
    
    return clienteCriado;
}

export async function listarClientes() {
    return prisma.leitor.findMany({
        select: SELECT_CLIENTE_PUBLICO,
        orderBy: {id: 'asc'},
    });
}

export async function buscarClientePorId(id: number){
    const cliente = await prisma.leitor.findUnique({
        where: {id},
        select: SELECT_CLIENTE_PUBLICO,
    });
    if (!cliente) {
        throw new AppError('Cliente não encontrado. ',404);
    }
    return cliente
}