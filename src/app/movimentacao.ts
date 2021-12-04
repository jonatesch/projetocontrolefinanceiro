import { Referencia } from "./referencia";

export interface Movimentacao {
    mesRef:number
    anoRef:number
    date: Date
    estabelecimentoPrestador:string
    valor:number
    origem:Referencia,
    categoria:Referencia
    descricao:string,
    natureza:string,
    efetuada:boolean,
    orcamento:Referencia,
    parcela:string,
    _id:string
}