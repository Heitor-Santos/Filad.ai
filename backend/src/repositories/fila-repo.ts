export interface Client {
    telegram_id: number;
    nome: string;
    sexo: string;
    idade: number;
    username?: string;
    entrou_na_fila_em: Date;
    saiu_da_fila_em: Date | null;
    feedback?: {
        positivo: boolean;
        descricao: string;
    };
    desistencia?: boolean;
    contexto?: string;
    phone_number?: string;
}

export const fila: Client[] = [

]

const pushNewClient = (usr: Client) => {
    fila.push(usr);
}

const findUser = (telegram_id: number) => {
    return fila.find(client => client.telegram_id == telegram_id);
}

const findUserIndex = (telegram_id: number) => {
    return fila.findIndex(client => client.telegram_id == telegram_id);
}

const removeUser = (telegram_id: number) => {
    const idx = findUserIndex(telegram_id);
    if (idx == -1) return;
    fila.splice(idx, 1);
}

const updateUser = (telegram_id: number, body: any) => {
    const idx = findUserIndex(telegram_id);
    if (idx == -1) return '404_UserNotFound'

    var saiu_da_fila_em;
    var feedback;
    var desistencia;
    var contexto;
    var sexo;
    var idade;
    var phone_number;
    for (let key of Object.keys(body)) {
        if (key == 'saiu_da_fila_em') saiu_da_fila_em = body[key];
        if (key == 'feedback') feedback = body[key];
        if (key == 'desistencia') desistencia = body[key];
        if (key == 'contexto') contexto = body[key];
        if (key == 'sexo') sexo = body[key];
        if (key == 'idade') idade = body[key];
        if (key == 'phone_number') phone_number = body[key];
    }
    if (saiu_da_fila_em) fila[idx].saiu_da_fila_em = saiu_da_fila_em;
    if (feedback) fila[idx].feedback = feedback;
    if (desistencia) fila[idx].desistencia = desistencia;
    if (contexto) fila[idx].contexto = contexto;
    if (sexo) fila[idx].sexo = sexo;
    if (idade) fila[idx].idade = idade;
    if (phone_number) fila[idx].phone_number = phone_number;

    return '200_success';
}

const getClientsAfterUser = (telegram_id: number) => {
    const ret: number[] = [];

    const idx = findUserIndex(telegram_id);
    if (idx == -1) return ret;

    for (let i = idx + 1; i < fila.length; i++) {
        ret.push(fila[i].telegram_id);
    }

    return ret;
}

export { pushNewClient, findUser, findUserIndex, removeUser, updateUser, getClientsAfterUser };