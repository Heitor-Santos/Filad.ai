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
    const index = fila.findIndex(client => client.telegram_id == req.query.telegram_id)
    if (index == -1) {
        return res.send({ error: "user_not_found" })
    }

    const user = fila.splice(index, 1)[0];
    user.saiu_da_fila_em = new Date();
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

function getPrevisaoUser(telegram_id: string) {
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
        if (client.entrou_na_fila_em && client.saiu_da_fila_em) {
            total -= client.entrou_na_fila_em.getTime();
            total += client.saiu_da_fila_em.getTime();
        }
    });

    total /= 1000 * 60; // ms => minutes
    return (total / atendimentos.length) || 0;
}

export { entrarNaFila, sairDaFila, getPrevisaoUser, statusFila }