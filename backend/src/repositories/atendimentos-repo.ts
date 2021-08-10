import { Client } from './fila-repo';

export const atendimentos: Client[] = [
    {
        telegram_id: 1,
        nome: 'Francisco',
        sexo: 'M',
        idade: 21,
        entrou_na_fila_em: new Date("2021/07/15 12:00:30"),
        saiu_da_fila_em: new Date("2021/07/15 14:03:44"),
        feedback: {
            positivo: true,
            descricao: "eu achei massa!"
        }
    },
    {
        telegram_id: 2,
        nome: 'Júlio',
        sexo: 'M',
        idade: 18,
        entrou_na_fila_em: new Date("2021/07/15 12:03:30"),
        saiu_da_fila_em: new Date("2021/07/15 14:06:52"),
        feedback: {
            positivo: true,
            descricao: "Achei que agilizou o processo!"
        }
    },
    {
        telegram_id: 3,
        nome: 'André',
        sexo: 'M',
        idade: 22,
        entrou_na_fila_em: new Date("2021/08/08 12:06:30"),
        saiu_da_fila_em: new Date("2021/08/08 14:10:35"),
    },
    {
        telegram_id: 4,
        nome: 'Fernanda',
        sexo: 'F',
        idade: 33,
        entrou_na_fila_em: new Date("2021/08/08 13:26:30"),
        saiu_da_fila_em: new Date("2021/08/08 15:18:25"),
        // feedback:{
        //     positivo: true,
        //     descricao: "Gostei! Adoro essas modernindades"
        // }
        desistencia: true
    },
    {
        telegram_id: 5,
        nome: 'Josefa',
        sexo: 'F',
        idade: 33,
        entrou_na_fila_em: new Date("2021/07/16 13:06:30"),
        saiu_da_fila_em: new Date("2021/07/16 15:08:25"),
        // feedback:{
        //     positivo: true,
        //     descricao: "Gostei! Adoro essas modernindades"
        // }
    },
    {
        telegram_id: 6,
        nome: 'Rodrigo',
        sexo: 'M',
        idade: 52,
        entrou_na_fila_em: new Date("2021/08/08 12:15:30"),
        saiu_da_fila_em: new Date("2021/08/08 14:11:55"),
        feedback: {
            positivo: false,
            descricao: "Não achei que fez muita diferença!"
        }
    },
    {
        telegram_id: 7,
        nome: 'Maria',
        sexo: 'F',
        idade: 43,
        entrou_na_fila_em: new Date("2021/08/08 16:17:30"),
        saiu_da_fila_em: new Date("2021/08/08 17:14:25"),
        feedback: {
            positivo: true,
            descricao: "Gostei! Adoro essas modernindades"
        }
    },
    {
        telegram_id: 8,
        nome: 'Fernanda',
        sexo: 'F',
        idade: 33,
        entrou_na_fila_em: new Date("2021/08/08 12:16:30"),
        saiu_da_fila_em: new Date("2021/08/08 14:18:25"),
        // feedback:{
        //     positivo: true,
        //     descricao: "Gostei! Adoro essas modernindades"
        // }
    },
    {
        telegram_id: 9,
        nome: 'Jurema',
        sexo: 'F',
        idade: 23,
        entrou_na_fila_em: new Date("2021/08/08 10:20:30"),
        saiu_da_fila_em: new Date("2021/08/08 13:23:25"),
        // feedback:{
        //     positivo: true,
        //     descricao: "Gostei! Adoro essas modernindades"
        // }
    }
]

