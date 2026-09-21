import { Request, Response } from 'express';
import * as exemplarService from '../services/exemplar.service';

export async function criar(req: Request, res: Response): Promise<void> {
  const { obraId, codigoIdentificador, estadoDeConservacao } = req.body;
  const exemplar = await exemplarService.criarExemplar({
    obraId: Number(obraId),
    codigoIdentificador,
    estadoDeConservacao,
  });
  res.status(201).json(exemplar);
}

export async function listar(_req: Request, res: Response): Promise<void> {
  const exemplares = await exemplarService.listarExemplares();
  res.status(200).json(exemplares);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const exemplar = await exemplarService.buscarExemplarPorId(id);
  res.status(200).json(exemplar);
}