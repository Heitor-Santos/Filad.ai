import { Request, Response } from 'express';
import { calcularPrevisaoEspera } from './fila-control'
import { atendimentos } from '../repositories/atendimentos-repo';

const getHistory = (req: Request, res: Response) => {
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

const getStatistics = (req: Request, res: Response) => {
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
            avg_time: calcularPrevisaoEspera(),
            leave_rate: 0,
            attendances_two_hours: new Array()
        };

        let mp = new Map();
        let totalIncomingUsers = 0;
        let today = new Date();
        today.setHours(0, 0, 0);

        for (let i = 0; i < 12; i++) {
            data.attendances_two_hours.push({ hour: i * 2, atendidos: 0 });
        }

        atendimentos.forEach(elem => {
            if (elem.entrou_na_fila_em >= new Date(String(start)) && elem.entrou_na_fila_em <= new Date(String(end))) {
                if (elem.feedback) {
                    if (elem.feedback.positivo)
                        data.good_feedbacks++;
                    else
                        data.bad_feedbacks++;
                }
                if (elem.desistencia) {
                    data.leave_rate++;
                } else if (elem.saiu_da_fila_em) {
                    data.attendances++;
                }
                if (elem.entrou_na_fila_em.getTime() >= new Date(String(start)).getTime() && elem.saiu_da_fila_em && elem.saiu_da_fila_em.getTime() <= new Date(String(end)).getTime()) {
                    data.attendances_two_hours[Math.floor(elem.entrou_na_fila_em.getHours() / 2)].atendidos++;
                }

                mp.set(elem.telegram_id, true);
                totalIncomingUsers++;
            }
        });

        data.users = mp.size;
        if (totalIncomingUsers > 0)
            data.leave_rate = Math.floor(100 * data.leave_rate / totalIncomingUsers);

        return res.send(data);
    } catch (error) {
        return res.status(400).send({ error: 'Falhou em retornar estatísticas' });
    }
}

export { getHistory, getStatistics }
