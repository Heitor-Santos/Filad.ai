import { Router } from 'express';
import { entrarNaFila, sairDaFila, tamanhoDaFila, getHistory, getStatistics, setFeedback } from '../controllers/fila-control';

const routes: Router = Router();

routes.get('/entrar', entrarNaFila)
routes.get('/sair', sairDaFila)
routes.get('/tamanho', tamanhoDaFila)
routes.get('/historico', getHistory);
routes.get('/estatisticas', getStatistics);
routes.post('/feedback', setFeedback);

export default routes;