import { Router } from 'express';
import filaRoute from './fila-route';

const routes: Router = Router();

routes.use('/fila', filaRoute)

export default routes