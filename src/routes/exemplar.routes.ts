import { Router } from 'express';
import * as exemplarController from '../controllers/exemplar.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/exemplar:
 *   get:
 *     tags: [Exemplares]
 *     summary: Lista os exemplares físicos (rota pública)
 *     responses:
 *       200:
 *         description: Lista de exemplares (com a obra incluída)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exemplar'
 */
router.get('/', exemplarController.listar); // PÚBLICA — catálogo
router.get('/:id', exemplarController.buscarPorId); // PÚBLICA — catálogo
router.post('/', authMiddleware, exemplarController.criar); // PROTEGIDA

export default router;