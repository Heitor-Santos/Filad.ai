import { Request, Response } from 'express';
import { Client, fila } from '../repositories/fila-repo';
import { atendimentos } from '../repositories/atendimentos-repo';

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
    //else fila.splice(req.body.posicao, 0, user);  
    else fila.push(user)
    return res.send({ data: user })
}

function sairDaFila(req: Request, res: Response) {
    const index = fila.findIndex(client => client.telegram_id == req.query.telegram_id)
    if (index == -1) {
        return res.send({ error: "Esse usuário não está na fila" })
    }
    else {
        const user = fila.splice(index, 1);
        user[0].saiu_da_fila_em = new Date();
        atendimentos.push(user[0]);
        return res.send({ data: user })
    }
}

function tamanhoDaFila(req: Request, res: Response) {
    const index = fila.findIndex(client => client.telegram_id == req.query.telegram_id)
    if (index == -1) {
        return res.send({ error: "Esse usuário não está na fila" })
    }
    else {
        const sizeFila = fila.length;
        const minsTotal = calcularPrevisaoEspera();
        let previsao = minsTotal / sizeFila;

        return res.send({ data: {
            index,
            sizeFila,
            previsao
        } })
    }
}

function calcularPrevisaoEspera() {
    let totalEntrouHoras = 0;
    let totalSaiuHoras = 0;
    let totalEntrouMins = 0;
    let totalSaiuMins = 0;

    atendimentos.forEach(client => {
        totalEntrouHoras += client.entrou_na_fila_em.getHours();
        totalEntrouMins += client.entrou_na_fila_em.getMinutes();
        if(client.saiu_da_fila_em?.getHours() != null) {
            totalSaiuHoras += client.saiu_da_fila_em.getHours();
            totalSaiuMins += client.saiu_da_fila_em.getMinutes();
        }
    });

    totalEntrouHoras *= 60;
    totalSaiuHoras *+ 60;

    totalEntrouMins += totalEntrouHoras;
    totalSaiuMins += totalSaiuHoras;

    return totalEntrouMins - totalSaiuMins;
}

export { entrarNaFila, sairDaFila, tamanhoDaFila }