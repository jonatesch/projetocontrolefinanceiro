import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbInputDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { WixApiService } from '../servico-teste.service';
import { CustomDateParserFormatter } from '../dateformat';

import { LocalStorageService } from '../local-storage.service';

import { DicasComponent } from '../dicas/dicas.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditarOpcoesComponent } from '../modal-editar-opcoes/modal-editar-opcoes.component';

@Component({
  selector: 'nova-movimentacao',
  templateUrl: './nova-movimentacao.component.html',
  styleUrls: ['./nova-movimentacao.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass:CustomDateParserFormatter}
  ]
})
export class NovaMovimentacaoComponent implements OnInit {

  constructor(private calendar:NgbCalendar, config: NgbInputDatepickerConfig, private _wixApiService:WixApiService, private _localStorage:LocalStorageService, private modalService:NgbModal) { 
    config.autoClose = "outside"
    _wixApiService.teste$.subscribe(algo => {
      if(algo == 'categoria') {this.getCategorias()}
      if(algo == 'origem') {this.getOrigens()}
      
    })
  }

  @ViewChild('d') datepicker:any
  @ViewChild('parcela') parcelaInput: any

  @Output() novaMovimentacaoInserida: EventEmitter<any> = new EventEmitter()
  @Input() estabelecimentos:string[] = []
  estabelecimentosFiltrados:string[] = []
  @Input() descricoes:string[] = []
  descricoesFiltradas:string[] = []

  mesesDeReferencia:any[]
  mesesDeReferenciaFormatados:any[] = []

  origensRegistradas:any[] = []
  categoriasRegistradas:any[] = []
  orcamentosRegistrados:any[] = []

  dateModel:NgbDateStruct

  valor = null

  parcelas:string[] = []
  desativarParcela:boolean = true

  disableEnviarButton:boolean = true

  

  novaMovimentacao = {
    'date': new Date(''),
    'mesRef':1,
    'anoRef':1,
    'estabelecimentoPrestador':'',
    'descricao':'',
    'valor':null,
    'origem': 'selecione',
    'categoria': 'selecione',
    'orcamento': '',
    'natureza': 'D',
    'efetuada': true,
    'parcela': '',
    'proprietario': 'empty'
  }

  validationCounter:number =  Object.values(this.novaMovimentacao).filter(e => e == 0 || e == 'selecione' || e == null).length - 1

  enviandoNovaMov:boolean = false

  mesRefAtual = 202112
 setarMesAtual() {
  let hoje = this.calendar.getToday()
  this.mesRefAtual = parseFloat('' + hoje.year + hoje.month)
  console.log(this.mesRefAtual)

  this.novaMovimentacao.mesRef = this.mesRefAtual
  this.novaMovimentacao.anoRef = parseFloat(this.mesRefAtual.toString().substring(0,4))

 }

  anos:any[]

  hoje() {
    this.dateModel = this.calendar.getToday()
    this.datepicker.navigateTo() 
    this.setarData('',this.calendar.getToday())   
  }

  setarMeses() {
    this._wixApiService.getMesesDeReferencia().then(data => {
      this.mesesDeReferencia = data.items
      this.anos = this._wixApiService.removerIguaisEclassificar(this.mesesDeReferencia.map(e => e.codigoMesRef.toString().substring(0,4)))
      this.anos.forEach((ano) => {
        this.mesesDeReferenciaFormatados.push(
          {
            'ano': ano,
            "meses": []
          }
        )
        for(var i = 0; i < this.mesesDeReferencia.length; i++) {
          if(this.mesesDeReferencia[i].codigoMesRef.toString().substring(0,4) == ano.toString()) {
            this.mesesDeReferenciaFormatados[this.anos.indexOf(ano)].meses.push( 
              {
                "nome": this.mesesDeReferencia[i].title,
                "rotulo": this.mesesDeReferencia[i].rotulo,
                "codigo": this.mesesDeReferencia[i].codigoMesRef
              }  )
          }
    
        }
       
      })
      console.log(this.mesesDeReferenciaFormatados)
    })
   /*  this.anos = this._wixApiService.removerIguaisEclassificar(this.mesesDeReferencia.map(e => e.codigoMesRef.toString().substring(0,4)))
  
    this.anos.forEach((ano) => {
      this.mesesDeReferenciaFormatados.push(
        {
          'ano': ano,
          "meses": []
        }
      )
      for(var i = 0; i < this.mesesDeReferencia.length; i++) {
        if(this.mesesDeReferencia[i].codigoMesRef.toString().substring(0,4) == ano.toString()) {
          this.mesesDeReferenciaFormatados[this.anos.indexOf(ano)].meses.push( 
            {
              "nome": this.mesesDeReferencia[i].title,
              "rotulo": this.mesesDeReferencia[i].rotulo,
              "codigo": this.mesesDeReferencia[i].codigoMesRef
            }  )
        }
  
      }
     
    }) */
  
  }

  getOrigens() {
    /* this._wixApiService.getOrigens().then(data => {
      this.origensRegistradas = data
    }) */
    this._wixApiService.getOrigensFromUser(this.novaMovimentacao.proprietario).then(data => {
      this.origensRegistradas = data
    })
    
  }

  getCategorias() {
   /*  this._wixApiService.getCategorias().then(data => {
      this.categoriasRegistradas = data
    }) */
    this._wixApiService.getCategoriasFromUser(this.novaMovimentacao.proprietario).then(data => {
      this.categoriasRegistradas = data
    })
  }

  getOrcamentos() {
    this._wixApiService.getOrcamentos().then(data => {
      this.orcamentosRegistrados = data
      this.novaMovimentacao.orcamento = this.orcamentosRegistrados.filter(e => e.title == 'Normal')[0]._id
    })
  }

  setarParcelas(evento:any) {
    this.parcelas = []
    if(evento.target.value > 1){
      this.desativarParcela = false
      let qtde = parseFloat(evento.target.value)
      for(var i = 1; i <= qtde; i++) {
        this.parcelas.push(i + '/' + qtde)
      }
      setTimeout(() => {
        this.novaMovimentacao.parcela = this.parcelaInput.nativeElement.value
      })
    } else {
      this.desativarParcela = true
      this.parcelas = []
      this.novaMovimentacao.parcela = ''
    }

  }

  setarData(evento:any, infoViaBotaoHoje:any) {
    
    if(evento !== '') {
      let date = new Date(evento.year + '/' + evento.month + '/' + evento.day) 
      this.novaMovimentacao.date = date 

     /*  let mesRef = '' + evento.year + evento.month.toLocaleString('pt-BR',{minimumIntegerDigits:2})
      this.novaMovimentacao.mesRef = parseFloat(mesRef)
      this.novaMovimentacao.anoRef = evento.year */
    }

    if(infoViaBotaoHoje !== '') {
      let date = new Date(infoViaBotaoHoje.year + '/' + infoViaBotaoHoje.month + '/' + infoViaBotaoHoje.day)
      this.novaMovimentacao.date = date

  /*     let mesRef = '' + infoViaBotaoHoje.year + infoViaBotaoHoje.month.toLocaleString('pt-BR',{minimumIntegerDigits:2})
      this.novaMovimentacao.mesRef = parseFloat(mesRef)
      this.novaMovimentacao.anoRef = infoViaBotaoHoje.year */
    }
    
  }
  esconderEstabsAutocomplete:boolean = true
  esconderDescAutocomplete:boolean = true

  setarEstab(evento:any) {
    this.esconderEstabsAutocomplete = false
    this.novaMovimentacao.estabelecimentoPrestador = evento.toUpperCase()
    this.validacao()

    let teste:string[] = []
    this.estabelecimentos.forEach((estab) => {
      if(estab.includes(evento.toUpperCase())) {
        teste.push(estab)
      }
    })
    
    this.estabelecimentosFiltrados = teste

    if(evento == '') {
      this.estabelecimentosFiltrados = []
      this.esconderEstabsAutocomplete = true
    }

    if(this.estabelecimentosFiltrados.length == 0) {
      this.esconderEstabsAutocomplete = true
    }
  }

  setarMesRef(evento:any) {
    this.novaMovimentacao.mesRef = parseFloat(evento.target.value)
    this.novaMovimentacao.anoRef = parseFloat(evento.target.value.substring(0,4))
    this.validacao()
  }

  setarOrigem(evento:any) {
    this.novaMovimentacao.origem = evento
    this.validacao()
  }

  setarCategoria(evento:any) {
    this.novaMovimentacao.categoria = evento
    this.validacao()
  }

  setarDescricao(evento:any) {
    this.esconderDescAutocomplete = false
    this.novaMovimentacao.descricao = evento
    this.validacao()

    let teste:string[] = []
    this.descricoes.forEach(desc => {
      if(desc.toLowerCase().includes(evento) || desc.includes(evento)) {
        teste.push(desc)
      }
    })

    this.descricoesFiltradas = teste

    if(evento == '') {
      this.descricoesFiltradas = []
      this.esconderDescAutocomplete = true
    }

    if(this.descricoesFiltradas.length == 0) {
      this.esconderDescAutocomplete = true
    }
  }

  setarValor(evento:any) {
    this.novaMovimentacao.valor = evento
    this.validacao()
  }
 
  enviarNovaMov() {
    this.enviandoNovaMov = true
    this._wixApiService.novaMovimentacao(this.novaMovimentacao).then(data => {
       this.novaMovimentacaoInserida.emit(data.res)
    })
   
  }

  validacao() {
    let vazios:number = Object.values(this.novaMovimentacao).filter(e => e === 0 || e === '' || e == 'selecione' || e == null).length
    this.validationCounter = vazios
    if(vazios < 2) {
      this.disableEnviarButton = false
    } else {
      this.disableEnviarButton = true
    }   
  }
  
  estabsAutocompletar (evento:any) {
    let estabClicado = evento.target.textContent
    this.novaMovimentacao.estabelecimentoPrestador = estabClicado
    this.esconderEstabsAutocomplete = true

  }

  descAutocompletar(evento:any) {
    let descClicada = evento.target.textContent
    this.novaMovimentacao.descricao = descClicada
    this.esconderDescAutocomplete = true
    
  }

  modalRef:NgbModalRef | undefined

  dicaSeVazio(data:string) {
    if(this.origensRegistradas.length == 0 && data == 'Origem') {
      this.modalRef = this.modalService.open(DicasComponent, {windowClass:'myCustomModalClass'})
      this.modalRef.componentInstance.campo = data
      this.modalRef.componentInstance.fecharDicas.subscribe((info:string) => {
        this.modalRef?.close()
        if(info == 'redirect'){
          this.modalService.open(ModalEditarOpcoesComponent, {windowClass:'myCustomModalClass'})
        }
      })
    }
    if(this.categoriasRegistradas.length == 0 && data == 'Categoria') {
      this.modalRef = this.modalService.open(DicasComponent, {windowClass:'myCustomModalClass'})
      this.modalRef.componentInstance.campo = data
      this.modalRef.componentInstance.fecharDicas.subscribe((info:string) => {
        this.modalRef?.close()
        if(info == 'redirect'){
          this.modalService.open(ModalEditarOpcoesComponent, {windowClass:'myCustomModalClass'})
        }
      })
    }
    
  }

 

  ngOnInit(): void {
    if(this._localStorage.get('userLoggedId') !== null) {
      let userLoggedId = JSON.stringify(this._localStorage.get('userLoggedId'))
      this.novaMovimentacao.proprietario = JSON.parse(userLoggedId)
      this.getCategorias()
      this.getOrigens()
    }    
    this.setarMesAtual()
    this.setarMeses()
    
    //this.getCategorias()
    this.getOrcamentos()
  }




}
