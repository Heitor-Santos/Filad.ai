export interface Propaganda {
    estabelecimento: string,
    text: string;
    imagem: string;
    faixa: { from: number, upto: number };
    sexo: { M: boolean, F: boolean, O: boolean };
}

export const arrayPropaganda: Propaganda[] = [
    {
        estabelecimento: "trescoracoes",
        text: "Que tal passar esse tempo de espera tomando um café quentinho? Mostre essa conversa para um desconto de 5%!",
        imagem: "https://deltaexpresso.com.br/admin/modulo-noticias/imagens/1562092349.png",
        faixa: { from: 16, upto: 80 },
        sexo: { M: true, F: false, O: false }
    },
    {
        estabelecimento: "centauro",
        text: "Com o atendimento super rápido da Centauro, você vai poder voltar antes que chegue sua vez na fila. Venha conhecer os nossos produtos!",
        imagem: "https://images.milledcdn.com/2020-07-09/PLDzZYG-i4fpgMnY/ShS056suR_Xg.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: false, F: true, O: false }
    },

    {
        estabelecimento: "mcdonalds",
        text: "Um Big Mac quentinho e com desconto, só mostrar essa conversa para ter um desconto de 5%! ",
        imagem: "https://i.imgur.com/0wiczjz.png",
        faixa: { from: 16, upto: 50 },
        sexo: { M: true, F: true, O: true }
    },

    {
        estabelecimento: "mcdonalds_svt",
        text: "Um Mc Flurry geladinho e com desconto, só mostrar essa conversa para ter um desconto de 5%! ",
        imagem: "https://s3-sa-east-1.amazonaws.com/images.ofertaesperta.com/images/350_vgacetvqxv93o50mkygc.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: true, F: true, O: true }
    },

    {
        estabelecimento: "riachuelo",
        text: "Melhor variedade de roupas no recife! Mostre essa conversa e receba 3% de desconto em sua proxima compra",
        imagem: "https://i.ytimg.com/vi/JAvix0NQXUw/maxresdefault.jpg",
        faixa: { from: 16, upto: 50 },
        sexo: { M: true, F: true, O: true }
    },

    {
        estabelecimento: "figueiras",
        text: "tênis e sapatos com até 25% de desconto!",
        imagem: "https://figueirascalcados.com.br/image/crediario5x.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: true, F: false, O: false }
    },

    {
        estabelecimento: "figueiras",
        text: "Saltos e sandálias com até 20% de desconto!",
        imagem: "https://figueirascalcados.com.br/image/crediario5x.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: false, F: true, O: false }
    },

    {
        estabelecimento: "nagem",
        text: "Computadores, periféricos e material de escritório. Aproveite a promoção!",
        imagem: "https://image.isu.pub/190325212048-b560b139ae854c976f0c9096cdb6a2ca/jpg/page_1.jpg",
        faixa: { from: 25, upto: 50 },
        sexo: { M: true, F: true, O: true }
    },

    {
        estabelecimento: "nagem",
        text: "Jogos, consoles e computadores. Aproveite a promoção!",
        imagem: "https://image.isu.pub/190325212048-b560b139ae854c976f0c9096cdb6a2ca/jpg/page_1.jpg",
        faixa: { from: 16, upto: 25 },
        sexo: { M: true, F: true, O: true }
    }
]

const getByFilters = (filter: any) => {
    const arr = arrayPropaganda.filter((ad: any) => {
        for (let key of Object.keys(filter)) {
            if (key == 'estabelecimento') {
                if (filter[key] != ad[key]) return false;
            }
            if (key == 'faixa') {
                if (filter[key] < ad[key].from || filter[key] > ad[key].upto) return false;
            }
            if (key == 'sexo') {
                if (!ad.sexo[filter[key]]) return false;
            }
        }
        return true;
    });
    if (arr.length == 0) {
        arr.push(arrayPropaganda[Math.floor(Math.random() * arrayPropaganda.length)]);
    }
    return arr;
}

export { getByFilters };