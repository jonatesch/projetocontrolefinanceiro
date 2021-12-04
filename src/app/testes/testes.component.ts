import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements OnInit {

  movimentacoes:any[] = [
    {
      data: '17/11/2021',
      mesRef: '11/2021',
      anoRef: 2021,
      estabelecimentoPrestador: 'O GATO - CONSULTÓRIO FELINO',
      descricao: 'Alguma coisa',
      categoria: 'recebimentos - Jonathan',
      origem: 'Banco do Brasil - Jonathan',
      valor: 1500,
      orcamento: 'Normal',
      natureza: 'C',
      efetuada: false,
      parcela:''
    },
    {
      data: '19/11/2021',
      mesRef: '11/2021',
      anoRef: 2021,
      estabelecimentoPrestador: 'MICROSOFT',
      descricao: 'Office 365 Família',
      categoria: 'assinaturas',
      origem: 'CC - Nubank do Jonathan',
      valor: 45,
      orcamento: 'Eventual/Emergencial',
      natureza: 'D',
      efetuada: false,
      parcela:''
    },
    {
      data: '19/11/2021',
      mesRef: '11/2021',
      anoRef: 2021,
      estabelecimentoPrestador: 'ZAFFARI',
      descricao: 'Mercado',
      categoria: 'mercado',
      origem: 'CC - Nubank do Jonathan',
      valor: 400.50,
      orcamento: 'Normal',
      natureza: 'D',
      efetuada: true,
      parcela:''
    },
    {
      data: '20/11/2021',
      mesRef: '11/2021',
      anoRef: 2021,
      estabelecimentoPrestador: 'PANVEL',
      descricao: 'Elifore 2 caixas',
      categoria: 'saúde',
      origem: 'CC - Nubank do Jonathan',
      valor: 120.24,
      orcamento: 'Normal',
      natureza: 'D',
      efetuada: false,
      parcela:'1/2'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
