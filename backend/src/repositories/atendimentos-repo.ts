import {Client} from './fila-repo';

export const atendimentos:Client[] = [
    {
        telegram_id: '@marcos_lira87',
        nome: 'Francisco',
        sexo: 'M',
        idade: 21,
        entrou_na_fila_em: new Date("2021/07/15 12:00:30"),
        saiu_da_fila_em: new Date("2021/07/15 14:03:44"),
        feedback:{
            positivo: true,
            descricao: "eu achei massa!"
        }
    },
    {
        telegram_id: '@júlioboladao77',
        nome: 'Júlio',
        sexo: 'M',
        idade: 18,
        entrou_na_fila_em: new Date("2021/07/15 12:03:30"),
        saiu_da_fila_em: new Date("2021/07/15 14:06:52"),
        feedback:{
            positivo: true,
            descricao: "Achei que agilizou o processo!"
        }
    },
    {
        telegram_id: '@Andrezão00',
        nome: 'André',
        sexo: 'M',
        idade: 22,
        entrou_na_fila_em: new Date("2021/08/08 12:06:30"),
        saiu_da_fila_em: new Date("2021/08/08 14:10:35"),
    },
    {
        telegram_id: '@FernandinhaDoGera',
        nome: 'Fernanda',
        sexo: 'F',
        idade: 33,
        entrou_na_fila_em: new Date("2021/08/08 13:26:30"),
        saiu_da_fila_em: new Date("2021/08/08 15:18:25"),
        // feedback:{
        //     positivo: true,
        //     descricao: "Gostei! Adoro essas modernindades"
        // }
    },
    {
        telegram_id: '@Josefa123',
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
        telegram_id: '@Rodrigo51',
        nome: 'Rodrigo',
        sexo: 'M',
        idade: 52,
        entrou_na_fila_em: new Date("2021/08/08 12:15:30"),
        saiu_da_fila_em: new Date("2021/08/08 14:11:55"),
        feedback:{
            positivo: false,
            descricao: "Não achei que fez muita diferença!"
        }
    },
    {
        telegram_id: '@MariaMadalena',
        nome: 'Maria',
        sexo: 'F',
        idade: 43,
        entrou_na_fila_em: new Date("2021/08/08 16:17:30"),
        saiu_da_fila_em: new Date("2021/08/08 17:14:25"),
        feedback:{
            positivo: true,
            descricao: "Gostei! Adoro essas modernindades"
        }
    },
    {
        telegram_id: '@FernandinhaDoGera',
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
        telegram_id: '@Jurema12',
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

