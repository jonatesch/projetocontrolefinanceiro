import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbInputDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from '../dateformat';
import { WixApiService } from '../servico-teste.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass:CustomDateParserFormatter}
  ]
})

export class EditarComponent implements OnInit {

  @Output() editouMovimentacao:EventEmitter<any> = new EventEmitter()
  @Output() editouSemSalvar:EventEmitter<any> = new EventEmitter()
  @Output() naoAlterou:EventEmitter<any> = new EventEmitter()

  constructor(
    private calendar:NgbCalendar, 
    config: NgbInputDatepickerConfig, 
    private _wixApiService:WixApiService) { config.autoClose = "outside" }

  @ViewChild('d') datepicker:any
  @ViewChild('parcela') parcelaInput: any
  @ViewChild('editData') data:any

  movimentacao = {'_id':'', 'estabelecimentoPrestador':'', 'descricao':'', 'valor':null, 'date':'', 'mesRef':0, 'anoRef':0, origem:{'_id':'agagateste'},'categoria':{'_id':''}, 'orcamento':{'_id':''}, 'natureza':'', 'efetuada':false, 'parcela':''}
  movimentacaoOriginal:any = {origem:{_id:''}, categoria:{_id:''}, orcamento:{_id:''}}
  dataOriginal:any = null
  mesesDeReferencia:any[] = []
  mesesDeReferenciaFormatados:any[] = []
  anos:any[] = []
  origensRegistradas:any[] = []
  categoriasRegistradas:any[] = []
  orcamentosRegistrados:any[] = []

  parcelas:any[] = []
  qtdeParcelas:any = null
  desativarParcela:boolean = false
  
  enviandoEdicao:boolean = false
  disableButton:boolean = true

  dateModel:NgbDateStruct

  getOrigens() {
    this._wixApiService.getOrigens().then(data => {
      this.origensRegistradas = data
    })
  }

  getCategorias() {
    this._wixApiService.getCategorias().then(data => {
      this.categoriasRegistradas = data
    })
  }

  carregando:boolean = true

  getOrcamentos() {
    this._wixApiService.getOrcamentos().then(data => {
      this.orcamentosRegistrados = data
      this.carregando = false
    })
    
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
    })
  }

  hoje() {
    this.dateModel = this.calendar.getToday()
    this.datepicker.navigateTo() 
    this.setarData(null,this.calendar.getToday())   
  }

  setarData(evento:any, infoViaBotaoHoje:any) {
    if(evento !== null) {
     let date:string = evento.year + '/' + evento.month.toLocaleString('pt-BR',{minimumIntegerDigits:2}) + '/' + evento.day.toLocaleString('pt-BR',{minimumIntegerDigits:2})
     this.movimentacao.date = date 
     this.validacao()
    }

    if(infoViaBotaoHoje !== null) {
      let date = infoViaBotaoHoje.year + '/' + infoViaBotaoHoje.month.toLocaleString('pt-BR',{minimumIntegerDigits:2}) + '/' + infoViaBotaoHoje.day.toLocaleString('pt-BR',{minimumIntegerDigits:2})
      this.movimentacao.date = date
      this.validacao()
    }

    if(evento == null && infoViaBotaoHoje == null) {
      let teste:any = null
      this.movimentacao.date = teste
      this.validacao()
    }
  }

  setarDateModel(data:string) {
    let ano = parseFloat(data.substring(0,4))
    let mes = parseFloat(data.substring(5,7))
    let dia = parseFloat(data.substring(8,10))
    let dataFormatada = {'year': ano, 'month': mes, 'day': dia}
    this.dateModel = dataFormatada

  }

  setarMesRefAnoRef(evento:any) {
    this.movimentacao.mesRef = parseFloat(evento)
    this.movimentacao.anoRef = parseFloat(evento.substring(0,4))
    this.validacao()
  }

  setarOrigem(evento:any) {
    let origem = this.origensRegistradas.filter(e => e._id == evento)[0]
    this.movimentacao.origem = origem
    this.validacao()
    evento.target.blur()
  }

  blur(evento:any) {
    evento.target.blur()
  }

  setarCategoria(evento:any) {
    let categoria = this.categoriasRegistradas.filter(e => e._id == evento)[0]
    this.movimentacao.categoria = categoria
    this.validacao()
  }

  setarOrcamento(evento:any) {
    let orcamento = this.orcamentosRegistrados.filter(e => e._id == evento)[0]
    this.movimentacao.orcamento = orcamento
    this.validacao()
  }

  setarEstab(evento:any) {
    let estab = evento.toUpperCase()
    this.movimentacao.estabelecimentoPrestador = estab
    this.validacao()
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
        this.movimentacao.parcela = this.parcelaInput.nativeElement.value
        this.validacao()
      })
    } else {
      this.desativarParcela = true
      this.parcelas = []
      this.movimentacao.parcela = ''
      this.validacao()
    }

  }

  verificarParcela() {
    
    if(this.movimentacao.parcela !== '') {
      this.desativarParcela = false
      let qtde:number = 0

      if(this.movimentacao.parcela.length == 3) {
        qtde = parseFloat(this.movimentacao.parcela.slice(-1)) 
        this.qtdeParcelas = qtde
      } else {
        qtde = parseFloat(this.movimentacao.parcela.slice(-2)) 
        this.qtdeParcelas = qtde
      }
    
      for(var i = 1; i <= qtde; i++) {
        this.parcelas.push(i + '/' + qtde)
      }
      
    } else {
      this.desativarParcela = true
    }

  }

  dataCerta(evento:any) {
    if(JSON.stringify(evento) == JSON.stringify(this.dataOriginalNgb)) {
      return true
    } else {
      return false
    }
    
  }

  dataOriginalNgb:NgbDateStruct

  getMovOriginal() {
    this._wixApiService.getMovimentacoes().then((data:any[]) => {
      this.movimentacaoOriginal = data.filter(e => e._id == this.movimentacao._id)[0]
      if(this.movimentacaoOriginal.date !== null) {
        this.dataOriginal = this.movimentacaoOriginal.date.substring(0,4) + '/' + this.movimentacaoOriginal.date.substring(5,7) + '/' + this.movimentacaoOriginal.date.substring(8,10)
        this.dataOriginalNgb = {year: parseFloat(this.movimentacaoOriginal.date.substring(0,4)), month: parseFloat(this.movimentacaoOriginal.date.substring(5,7)), day: parseFloat(this.movimentacaoOriginal.date.substring(8,10))}
 
      }
      
      this.validacao()
    }) 
  }

  validacao() {
    let dataOriginal = null
    
    if(this.movimentacaoOriginal.date !== null) {
      dataOriginal = this.movimentacaoOriginal.date.substring(0,4) + '/' + this.movimentacaoOriginal.date.substring(5,7) + '/' + this.movimentacaoOriginal.date.substring(8,10)
    }
    
 
   if(this.movimentacao.date !== dataOriginal || this.movimentacao.mesRef !== this.movimentacaoOriginal.mesRef || this.movimentacao.origem._id !== this.movimentacaoOriginal.origem._id || this.movimentacao.categoria._id !== this.movimentacaoOriginal.categoria._id || this.movimentacao.orcamento._id !== this.movimentacaoOriginal.orcamento._id || this.movimentacao.natureza !== this.movimentacaoOriginal.natureza || this.movimentacao.estabelecimentoPrestador !== this.movimentacaoOriginal.estabelecimentoPrestador || this.movimentacao.descricao !== this.movimentacaoOriginal.descricao || this.movimentacao.valor !== this.movimentacaoOriginal.valor || this.movimentacao.parcela !== this.movimentacaoOriginal.parcela || this.movimentacao.efetuada !== this.movimentacaoOriginal.efetuada) {
    this.disableButton = false
   } else {
    this.disableButton = true
   }
  }

  salvarEdicao() {
    this.disableButton = true

      this.enviandoEdicao = true
      let movimentacaoParaAtualizar:any = this.movimentacao
      
      movimentacaoParaAtualizar.categoria = this.movimentacao.categoria._id 
      movimentacaoParaAtualizar.origem = this.movimentacao.origem._id
      movimentacaoParaAtualizar.orcamento = this.movimentacao.orcamento._id
      delete movimentacaoParaAtualizar._createdDate
      delete movimentacaoParaAtualizar._updatedDate

      this._wixApiService.atualizarMovimentacao(movimentacaoParaAtualizar).then(data => {
        this.editouMovimentacao.emit(data)
      })
        
  }

  restaurarEstab() {
    this.movimentacao.estabelecimentoPrestador = this.movimentacaoOriginal.estabelecimentoPrestador
    this.validacao()
  }

  restaurarDescricao() {
    this.movimentacao.descricao = this.movimentacaoOriginal.descricao
    this.validacao()
  }

  restaurarValor() {
    this.movimentacao.valor = this.movimentacaoOriginal.valor
    this.validacao()
  }

  restaurarData() {
    let ano = parseFloat(this.dataOriginal.substring(0,4)) 
    let mes = parseFloat(this.dataOriginal.substring(5,7))
    let dia = parseFloat(this.dataOriginal.substring(8,10))
    this.dateModel = {year:ano, month:mes, day:dia}
    this.movimentacao.date = this.dataOriginal
    this.validacao()
   
    
  }

  dataOutside(data:any, mes:any) {
    if(data.month !== mes) {
      return true
    } else {
      return false
    }
  }

  ngOnInit(): void {
    if(this.movimentacao.date !== null) {
      console.log(this.movimentacao.date)
      this.setarDateModel(this.movimentacao.date)
      this.movimentacao.date = this.movimentacao.date.substring(0,4) + '/' + this.movimentacao.date.substring(5,7) + '/' + this.movimentacao.date.substring(8,10)
    } 
    
    
    this.getMovOriginal()
    this.setarMeses()
    this.getOrigens()
    this.getCategorias()
    this.getOrcamentos()
    this.verificarParcela()
    
    
  }

  ngOnDestroy() {
    if(!this.disableButton) {
      if(this.movimentacao.date !== this.dataOriginal || this.movimentacao.mesRef !== this.movimentacaoOriginal.mesRef || this.movimentacao.origem._id !== this.movimentacaoOriginal.origem._id || this.movimentacao.categoria._id !== this.movimentacaoOriginal.categoria._id || this.movimentacao.orcamento._id !== this.movimentacaoOriginal.orcamento._id || this.movimentacao.natureza !== this.movimentacaoOriginal.natureza || this.movimentacao.estabelecimentoPrestador !== this.movimentacaoOriginal.estabelecimentoPrestador || this.movimentacao.descricao !== this.movimentacaoOriginal.descricao || this.movimentacao.valor !== this.movimentacaoOriginal.valor || this.movimentacao.parcela !== this.movimentacaoOriginal.parcela || this.movimentacao.efetuada !== this.movimentacaoOriginal.efetuada) {
        this.editouSemSalvar.emit()
      }
    } else {
      this.naoAlterou.emit()
    }
  }

}
