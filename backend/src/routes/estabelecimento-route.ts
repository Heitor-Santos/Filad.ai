import { Router } from 'express';
import { atendimentos } from '../repositories/atendimentos-repo'

const routes: Router = Router();

routes.get('/historico', async(req, res) => {
    try {
        const {start, end} = req.query;

        if (!start) {
            return res.status(400).send({ error: 'Data início está vazia' });
        }
        if (!end) {
            return res.status(400).send({ error: 'Data fim está vazia' });
        }

        let data = atendimentos.filter( elem => {
            return (elem.entrou_na_fila_em >= new Date(String(start)) && elem.entrou_na_fila_em <= new Date(String(end)));
        });

        return res.send(data);
    } catch (error) {
        return res.status(400).send({error: 'Falou em retornar os estabelecimentos'});
    }
});

export default routes;