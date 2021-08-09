import { Router } from 'express';
import { entrarNaFila, sairDaFila, tamanhoDaFila } from '../controllers/fila-control';

const routes: Router = Router();

routes.get('/entrar', entrarNaFila)
routes.get('/sair', sairDaFila)
routes.get('/tamanho', tamanhoDaFila)

export default routes;