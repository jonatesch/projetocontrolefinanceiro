import { Component, OnInit, ViewChildren, ViewChild, Output, EventEmitter } from '@angular/core';

import { MovimentacaoAntiga } from '../movimentacaoAntiga';
import { NovaMovimentacao } from '../novaMovimentacao';

import { WixApiService } from '../servico-teste.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-movimentacao',
  templateUrl: './editar-movimentacao.component.html',
  styleUrls: ['./editar-movimentacao.component.css']
})
export class EditarMovimentacaoComponent implements OnInit {


  constructor(private _WixApiService:WixApiService, private toastr:ToastrService) { }

  @ViewChildren("escolherParaEnviar") escolherParaEnviar: any;
  @ViewChild('estabelecimentoPrestadorEdicao') estabelecimentoPrestadorEdicao: any;
  @ViewChild('descricaoEdicao') descricaoEdicao: any;
  @ViewChild('categoriaEdicao') categoriaEdicao:any;
 
  @Output() atualizouEfetuadas:EventEmitter<any> = new EventEmitter();
  @Output() atualizouMovimentacao:EventEmitter<any> = new EventEmitter();
  @Output() modificou:EventEmitter<any> = new EventEmitter();

  movimentacoesNoServidor = []

  taCarregando = false
  taCarregandoUpdate = false

  hoje = new Date().getFullYear().toString() + "-" + (new Date().getMonth()+1).toString() + "-" + new Date().getDate()

  movimentacoes:any[] = []
  origens:any[] = []
  orcamentos:any[] = []
  

  indiceDaLinha:number = 0



  movimentTeste:any[] = []
  movimentacoesEditadas:MovimentacaoAntiga[] = []
  movimentacaoEditando = {
      date: new Date(""),
      mesRef: 0,
      anoRef:0,
      estabelecimentoPrestador: "",
      origem: {},
      categoria:"",
      descricao: "",
      valor: null, 
      efetuadaBoolean: false,
      statusEfetuada:false,
      efetuada: false,
      natureza: "",
      orcamento:"",
      parcela: "",
      _id: ""
  }

  movimentacaoSendoEditada:NovaMovimentacao = {
    mesRef:0,
    anoRef:0,
    date: new Date(""),
    estabelecimentoPrestador:"",
    valor:null,
    origem:{
      title:"Not selected", 
      _createdDate:"", 
      _id:"", 
      _owner:"", 
      _updatedDate:""
    },
    categoria:{
      title: "Not selected",
      _createdDate: "",
      _id: "",
      _owner: "",
      _updatedDate: ""
    },
    descricao:"",
    natureza:"",
    efetuada:true,
    orcamento:{
      title:"Not selected", 
      _createdDate:"", 
      _id:"", 
      _owner:"", 
      _updatedDate:""
    },
    parcela:"",
  }

  

  categorias:any[] = []

  movPraEditar = new MovimentacaoAntiga("",new Date(),0,0,"","","","",null, false,false,{boolean:false},"",{id:""},"","")
  idMovPraEditar:string = ""

  transformar(){
    this.movimentacoes.forEach((item) => {
      item.enviar = true
      item.dataString = this.hoje
    })
  }

  mudarOrigem(evento:any, index:number) {
    this.movimentacoes[index].origem = this.origens[evento.target.selectedIndex]
  }
  
  desmarcarTodas() {
    this.movimentacoes.forEach((item) => {
      item.enviar = !item.enviar
    })
  }


  editarMovimentacoes(){
   
    this.taCarregando = true
    let a:any[] = []
    a = this.escolherParaEnviar._results
    let b = a.map(e=>e.nativeElement.checked)

    let editadas = []

    for(var i = 0; i < a.length; i++) {
      if(b[i] == true) {
        editadas.push(this.movimentacoes[i])
      }
    }

    editadas.forEach((item) => {
      item.date = new Date(item.dataString + "T00:00:00")
    })

    console.log(editadas)

  
    this._WixApiService.marcarComoEfetuadas(editadas).then(data => {
      this.atualizouEfetuadas.emit()
      this.taCarregando = false
    })
  }

  getOrigens() {
    this._WixApiService.getOrigens().then(data => {
      this.origens = data
    })
  }

  getCategorias() {
    this._WixApiService.getCategorias().then(data => {
      this.categorias = data
    })
  }

  getOrcamentos() {
    this._WixApiService.getOrcamentos().then(data => {
      this.orcamentos = data
    })
  }

  mesesDeReferencia:any[] = []
  anos:any[] = []
  mesesDeReferenciaFormatados:any[] = []

  setarMesesDeReferencia() {
    this._WixApiService.getMesesDeReferencia().then(data => {
      this.mesesDeReferencia = data.items
      this.anos = this._WixApiService.removerIguaisEclassificar(this.mesesDeReferencia.map(e => e.codigoMesRef.toString().substring(0,4)))
      
      this.anos.forEach((ano) => {
       this.mesesDeReferenciaFormatados.push(
        {
          "ano":ano,
          "meses":[]
        }
       )
      })

      this.anos.forEach((ano) => {
        for(var i = 0; i < this.mesesDeReferencia.length; i++) {
          if(this.mesesDeReferencia[i].codigoMesRef.toString().substring(0,4) == ano.toString()) {
            this.mesesDeReferenciaFormatados[this.anos.indexOf(ano)].meses.push( 
              {
                "nome": this.mesesDeReferencia[i].title,
                "codigo": this.mesesDeReferencia[i].codigoMesRef
              }  )
          }
    
        }
      })
      //console.log(this.mesesDeReferenciaFormatados)
    })
  }

  statusDeMovimentacoes = []

  getStatus() {
    this._WixApiService.getStatus().then(data => {
      this.statusDeMovimentacoes = data
    })
  }

  

  getMovimentacoes() {
    this._WixApiService.getMovimentacoes().then(data => {
      this.movimentacoesNoServidor = data
    })
  }

  getMovimentacaoPraEditar() {
    this._WixApiService.getMovimentacaoPraEditar(this.idMovPraEditar).then(data => {
      this.movPraEditar = data.movimentacaoEncontrada[0]
    })
  } 

  comparaCategorias(c1: any, c2: any) {
    return c1._id === c2._id
  }

  idDaMovSendoEditada = ""

  setarMovimentacaoEditando() {
    /* this.movimentacaoEditando.estabelecimentoPrestador = this.estabelecimentoPrestadorEdicao.nativeElement.value
    this.movimentacaoEditando.descricao = this.descricaoEdicao.nativeElement.value
    let categoriaEditando = this.movimentTeste[this.indiceDaLinha].categoria
    this.movimentacaoEditando.categoria = categoriaEditando
    let origemEditando = this.movimentTeste[this.indiceDaLinha].origem
    this.movimentacaoEditando.origem = origemEditando
    let orcamentoEditando = this.movimentTeste[this.indiceDaLinha].orcamento
    this.movimentacaoEditando.orcamento = orcamentoEditando
    this.movimentacaoEditando._id = this.idDaMovSendoEditada
    let valorEditando = this.movimentTeste[this.indiceDaLinha].valor
    this.movimentacaoEditando.valor = valorEditando
    let dateEditando = this.movimentTeste[this.indiceDaLinha].date
    this.movimentacaoEditando.date = dateEditando
    let mesRefEditando = this.movimentTeste[this.indiceDaLinha].mesRef
    this.movimentacaoEditando.mesRef = mesRefEditando
    let efetuadaEditando = this.movimentTeste[this.indiceDaLinha].efetuada
    this.movimentacaoEditando.efetuada = efetuadaEditando */

    this.edicaoEmAndamento = true
    //this.modificou.emit(this.movimentTeste[this.indiceDaLinha]._id)
  }

  salvouEdicao:boolean = false
  edicaoEmAndamento:boolean = false

  atualizarMovimentacao() {
    this.salvouEdicao = true
    this.taCarregandoUpdate = true
    this._WixApiService.atualizarMovimentacao(this.movimentTeste[this.indiceDaLinha]).then(data => {
      //console.log(data)
      this.atualizouMovimentacao.emit(data)
      setTimeout(() => {
        this.taCarregandoUpdate = false
        this.salvouEdicao = false
      },2000)
    })
  }

  setarData(evento:any) {
    return new Date(evento+"T00:00:00")
  }



  ngOnInit(): void {
    this.transformar()
    this.getOrigens()
    this.getCategorias()
    this.getOrcamentos()
    this.setarMesesDeReferencia()
    this.getStatus()
    this.getMovimentacaoPraEditar()
    this.getMovimentacoes()
    //console.log(this.movimentTeste[this.indiceDaLinha])


   
  }

  ngAfterViewInit() :void {
  }

  ngOnDestroy() {
    //console.log(this.movimentacaoEditando)

    if(!this.salvouEdicao && this.edicaoEmAndamento) {
      this.modificou.emit(this.movimentTeste[this.indiceDaLinha]._id)
    }
  
  }

}
