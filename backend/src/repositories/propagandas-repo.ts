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
        imagem: "https://conteudo.imguol.com.br/c/entretenimento/ac/2020/08/14/cafe-especial-1597429133880_v2_450x450.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: true, F: false, O: false }
    },
    {
        estabelecimento: "centauro",
        text: "Com o atendimento super rápido da Centauro, você vai poder voltar antes que chegue sua vez na fila. Venha conhecer os nossos produtos!",
        imagem: "https://s2.glbimg.com/9TRkV1kNT38wDhER2gR-lMzUInU=/0x0:1192x942/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/B/z/se0qbyTYWE9HOvJLeMAg/foto-maior-1.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: false, F: true, O: false }
    },
    {
        estabelecimento: "centauro",
        text: "Apenas 16-17 anos",
        imagem: "https://s2.glbimg.com/9TRkV1kNT38wDhER2gR-lMzUInU=/0x0:1192x942/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2020/B/z/se0qbyTYWE9HOvJLeMAg/foto-maior-1.jpg",
        faixa: { from: 16, upto: 17 },
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