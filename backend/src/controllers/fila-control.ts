import { Request, Response } from 'express';
import { Client, fila } from '../repositories/fila-repo';
import { atendimentos } from '../repositories/atendimentos-repo'

function entrarNaFila(req: Request, res: Response) {
    const user: Client = {
        nome: req.body.nome,
        idade: req.body.idade,
        sexo: req.body.sexo,
        telegram_id: req.body.telegram_id,
        entrou_na_fila_em: new Date(),
        saiu_da_fila_em: null,
    }
    if (fila.find(client => client.telegram_id == user.telegram_id)) {
        return res.send({ error: "Esse usuário já está na fila" })
    }
    else fila.splice(req.body.posicao, 0, user);
    return res.send({ data: user })
}

function sairDaFila(req: Request, res: Response) {
    const index = fila.findIndex(client => client.telegram_id == req.query.telegram_id)
    if (index == -1) {
        return res.send({ error: "Esse usuário não está na fila" })
    }
    else {
        const user = fila.splice(index, 1);
        return res.send({ data: user })
    }
}

function tamanhoDaFila(req: Request, res: Response) {
    const index = fila.findIndex(client => client.telegram_id == req.query.telegram_id)
    if (index == -1) {
        return res.send({ error: "Esse usuário não está na fila" })
    }
    else {
        return res.send({ data: index })
    }
}

function getHistory(req: Request, res: Response) {
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
        return res.status(400).send({error: 'Falhou em retornar os histórico'});
    }
}

function getStatistics(req: Request, res: Response) {
    try {
        const {start, end} = req.query;

        if (!start) {
            return res.status(400).send({ error: 'Data início está vazia' });
        }
        if (!end) {
            return res.status(400).send({ error: 'Data fim está vazia' });
        }

        let data = {
            attendances: 0,
            users: 0,
            good_feedbacks: 0,
            bad_feedbacks: 0,
            avg_time: 0,
            leave_rate: 0,
            attendances_two_hours: new Array()
        };

        let mp = new Map();
        let totalIncomingUsers = 0;
        let date_start = new Date(String(start));
        date_start.setHours(0, 0, 0);

        for(let i = 0; i < 12; i++) {
            data.attendances_two_hours.push({hour : i * 2, pacientes: 0});
        }

        atendimentos.forEach( elem => {
            if (elem.entrou_na_fila_em >= new Date(String(start)) && elem.entrou_na_fila_em <= new Date(String(end))) {
                if(elem.feedback) {
                    if(elem.feedback.positivo)
                        data.good_feedbacks++;
                    else
                        data.bad_feedbacks++;
                }
                if(elem.saiu_da_fila_em === null) {
                    data.leave_rate++;
                } else if(elem.saiu_da_fila_em) {
                    data.avg_time += (elem.saiu_da_fila_em.getTime() - elem.entrou_na_fila_em.getTime());
                    data.attendances++;
                }
                if(elem.entrou_na_fila_em && elem.entrou_na_fila_em.getTime() >= date_start.getTime()) {
                    data.attendances_two_hours[Math.floor(elem.entrou_na_fila_em.getHours() / 2)].pacientes++;
                }

                mp.set(elem.telegram_id, true);
                totalIncomingUsers++;
            }
        });

        data.avg_time = Math.floor(Math.floor(data.avg_time/60000)/data.attendances);
        data.users = mp.size;
        if(totalIncomingUsers > 0)
            data.leave_rate /= totalIncomingUsers;


        return res.send(data);
    } catch (error) {
        return res.status(400).send({error: 'Falhou em retornar estatísticas'});
    }
}

function setFeedback(req: Request, res: Response) {
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
                fila[index].feedback = { positivo: feedback.positivo, descricao: feedback.descricao};
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
}


export { entrarNaFila, sairDaFila, tamanhoDaFila, getHistory, getStatistics, setFeedback }