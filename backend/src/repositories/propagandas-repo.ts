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
        text: "Que tal passar esse tempo de espera tomando um café quentinho?",
        imagem: "imgCafe.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: true, F: true, O: true }
    },

    {
        estabelecimento: "centauro",
        text: "Com o atendimento super rápido da Loja de Roupas, você vai poder voltar antes que chegue sua vez na fila. Venha conhecer os nossos produtos!",
        imagem: "imgLojaR.jpg",
        faixa: { from: 16, upto: 80 },
        sexo: { M: true, F: true, O: true }
    }

]

const getByFilters = (filter: any) => {
    return arrayPropaganda.filter((ad: any) => {
        for (let key of Object.keys(filter)) {
            if (filter[key] != ad[key]) return false;
        }
        return true;
    });
}

export { getByFilters };