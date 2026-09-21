import { Router } from "express"; 
import authRoutes from './auth.routes';
import clienteRoutes from './cliente.routes';
import obraRoutes from './obra.routes';
import exemplarRoutes from './exemplar.routes';
import emprestimoRoutes from './emprestimo.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/cliente', clienteRoutes);
routes.use('/obra', obraRoutes);
routes.use('/exemplar', exemplarRoutes);
routes.use('/emprestimo', emprestimoRoutes);

export {routes};
