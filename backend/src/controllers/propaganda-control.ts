//import { Request, Response } from 'express';
import { Propaganda, arrayPropaganda } from '../repositories/propaganda-repo';

var cAge: string;
var cSex: string;

function getPropaganda(faixa:string,sexo:string){
    cAge = faixa;
    cSex = sexo;
    const filter = arrayPropaganda.filter(filterAge).filter(filterSex);
    const arrL = filter.length();
    return filter[Math.floor(Math.random() * arrL)]
}

function filterAge(age:string){
    return age === cAge;
}

function filterSex(sex:string){
    return sex === cSex;
}

export{ getPropaganda }