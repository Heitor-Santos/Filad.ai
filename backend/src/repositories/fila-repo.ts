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
}

export const fila: Client[] = [

]

export const findUser = (telegram_id: number) => {
    return fila.find(client => client.telegram_id == telegram_id);
}

export const findUserIndex = (telegram_id: number) => {
    return fila.findIndex(client => client.telegram_id == telegram_id);
}

export const updateUser = (telegram_id: number, body: any) => {
    const idx = findUserIndex(telegram_id);
    if (idx == -1) return '404_UserNotFound'

    var saiu_da_fila_em;
    var feedback;
    var desistencia;
    var contexto;
    var sexo;
    var idade;
    for (let key of Object.keys(body)) {
        if (key == 'saiu_da_fila_em') saiu_da_fila_em = body[key];
        if (key == 'feedback') feedback = body[key];
        if (key == 'desistencia') desistencia = body[key];
        if (key == 'contexto') contexto = body[key];
        if (key == 'sexo') sexo = body[key];
        if (key == 'idade') idade = body[key];
    }
    if (saiu_da_fila_em) fila[idx].saiu_da_fila_em = saiu_da_fila_em;
    if (feedback) fila[idx].feedback = feedback;
    if (desistencia) fila[idx].desistencia = desistencia;
    if (contexto) fila[idx].contexto = contexto;
    if (sexo) fila[idx].sexo = sexo;
    if (idade) fila[idx].idade = idade;

    return '200_success';
}