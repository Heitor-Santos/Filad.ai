export interface Client{
    telegram_id: number;
    nome: string;
    sexo: string;
    idade: number;
    entrou_na_fila_em: Date;
    saiu_da_fila_em: Date | null;
    feedback?:{
        positivo: boolean;
        descricao: string;
    }
} 

export const fila: Client[] = [

]