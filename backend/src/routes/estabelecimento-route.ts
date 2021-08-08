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
        return res.status(400).send({error: 'Falhou em retornar os estabelecimentos'});
    }
});

routes.post('/feedback', async(req, res) => {
    try {
        const {telegram_id, feedback} = req.body;

        if(!telegram_id) {
            return res.status(400).send({ error: 'Telegram_id não recebido'});
        }

        if(!feedback) {
            return res.status(400).send({ error: 'Feedback não recebido'});
        }

        if(typeof(feedback.positivo) !== 'boolean' || typeof(feedback.descricao) !== 'string') {
            return res.status(400).send({ error: 'Feedback não está no formato correto'});
        }

        let feedbackSaved: boolean = false;

        atendimentos.forEach( (elem, index) => {
            if(elem.telegram_id === telegram_id) {
                atendimentos[index].feedback = { positivo: feedback.positivo, descricao: feedback.descricao};
                feedbackSaved = true;
            }
        });

        if(!feedbackSaved) {
            return res.status(400).send({ error: 'Usuário não encontrado'});
        }

        return res.send({feedbackSaved});
    } catch (error) {
        return res.status(400).send({error: 'Falhou em salvar feedback'});
    }
});



export default routes;