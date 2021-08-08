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

routes.get('/estatisticas', async(req, res) => {
    try {
        const {start, end} = req.query;

        if (!start) {
            return res.status(400).send({ error: 'Data início está vazia' });
        }
        if (!end) {
            return res.status(400).send({ error: 'Data fim está vazia' });
        }

        let data = {
            atendimentos_realizados: 0,
            total_usuarios: 0,
            feedbacks_positivos: 0,
            feedbacks_negativos: 0,
            tempo_medio: 0,
            taxa_abandono: 0,
            hora_atendimentos: new Array()
        };

        let mp = new Map();

        atendimentos.forEach( elem => {
            if (elem.entrou_na_fila_em >= new Date(String(start)) && elem.entrou_na_fila_em <= new Date(String(end))) {
                if(elem.feedback) {
                    if(elem.feedback.positivo)
                        data.feedbacks_positivos++;
                    else
                        data.feedbacks_negativos++;
                }
                if(elem.saiu_da_fila_em === null) {
                    data.taxa_abandono++;
                } else if(elem.saiu_da_fila_em) {
                    data.tempo_medio += (elem.saiu_da_fila_em.getTime() - elem.entrou_na_fila_em.getTime());
                    data.atendimentos_realizados++;
                }
                if(elem.entrou_na_fila_em) {
                    data.hora_atendimentos.push(elem.entrou_na_fila_em);
                }

                mp.set(elem.telegram_id, true);
            }
        });

        data.tempo_medio = Math.floor(Math.floor(data.tempo_medio/60000)/data.atendimentos_realizados);
        data.total_usuarios = mp.size;
        if(data.total_usuarios > 0)
            data.taxa_abandono /= data.total_usuarios;

        data.hora_atendimentos = data.hora_atendimentos.sort((a, b) => a.getTime() - b.getTime());

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