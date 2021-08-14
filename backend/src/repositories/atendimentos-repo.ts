import { Client } from './fila-repo';

export const atendimentos: Client[] = [
    
]

export const fetchNumberOfClientsToday = () => {
    const now = new Date();
    const lowerbound = new Date(now.getFullYear() + '-' + (('0' + (now.getMonth() + 1)).slice(-2)) + '-' + (('0' + (now.getDate())).slice(-2)) + "T00:00:00.000Z");
    const upperbound = new Date(-1 + lowerbound.getTime() + 1000 * 60 * 60 * 24);
    let ct = 0;
    for (let client of atendimentos) {
        if (client.entrou_na_fila_em && client.entrou_na_fila_em >= lowerbound && client.entrou_na_fila_em <= upperbound) {
            ct++;
        }
    }
    return ct;
};

export const updateRecentClientNps = (telegram_id: number, nps: number) => {
    const size = atendimentos.length;

    for (let i = size - 1; i >= 0; i--) {
        if (telegram_id == atendimentos[i].telegram_id) {
            atendimentos[i].feedback = {
                positivo: nps !== 0,
                descricao: ""
            };
            return;
        }
    }
}