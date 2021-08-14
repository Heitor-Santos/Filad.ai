import { Router } from 'express';
import filaRoute from './fila-route';
import atendimentoRoute from './atendimento-route';

const routes: Router = Router();

routes.use('/fila', filaRoute)
routes.use('/atendimento', atendimentoRoute)

export default routes