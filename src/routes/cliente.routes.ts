import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller';

const router = Router();

router.post('/', clienteController.criar);
router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscarPorId);

export default router;