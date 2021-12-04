export class MovimentacaoAntiga {
    constructor(
      public dataString:string,
      public date: Date,
      public mesRef: number,
      public anoRef:number,
      public estabelecimentoPrestador: string,
      public origem: string,
      public categoria: string,
      public descricao: string,
      public valor: any, 
      public efetuadaBoolean: boolean,
      public statusEfetuada:boolean,
      public efetuada: {boolean:boolean},
      public naturezaDebitoOuCredito: string,
      public orcamentoTemp: {id:string},
      public orcamento:string,
      public parcela: string
    ) {

    }

    /* obs.: não coloquei o valor como number senao teria que inicializar como 0 na novaMovimentacao 
    (tabela.component.ts) e aí já teria coisa escrita no input (0,00) ao abrir a página */
}