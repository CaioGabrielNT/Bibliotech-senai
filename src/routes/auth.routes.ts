import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Faz login e devolve um token JWT
 *     description: >
 *       Troca e-mail + senha por um token JWT com validade de 1 dia.
 *       Use o token no botão **Authorize** para acessar as rotas protegidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: leitor@teste.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Cliente Teste
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: leitor@teste.com
 *       401:
 *         description: E-mail ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaErro'
 */
router.post('/login', authController.login);

export default router;