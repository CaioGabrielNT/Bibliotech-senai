import { Router } from 'express';
import authRoutes from './auth.routes';
import clienteRoutes from './cliente.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/clientes', clienteRoutes);

export { routes };