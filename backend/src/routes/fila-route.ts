import { Router } from 'express';
import { sairDaFila, statusFila } from '../controllers/fila-control';

const routes: Router = Router();

routes.post('/sair', sairDaFila)
routes.get('/status', statusFila)

export default routes;