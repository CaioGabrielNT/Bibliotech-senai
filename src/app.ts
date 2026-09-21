import 'express-async-errors'
import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.get('/', (_req, res) => {
    res.json({mensagem: 'API Bibliotech está funcionando!'});
});

app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use(errorHandler)
export {app};