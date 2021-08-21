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
    msgText += "\n\nPor favor, avalie sua experiencia usando nossa plataforma:"
    const arr = getClientsAfterUser(telegram_id);
    removeUser(telegram_id);
    sendMessagesStatusToAll(arr);
    getChatbot().requestNps(telegram_id, msgText);
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
            phone: usr.phone_number
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

export { entrarNaFila, sairDaFila, getPrevisaoUser, statusFila, calcularPrevisaoEspera }
