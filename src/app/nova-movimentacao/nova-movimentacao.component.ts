import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbInputDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { WixApiService } from '../servico-teste.service';
import { CustomDateParserFormatter } from '../dateformat';

import { LocalStorageService } from '../local-storage.service';

import { DicasComponent } from '../dicas/dicas.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditarOpcoesComponent } from '../modal-editar-opcoes/modal-editar-opcoes.component';
import { templateJitUrl } from '@angular/compiler';
import { isDate } from 'moment';

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
  @ViewChild('totalParcelas') totalParcelas: any

  @Output() novasMovimentacoesInseridas: EventEmitter<any> = new EventEmitter();
  @Output() novaMovimentacaoInserida: EventEmitter<any> = new EventEmitter();
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


  vazios = [this.novaMovimentacao.origem, this.novaMovimentacao.categoria, this.novaMovimentacao.descricao, this.novaMovimentacao.estabelecimentoPrestador, this.novaMovimentacao.valor]
  validationCounter:number =  this.vazios.filter(e => e == 'selecione' || e == null || e == '').length
  
  enviandoNovaMov:boolean = false

  mesRefAtual = 202112
 setarMesAtual() {
  let hoje = this.calendar.getToday()
  //console.log(hoje)
  this.mesRefAtual = parseFloat('' + hoje.year + hoje.month.toLocaleString('pt-BR',{minimumIntegerDigits:2}))
  //console.log(this.mesRefAtual)

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
      //console.log(this.mesesDeReferencia)
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
      //console.log(this.mesesDeReferenciaFormatados)
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

  carregouOrigens:boolean = false

  getOrigens() {
    /* this._wixApiService.getOrigens().then(data => {
      this.origensRegistradas = data
    }) */
    
    this._wixApiService.getOrigensFromUser(this.novaMovimentacao.proprietario).then(data => {
      this.origensRegistradas = data
      this.carregouOrigens = true
    })
    
  }

  carregouCategorias:boolean = false

  getCategorias() {
   /*  this._wixApiService.getCategorias().then(data => {
      this.categoriasRegistradas = data
    }) */
    this._wixApiService.getCategoriasFromUser(this.novaMovimentacao.proprietario).then(data => {
      this.categoriasRegistradas = data
      this.carregouCategorias = true
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
      //this.setarMultiploEnvio()
      this.setarMultiploEnvio_Datas()

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
    if(this.replicarParcelas){
      //let teste = {novaMov:this.novaMovimentacao, replicas:this.envioMultiplo}
      let array:any[] = Object.assign([],this.envioMultiplo)
      array.push(this.novaMovimentacao)
      this._wixApiService.novasMovimentacoes(array).then(retorno => {
        //console.log(retorno)
        this.novasMovimentacoesInseridas.emit(retorno)
      })

    } else {
      this._wixApiService.novaMovimentacao(this.novaMovimentacao).then(data => {
       this.novaMovimentacaoInserida.emit(data.res)
    })
    }
    
   
  }

 

  setarNatureza(evento:any){
    this.novaMovimentacao.natureza = evento.target.value
  }


  validacao() {
    //let vazios:number = Object.values(this.novaMovimentacao).filter(e => e === 0 || e === '' || e == 'selecione' || e == null).length
    let temp = [this.novaMovimentacao.origem, this.novaMovimentacao.categoria, this.novaMovimentacao.descricao, this.novaMovimentacao.estabelecimentoPrestador, this.novaMovimentacao.valor]
    let vaziosQtde:number = temp.filter(e => e === '' || e == 'selecione' || e == null).length
    //console.log(vaziosQtde)
    this.validationCounter = vaziosQtde
    if(vaziosQtde < 1) {
      this.disableEnviarButton = false
    } else {
      this.disableEnviarButton = true
    }   
  }

 envioMultiplo:any[] = []
 replicarParcelas:boolean = false
 totalCompraParcelada:number = 0

  setarMultiploEnvio() {
    this.replicarParcelas = true
    if(this.novaMovimentacao.parcela !== ''){
      this.envioMultiplo = []
      let qtdeParcelas = this.totalParcelas.nativeElement.valueAsNumber
      let parcelaSelecionada = parseFloat(this.novaMovimentacao.parcela.substring(0,this.novaMovimentacao.parcela.indexOf("/"))) 
      //console.log("qtdeTotal:", qtdeParcelas, "selecionada:",parcelaSelecionada)
      let diferenca = qtdeParcelas - parcelaSelecionada + 1
 
      let meses = this.mesesDeReferencia.map(e => e.codigoMesRef)
      //console.log(meses)

      let isValidDate:boolean = this.novaMovimentacao.date instanceof Date && !isNaN(this.novaMovimentacao.date.valueOf())
      
      let tempDate = new Date(this.novaMovimentacao.mesRef.toString().substring(4,6) + '/02/' + this.novaMovimentacao.mesRef.toString().substring(0,4))

      for(var i = 1; i <= diferenca; i++) {
        
        let temp:any = {}
        Object.assign(temp,this.novaMovimentacao)
        temp.parcela = (parcelaSelecionada + i - 1) + "/" + qtdeParcelas
        if(i > 1 ){
          if(isValidDate){
            let dataNova = new Date(JSON.parse(JSON.stringify(this.novaMovimentacao.date)))
            dataNova.setMonth(dataNova.getMonth()+(i-1))
            temp.date = dataNova
          }
          
       /*    if(isValidDate){
            let dataNova = new Date(JSON.parse(JSON.stringify(this.novaMovimentacao.date)))
          dataNova.setMonth(dataNova.getMonth()+(i-1))
          temp.date = dataNova
          temp.mesRef = parseFloat('' + temp.date.getFullYear().toString() + (temp.date.getMonth()+1).toLocaleString('pt-BR',{minimumIntegerDigits:2}))
          temp.anoRef = parseFloat(temp.mesRef.toString().substring(0,4))
          temp.mesRefLabel = temp.date.toLocaleDateString('pt-BR',{month:"long"}).substring(0,1).toUpperCase() + temp.date.toLocaleDateString('pt-BR',{month:"long"}).substring(1,temp.date.toLocaleDateString('pt-BR',{month:"long"}).length)  + "/" + temp.date.getFullYear().toString().substring(2,4)

          } else { */
           // let tempDate = new Date((parseFloat(temp.mesRef.toString().substring(4,6)) +(i-1)) + '/02' + '/' + temp.mesRef.toString().substring(0,4))
            let dataNova = new Date(JSON.parse(JSON.stringify(tempDate)))
            dataNova.setMonth(dataNova.getMonth()+(i-1))
            temp.mesRef = parseFloat('' + dataNova.getFullYear().toString() + (dataNova.getMonth()+1).toLocaleString('pt-BR',{minimumIntegerDigits:2}))
            temp.anoRef = parseFloat(temp.mesRef.toString().substring(0,4))
            temp.mesRefLabel = dataNova.toLocaleDateString('pt-BR',{month:"long"}).substring(0,1).toUpperCase() + dataNova.toLocaleDateString('pt-BR',{month:"long"}).substring(1,dataNova.toLocaleDateString('pt-BR',{month:"long"}).length)  + "/" + dataNova.getFullYear().toString().substring(2,4)
          /* } */
          
          
          temp.efetuada = false
          //temp.mesRef = meses[meses.indexOf(temp.mesRef)+(i-1)]
         /*  if(temp.mesRef == undefined){
            temp.mesRef = meses[meses.length - 1]
          } */
         //temp.mesRefLabel = this.mesesDeReferencia[this.mesesDeReferencia.map(e => e.codigoMesRef).indexOf(temp.mesRef)].rotulo 
          
           this.envioMultiplo.push(temp)
        }
        

       
        
      }
      this.valorParaReplicas = this.envioMultiplo[0].valor
      //console.log(this.envioMultiplo)
      //console.log(this.novaMovimentacao)
      let valor:any = this.novaMovimentacao.valor
      this.totalCompraParcelada = valor * qtdeParcelas
      
    } else {
      this.envioMultiplo = []
      this.replicarParcelas = false
    }
  }

  setarMultiploEnvio_Datas() {
    if(this.envioMultiplo.length > 0 && this.novaMovimentacao.date instanceof Date && !isNaN(this.novaMovimentacao.date.valueOf())){
      for(var i = 1; i <=this.envioMultiplo.length; i++) {
        let dataNova = new Date(JSON.parse(JSON.stringify(this.novaMovimentacao.date)))
        dataNova.setMonth(dataNova.getMonth()+(i))
        this.envioMultiplo[i-1].date = dataNova
      }
    }

  }

  setarMultiploEnvio_MesRef(data:any){
    if(this.envioMultiplo.length > 0){
      let ano = data.target.value.substring(0,4)
      let mes = data.target.value.substring(4,6)
      let tempData = new Date(mes + '/02/' + ano)

      for(var i = 1; i <= this.envioMultiplo.length; i++){
        tempData.setMonth(tempData.getMonth()+1)
      
        this.envioMultiplo[i-1].mesRef = parseFloat('' + tempData.getFullYear().toString() + (tempData.getMonth()+1).toLocaleString('pt-BR',{minimumIntegerDigits:2})) 
        this.envioMultiplo[i-1].mesRefLabel = tempData.toLocaleDateString('pt-BR',{month:"long"}).substring(0,1).toUpperCase() + tempData.toLocaleDateString('pt-BR',{month:"long"}).substring(1,tempData.toLocaleDateString('pt-BR',{month:"long"}).length)  + "/" + tempData.getFullYear().toString().substring(2,4)
        this.envioMultiplo[i-1].anoRef = parseFloat(this.envioMultiplo[i-1].mesRef.toString().substring(0,4))
        //console.log(this.envioMultiplo[i-1])
      }


    }
    

  }

  setarMultiploEnvio_Origem(origem:string){
    if(this.envioMultiplo.length > 0){
      this.envioMultiplo.forEach(item => {
        item.origem = origem
      })
    }

  }

  setarMultiploEnvio_Categoria(categoria:string){
    if(this.envioMultiplo.length > 0){
      this.envioMultiplo.forEach(item => {
        item.categoria = categoria
      })
      console.log(this.envioMultiplo)
    }
  }

  setarMultiploEnvio_Estabelecimento(estabelecimento:string) {
    if(this.envioMultiplo.length > 0){
      this.envioMultiplo.forEach(item => {
        item.estabelecimentoPrestador = this.novaMovimentacao.estabelecimentoPrestador
      })
    }
  }

  setarMultiploEnvio_Orcamento(orcamento:any){
    if(this.envioMultiplo.length > 0) {
      this.envioMultiplo.forEach(item => {
        item.orcamento = orcamento.target.value
      })

    }
  }

  setarMultiploEnvio_Natureza(){
    if(this.envioMultiplo.length > 0) {
      this.envioMultiplo.forEach(item => {
        item.natureza = this.novaMovimentacao.natureza
      })

    }
  }

  setarMultiploEnvio_ValorDasReplicas(valor:any){
    if(this.envioMultiplo.length == (this.totalParcelas.nativeElement.valueAsNumber-1)){
      this.envioMultiplo.forEach(item => {
        item.valor = valor
      })
      this.totalCompraParcelada = this.envioMultiplo.map(e => e.valor).reduce((sum, current) => sum + current) + this.novaMovimentacao.valor
    } else {
      this.envioMultiplo.forEach(item => {
        item.valor = valor
      })
      let parcelaInicial = parseFloat(this.novaMovimentacao.parcela.split('/')[0])
      let valorNovaMov:any = this.novaMovimentacao.valor
      this.totalCompraParcelada = (parcelaInicial*valorNovaMov) + (this.envioMultiplo.map(e => e.valor).reduce((sum, current) => sum + current))
    }

   
    
  }

  valorParaReplicas:number = 0

  setTotal() {
    if(this.envioMultiplo.length == (this.totalParcelas-1)){
      this.totalCompraParcelada = this.envioMultiplo.map(e => e.valor).reduce((sum, current) => sum + current) + this.novaMovimentacao.valor
    } else {
      let parcelaInicial = parseFloat(this.novaMovimentacao.parcela.split('/')[0])
      let valorNovaMov:any = this.novaMovimentacao.valor
      this.totalCompraParcelada = (parcelaInicial*valorNovaMov) + (this.envioMultiplo.map(e => e.valor).reduce((sum, current) => sum + current))
    }
    
  }

  setarMultiploEnvio_Descricoes(descricao:string) {
    if(this.envioMultiplo.length > 0) {
      this.envioMultiplo.forEach(item => {
        item.descricao = descricao
      })
    }
  }

  openModal(modalData:any){
    this.setarMultiploEnvio_ValorDasReplicas(this.valorParaReplicas)
    this.modalRef = this.modalService.open(modalData, {centered:true})
  }

  closeModal(){
    this.modalRef?.close()
  }

  getDates(data:any) {
    
    if(data instanceof Date && !isNaN(data.valueOf())){
      return true
    } else {
      return false
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
    if(this.carregouOrigens && this.origensRegistradas.length == 0 && data == 'Origem') {
      this.modalRef = this.modalService.open(DicasComponent, {windowClass:'myCustomModalClass'})
      this.modalRef.componentInstance.campo = data
      this.modalRef.componentInstance.fecharDicas.subscribe((info:string) => {
        this.modalRef?.close()
        if(info == 'redirect'){
          this.modalService.open(ModalEditarOpcoesComponent, {windowClass:'myCustomModalClass'})
        }
      })
    }
    if(this.carregouCategorias && this.categoriasRegistradas.length == 0 && data == 'Categoria') {
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
