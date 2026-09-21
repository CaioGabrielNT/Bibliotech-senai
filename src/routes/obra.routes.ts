import { Router } from 'express';
import * as obraController from '../controllers/obra.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', obraController.listar); // PÚBLICA — catálogo
router.get('/:id', obraController.buscarPorId); // PÚBLICA — catálogo
router.post('/', authMiddleware, obraController.criar); // PROTEGIDA
router.put('/:id', authMiddleware, obraController.atualizar); // PROTEGIDA

export default router;