import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarLivroInput {
  categoriaId: number;
  codigo: string;
  titulo: string;
  autor: string;
  editora: string;
  genero: string;
  ano: number;
}

interface AtualizarLivroInput {
  categoriaId?: number;
  codigo?: string;
  titulo?: string;
  autor?: string;
  editora?: string;
  genero?: string;
  ano?: number;
  estadoConservacao?: string;
  statusDisponibilidade?: string;
}

export async function criarLivro(dados: CriarLivroInput) {

  const categoria = await prisma.categoriaLivro.findUnique({
    where: { id: dados.categoriaId },
  });

  if (!categoria) {
    throw new AppError('Categoria de livro não encontrada.', 404);
  }

  const livro = await prisma.livros.create({
    data: dados,
    include: { categoria: true },
  });

  return livro;
}

export async function listarLivros(statusDisponibilidade?: string) {
 
  return prisma.livros.findMany({
    where: statusDisponibilidade ? { statusDisponibilidade } : undefined,
    include: { categoria: true },
    orderBy: { id: 'asc' },
  });
}

export async function buscarLivroPorId(id: number) {
  const livro = await prisma.livros.findUnique({
    where: { id },
    include: { categoria: true },
  });

  if (!livro) {
    throw new AppError('Livro não encontrado.', 404);
  }

  return livro;
}

export async function atualizarLivro(id: number, dados: AtualizarLivroInput) {
  // Reaproveita a validação de existência (já lança 404 se não encontrar).
  await buscarLivroPorId(id);

  return prisma.livros.update({
    where: { id },
    data: dados,
    include: { categoria: true },
  });
}