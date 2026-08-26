import { Request, Response } from 'express';
import * as clienteService from '../services/cliente.service';


export async function criar(req: Request, res: Response): Promise<void> {
  const { nome, cpf, email, telefone,matricula } = req.body;

  const cliente = await clienteService.CriarCliente({ nome, cpf, email, telefone, matricula });


  res.status(201).json(cliente);
}

export async function listar(_req: Request, res: Response): Promise<void> {
  const clientes = await clienteService.listarClientes();
  res.status(200).json(clientes);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
 
  const id = Number(req.params.id);

  const cliente = await clienteService.buscarClientePorId(id);

  res.status(200).json(cliente);
}