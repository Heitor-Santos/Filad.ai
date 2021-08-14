import { getByFilters } from '../repositories/propagandas-repo';

const getPropaganda = (estabelecimento?: string, faixa?: number, sexo?: string) => {
    const filterObj: any = {};
    if (estabelecimento) filterObj['estabelecimento'] = estabelecimento;
    if (faixa != undefined) filterObj['faixa'] = faixa;
    if (sexo) filterObj['sexo'] = sexo;

    const arr = getByFilters(filterObj);
    if (!arr.length) {
        return undefined;
    }

    return arr[Math.floor(Math.random() * (10 ** arr.length)) % arr.length];
}

export { getPropaganda }