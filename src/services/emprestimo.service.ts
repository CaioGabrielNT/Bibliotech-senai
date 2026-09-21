import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface AbrirEmprestimoInput {
  exemplarId: number;
  dataPrevistaDevolucao: string;
}

export async function abrirEmprestimo(clienteId: number, dados: AbrirEmprestimoInput) {
  return prisma.$transaction(async (tx) => {
    const exemplar = await tx.exemplar.findUnique({
      where: { exemplarId: dados.exemplarId },
      include: { obra: true },
    });

    if (!exemplar) {
      throw new AppError('Exemplar não encontrado.', 404);
    }

    if (exemplar.statusDisponibilidade !== 'Disponivel') {
      throw new AppError('Este exemplar não está disponível para empréstimo no momento.', 400);
    }

    const dataRetirada = new Date();
    const dataPrevistaDevolucao = new Date(dados.dataPrevistaDevolucao);

    if (
      Number.isNaN(dataPrevistaDevolucao.getTime()) ||
      dataPrevistaDevolucao <= dataRetirada
    ) {
      throw new AppError('A data prevista de devolução deve ser uma data válida e futura.', 400);
    }

    await tx.exemplar.update({
      where: { exemplarId: exemplar.exemplarId },
      data: { statusDisponibilidade: 'Emprestado' },
    });

    const emprestimo = await tx.emprestimo.create({
      data: {
        clienteId,
        exemplarId: exemplar.exemplarId,
        dataRetirada,
        dataPrevistaDevolucao,
        statusContrato: 'Ativo',
      },
      include: { exemplar: { include: { obra: true } } },
    });

    return emprestimo;
  });
}

export async function listarEmprestimosDoCliente(clienteId: number) {
  return prisma.emprestimo.findMany({
    where: { clienteId },
    include: { exemplar: { include: { obra: true } } },
    orderBy: { emprestimoId: 'desc' },
  });
}

export async function buscarEmprestimoPorId(id: number, clienteId: number) {
  const emprestimo = await prisma.emprestimo.findUnique({
    where: { emprestimoId: id },
    include: { exemplar: { include: { obra: true } } },
  });

  if (!emprestimo) {
    throw new AppError('Empréstimo não encontrado.', 404);
  }

  if (emprestimo.clienteId !== clienteId) {
    throw new AppError('Este empréstimo não pertence ao cliente autenticado.', 403);
  }

  return emprestimo;
}

export async function devolverExemplar(id: number, clienteId: number) {
  return prisma.$transaction(async (tx: any) => {
    const emprestimo = await tx.emprestimo.findUnique({ where: { emprestimoId: id } });

    if (!emprestimo) {
      throw new AppError('Empréstimo não encontrado.', 404);
    }
    if (emprestimo.clienteId !== clienteId) {
      throw new AppError('Este empréstimo não pertence ao cliente autenticado.', 403);
    }
    if (emprestimo.statusContrato !== 'Ativo') {
      throw new AppError('Este empréstimo já foi finalizado ou cancelado, não é possível devolvê-lo novamente.', 400);
    }

    await tx.exemplar.update({
      where: { exemplarId: emprestimo.exemplarId },
      data: { statusDisponibilidade: 'Disponivel' },
    });

    const emprestimoAtualizado = await tx.emprestimo.update({
      where: { emprestimoId: id },
      data: { dataDevolucaoReal: new Date(), statusContrato: 'Finalizado' },
      include: { exemplar: { include: { obra: true } } },
    });

    return emprestimoAtualizado;
  });
}
export async function cancelarEmprestimo(id: number, clienteId: number) {
  return prisma.$transaction(async (tx) => {
    const emprestimo = await tx.emprestimo.findUnique({ where: { emprestimoId: id } });

    if (!emprestimo) {
      throw new AppError('Empréstimo não encontrado.', 404);
    }
    if (emprestimo.clienteId !== clienteId) {
      throw new AppError('Este empréstimo não pertence ao cliente autenticado.', 403);
    }
    if (emprestimo.statusContrato !== 'Ativo') {
      throw new AppError('Este empréstimo não pode mais ser cancelado.', 400);
    }

    await tx.exemplar.update({
      where: { exemplarId: emprestimo.exemplarId },
      data: { statusDisponibilidade: 'Disponivel' },
    });

    const emprestimoAtualizado = await tx.emprestimo.update({
      where: { emprestimoId: id },
      data: { statusContrato: 'Cancelado' },
      include: { exemplar: { include: { obra: true } } },
    });

    return emprestimoAtualizado;
  });
}