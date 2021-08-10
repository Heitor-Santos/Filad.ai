import { Request, Response } from 'express';
import { Client, fila } from '../repositories/fila-repo';
import { atendimentos } from '../repositories/atendimentos-repo';

function entrarNaFila(user: Client) {
    if (fila.find(client => client.telegram_id == user.telegram_id)) {
        return { error: "user_already_in_queue" };
    }
    fila.push(user);
    return getPrevisaoUser(user.telegram_id);
}

function sairDaFila(req: Request, res: Response) {
    const index = fila.findIndex(client => client.telegram_id == Number(req.query.telegram_id))
    if (index == -1) {
        return res.send({ error: "user_not_found" })
    }

    const user = fila.splice(index, 1)[0];
    if (req.query.desistencia) {
        user.desistencia = true;
    } else {
        user.saiu_da_fila_em = new Date();
    }
    atendimentos.push(user);
    return res.send({ data: user })
}

function statusFila(req: Request, res: Response) {
    const queryFila: any = [];

    fila.map(usr => {
        queryFila.push({
            name: usr.nome,
            age: usr.idade,
            sex: usr.sexo,
            telegram_id: usr.telegram_id
        });
    });

    return res.send({
        fila: queryFila,
        total: queryFila.length,
        averageWait: calcularPrevisaoEspera(),
    })
}

function getPrevisaoUser(telegram_id: number) {
    const index = fila.findIndex(client => client.telegram_id == telegram_id);
    if (index == -1) {
        return { error: "user_not_found" };
    }

    const minMedioPorPessoa = calcularPrevisaoEspera();
    const previsao = minMedioPorPessoa * index;

    return {
        posicao: index + 1,
        previsao
    };
}

function calcularPrevisaoEspera() {
    let total = 0;

    atendimentos.forEach(client => {
        if (client.desistencia) return;
        if (client.entrou_na_fila_em && client.saiu_da_fila_em) {
            total -= client.entrou_na_fila_em.getTime();
            total += client.saiu_da_fila_em.getTime();
        }
    });

    total /= 1000 * 60; // ms => minutes
    return (total / atendimentos.length) || 0;
}

function getHistory(req: Request, res: Response) {
    try {
        const { start, end } = req.query;

        if (!start) {
            return res.status(400).send({ error: 'Data início está vazia' });
        }
        if (!end) {
            return res.status(400).send({ error: 'Data fim está vazia' });
        }

        let data = atendimentos.filter(elem => {
            return (elem.entrou_na_fila_em >= new Date(String(start)) && elem.entrou_na_fila_em <= new Date(String(end)));
        });

        return res.send(data);
    } catch (error) {
        return res.status(400).send({ error: 'Falhou em retornar os histórico' });
    }
}

function getStatistics(req: Request, res: Response) {
    try {
        const { start, end } = req.query;

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
        let today = new Date();
        today.setHours(0, 0, 0);

        for (let i = 0; i < 12; i++) {
            data.attendances_two_hours.push({ hour: i * 2, pacientes: 0 });
        }

        atendimentos.forEach(elem => {
            if (elem.entrou_na_fila_em >= new Date(String(start)) && elem.entrou_na_fila_em <= new Date(String(end))) {
                if (elem.feedback) {
                    if (elem.feedback.positivo)
                        data.good_feedbacks++;
                    else
                        data.bad_feedbacks++;
                }
                if (elem.saiu_da_fila_em === null) {
                    data.leave_rate++;
                } else if (elem.saiu_da_fila_em) {
                    data.avg_time += (elem.saiu_da_fila_em.getTime() - elem.entrou_na_fila_em.getTime());
                    data.attendances++;
                }
                if (elem.entrou_na_fila_em && elem.entrou_na_fila_em.getTime() >= today.getTime()) {
                    data.attendances_two_hours[Math.floor(elem.entrou_na_fila_em.getHours() / 2)].pacientes++;
                }

                mp.set(elem.telegram_id, true);
                totalIncomingUsers++;
            }
        });

        data.avg_time = Math.floor(Math.floor(data.avg_time / 60000) / data.attendances);
        data.users = mp.size;
        if (totalIncomingUsers > 0)
            data.leave_rate /= totalIncomingUsers;


        return res.send(data);
    } catch (error) {
        return res.status(400).send({ error: 'Falhou em retornar estatísticas' });
    }
}

function setFeedback(req: Request, res: Response) {
    try {
        const { telegram_id, feedback } = req.body;

        if (!telegram_id) {
            return res.status(400).send({ error: 'Telegram_id não recebido' });
        }

        if (!feedback) {
            return res.status(400).send({ error: 'Feedback não recebido' });
        }

        if (typeof (feedback.positivo) !== 'boolean' || typeof (feedback.descricao) !== 'string') {
            return res.status(400).send({ error: 'Feedback não está no formato correto' });
        }

        let feedbackSaved: boolean = false;

        atendimentos.forEach((elem, index) => {
            if (elem.telegram_id === telegram_id) {
                fila[index].feedback = { positivo: feedback.positivo, descricao: feedback.descricao };
                feedbackSaved = true;
            }
        });

        if (!feedbackSaved) {
            return res.status(400).send({ error: 'Usuário não encontrado' });
        }

        return res.send({ feedbackSaved });
    } catch (error) {
        return res.status(400).send({ error: 'Falhou em salvar feedback' });
    }
}

export { entrarNaFila, sairDaFila, getPrevisaoUser, statusFila, getHistory, getStatistics, setFeedback }
