export interface MovimentacaoFinanceira {
    dataString:string,
    date: Date,
    mesRef: number,
    anoRef:number,
    estabelecimentoPrestador: string,
    origem: string,
    categoria: string,
    descricao: string,
    valor: any, 
    efetuadaBoolean: boolean,
    efetuada: string,
    naturezaDebitoOuCredito: string,
    orcamento: string,
    parcela: string
    
}