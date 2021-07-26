import { Router } from 'express';

const routes: Router = Router();

routes.get('/teste',(req,res)=>{
    res.send({"Resposta":"Tudo OK"})
});
export default routes