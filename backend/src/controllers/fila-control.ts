import { Request, Response } from 'express';
import { fila, Client, pushNewClient, findUser, findUserIndex, removeUser, getClientsAfterUser } from '../repositories/fila-repo';
import { atendimentos, fetchNumberOfClientsToday } from '../repositories/atendimentos-repo';
import { getChatbot } from '../index';

const entrarNaFila = (user: Client) => {
    if (findUser(user.telegram_id)) {
        return { error: "user_already_in_queue" };
    }
    pushNewClient(user);

    return getPrevisaoUser(user.telegram_id);
}

const sendMessagesStatusToAll = (arr: number[]) => {
    const chatbot = getChatbot();
    arr.forEach((chat_id: number) => {
        chatbot.requestStatus(chat_id);
    });
}

const sairDaFila = (req: Request, res: Response) => {
    const telegram_id = Number(req.body.telegram_id);
    const user: Client | undefined = findUser(telegram_id);
    if (!user) {
        return res.send({ error: "user_not_found" })
    }

    let msgText = "";
    const firstName = user.nome.split(' ')[0];


    if (req.body.desistencia) {
        user.desistencia = true;
        msgText = `Poxa ${firstName}, que pena que nao pudestes esperar :/`;
    } else {
        user.saiu_da_fila_em = new Date();
        msgText = `Vimos que você seguiu para atendimento, obrigado por esperar!`;
    }
    const arr = getClientsAfterUser(telegram_id);
    removeUser(telegram_id);
    sendMessagesStatusToAll(arr);
    getChatbot().sendMessageText(telegram_id, msgText);
    atendimentos.push(user);
    return res.send({ data: user })
}

const statusFila = (req: Request, res: Response) => {
    const queryFila: any = [];

    fila.map(usr => {
        queryFila.push({
            name: usr.nome,
            age: usr.idade,
            sex: usr.sexo,
            telegram_id: usr.telegram_id,
            username: usr.username,
        });
    });

    return res.send({
        fila: queryFila,
        total: queryFila.length,
        clientsToday: fetchNumberOfClientsToday(),
        averageWaitMin: calcularPrevisaoEspera(),
    })
}

const getPrevisaoUser = (telegram_id: number) => {
    const index = findUserIndex(telegram_id);
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

const calcularPrevisaoEspera = () => {
    let total = 0;

    atendimentos.forEach(client => {
        if (client.desistencia) return;
        if (client.entrou_na_fila_em && client.saiu_da_fila_em) {
            total -= client.entrou_na_fila_em.getTime();
            total += client.saiu_da_fila_em.getTime();
        }
    });

    total /= 1000 * 60; // ms => minutes
    return Math.floor((total / atendimentos.length) || 0);
}

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

const setFeedback = (req: Request, res: Response) => {
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
                //TODO - FIX
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
