import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarExemplarInput {
  obraId: number;
  codigoIdentificador: string;
  estadoDeConservacao: string;
}

export async function criarExemplar(dados: CriarExemplarInput) {
  const obra = await prisma.obra.findUnique({ where: { obraId: dados.obraId } });

  if (!obra) {
    throw new AppError('Obra não encontrada.', 404);
  }

  return prisma.exemplar.create({
    data: {
      obraId: dados.obraId,
      codigoIdentificador: dados.codigoIdentificador,
      estadoDeConservacao: dados.estadoDeConservacao,
    },
    include: { obra: true },
  });
}

export async function listarExemplares() {
  return prisma.exemplar.findMany({
    include: { obra: true },
    orderBy: { exemplarId: 'asc' },
  });
}

export async function buscarExemplarPorId(exemplarId: number) {
  const exemplar = await prisma.exemplar.findUnique({
    where: { exemplarId },
    include: { obra: true },
  });

  if (!exemplar) {
    throw new AppError('Exemplar não encontrado.', 404);
  }

  return exemplar;
}