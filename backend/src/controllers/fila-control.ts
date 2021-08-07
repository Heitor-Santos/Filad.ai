import { Request, Response } from 'express';
import { Client, fila } from '../repositories/fila-repo';

function entrarNaFila(req: Request, res: Response) {
    const user: Client = {
        nome: req.body.nome,
        idade: req.body.idade,
        sexo: req.body.sexo,
        telegram_id: req.body.telegram_id,
        entrou_na_fila_em: new Date(req.body.date),
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

export { entrarNaFila, sairDaFila, tamanhoDaFila }