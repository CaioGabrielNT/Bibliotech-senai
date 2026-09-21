import { Router } from 'express';
import * as emprestimoController from '../controllers/emprestimo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/emprestimo:
 *   post:
 *     tags: [Empréstimos]
 *     summary: Abre um empréstimo para o cliente autenticado (RN01)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exemplarId, dataPrevistaDevolucao]
 *             properties:
 *               exemplarId: { type: integer, example: 1 }
 *               dataPrevistaDevolucao:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-30T12:00:00.000Z"
 *     responses:
 *       201:
 *         description: Empréstimo criado; o exemplar passa a 'Emprestado'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emprestimo'
 *       400:
 *         description: Exemplar indisponível (RN01) ou data inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaErro'
 *       401:
 *         description: Token ausente, inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaErro'
 *       404:
 *         description: Exemplar não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaErro'
 */
router.post('/', emprestimoController.abrir);
router.get('/', emprestimoController.listar);
router.get('/:id', emprestimoController.buscarPorId);

/**
 * @openapi
 * /api/emprestimo/{id}/devolver:
 *   patch:
 *     tags: [Empréstimos]
 *     summary: Devolve o exemplar e finaliza o empréstimo (RN02)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Devolvido; o exemplar volta a 'Disponivel'
 *       400:
 *         description: Empréstimo já finalizado ou cancelado
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: O empréstimo pertence a OUTRO cliente
 *       404:
 *         description: Empréstimo não encontrado
 */
router.patch('/:id/devolver', emprestimoController.devolver);
router.patch('/:id/cancelar', emprestimoController.cancelar);

export default router;