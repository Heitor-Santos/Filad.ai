import { Router } from 'express';
import { getHistory, getStatistics } from '../controllers/atendimento-control';

const routes: Router = Router();

routes.get('/historico', getHistory);
routes.get('/estatisticas', getStatistics);

export default routes;