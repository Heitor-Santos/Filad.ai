import { Router } from 'express';
import { sairDaFila, statusFila, getHistory, getStatistics, setFeedback } from '../controllers/fila-control';

const routes: Router = Router();

routes.post('/sair', sairDaFila);
routes.get('/status', statusFila);
routes.get('/historico', getHistory);
routes.get('/estatisticas', getStatistics);
routes.post('/feedback', setFeedback);

export default routes;