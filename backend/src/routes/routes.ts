import { Router } from 'express';
import filaRoute from './fila-route';
import estabelecimentoRoute from './estabelecimento-route'

const routes: Router = Router();

routes.use('/fila', filaRoute)
routes.use('/estabelecimento', estabelecimentoRoute)


export default routes