import { Referencia } from "./referencia";

export interface NovaMovimentacao {
    mesRef:number
    anoRef:number
    date: Date
    estabelecimentoPrestador:string
    valor:any
    origem:Referencia,
    categoria:Referencia
    descricao:string,
    natureza:string,
    efetuada:boolean,
    orcamento:Referencia,
    parcela:string
}