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
}

export const fila: Client[] = [

]