import { Request, Response } from 'express';
import * as emprestimoService from '../services/emprestimo.service';

export async function abrir(req: Request, res: Response): Promise<void> {
  const clienteId = req.user!.id;
  const { exemplarId, dataPrevistaDevolucao } = req.body;

  const novaLocacao = await emprestimoService.abrirEmprestimo(clienteId, { exemplarId, dataPrevistaDevolucao });

  res.status(201).json(novaLocacao);
}

export async function listar(req: Request, res: Response): Promise<void> {
  const clienteId = req.user!.id;
  const locacoes = await emprestimoService.listarEmprestimosDoCliente(clienteId);
  res.status(200).json(locacoes);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;
  const locacao = await emprestimoService.buscarEmprestimoPorId(id, clienteId);
  res.status(200).json(locacao);
}

export async function devolver(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;
  const resultado = await emprestimoService.devolverExemplar(id, clienteId);
  res.status(200).json({ mensagem: 'Livro devolvido com sucesso.', locacao: resultado });
}

export async function cancelar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;
  const resultado = await emprestimoService.cancelarEmprestimo(id, clienteId);
  res.status(200).json({ mensagem: 'Empréstimo cancelado com sucesso.', locacao: resultado });
}