import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

const SELECT_CLIENTE_PUBLICO = {
    clienteId: true,
    nome: true,
    matricula: true,
    email: true,
    telefone: true,
    criadoEm: true,
} as const;

interface CriarClienteInput{
    nome: string,
    matricula: string,
    email: string,
    senha: string,
    telefone: string,
    possuiPendencia: boolean,
}

export async function CriarCliente(dados: CriarClienteInput){
   if (!dados.senha) {
    throw new AppError('A senha é obrigatória.', 400);
  }

  // 2. Validação se o e-mail ou a matrícula já existem (Evita falhas brutas de Unique no banco)
  const clienteExiste = await prisma.cliente.findFirst({
    where: {
      OR: [
        { email: dados.email },
        { matricula: dados.matricula }
      ]
    }
  });

  if (clienteExiste) {
    throw new AppError('E-mail ou matrícula já cadastrados.', 400);
  }

  // 3. Hash da senha
  const senhaHash = await bcrypt.hash(dados.senha, 10);

  // 4. Criação no banco
  const clienteCriado = await prisma.cliente.create({
    data: {
      ...dados,
      senha: senhaHash,
      possuiPendencia: dados.possuiPendencia ?? false,
    },
    select: SELECT_CLIENTE_PUBLICO
  });

  return clienteCriado;
}

export async function listarClientes(){
    return prisma.cliente.findMany({
        select: SELECT_CLIENTE_PUBLICO,
        orderBy: {clienteId: 'asc'},
    });
}

export async function buscarClientePorId(clienteId: number){
    const cliente = await prisma.cliente.findUnique({
        where: {clienteId},
        select: SELECT_CLIENTE_PUBLICO,
    });

    if (!cliente){
        throw new AppError('Cliente não encontrado.', 404);
    }
    return cliente;
}