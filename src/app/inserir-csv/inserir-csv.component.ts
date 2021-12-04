import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CsvNubankData } from '../csv-nubank-data';
import { WixApiService } from '../servico-teste.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inserir-csv',
  templateUrl: './inserir-csv.component.html',
  styleUrls: ['./inserir-csv.component.css']
})



export class InserirCsvComponent implements OnInit {

  @Output() salvouCsv:EventEmitter<any> = new EventEmitter();

  constructor(private _wixApiService:WixApiService, private toastr:ToastrService, private router:Router){}

  csvArray:CsvNubankData[] = []

  origens:any[] = []
  categorias:any[] = []
  mesesDeReferencia:any[] = []
  orcamentos:any[] = []

  cartaoNubankSelecionado = {"title":"","_id":""}
  mesDeReferenciaSelecionado = {"rotulo":"","codigoMesRef":0}

  taCarregandoEnvioNubank:boolean = false

  configurarData(evento:any) {
    console.log(evento)
  }

  setarMesRef() {
    if(this.csvArray.length > 0) {
      this.csvArray.forEach((item) => {
        item.mesRef = this.mesDeReferenciaSelecionado.codigoMesRef
        item.anoRef = parseFloat(this.mesDeReferenciaSelecionado.codigoMesRef.toString().substring(0,4))
      })
    }
  }

  setarOrigem() {
    if(this.csvArray.length > 0) {
      this.csvArray.forEach((item) => {
        item.origem = this.cartaoNubankSelecionado._id
      })
    }
  }

  setarEfetuadas(evento:any) {
    this.csvArray.forEach((movimentacao) => {
      movimentacao.efetuada = evento.target.checked
    })
    console.log(this.csvArray)
  }

  enviarMovsNubank() {
    this.taCarregandoEnvioNubank = true
    this._wixApiService.adicionarCsvNubank(this.csvArray).then(data => {
      console.log(data)
      setTimeout(() => {
        this.taCarregandoEnvioNubank = false
        this.toastr.success("Filtros do mês e cartão respectivos foram ativados","Movimentações enviadas!",{positionClass:"toast-top-full-width"})
       let csvArrayInfo = {
         "mesRef": this.mesDeReferenciaSelecionado,
         "cartao":this.cartaoNubankSelecionado
       }
        this.salvouCsv.emit(csvArrayInfo)
      },1500)
    })
  }

  analyzeData(evento:any){
    if(this.isValidCsvFile(evento.target.files[0])){
      let reader = new FileReader()
    
      reader.readAsText(evento.target.files[0])
  
      reader.onload = () => {
        this.csvArray = []
        let csvData:any = reader.result;
        let csvDataArray = csvData.toString().split(/\r\n|\n/)

        let header = csvDataArray[0].split(',')
        

        for (let i = 1; i < csvDataArray.length; i++) {
          let currentRecord = csvDataArray[i].split(',')
          if(currentRecord.length == header.length) {
            let csvRecord: CsvNubankData = new CsvNubankData()
            csvRecord.date = new Date(currentRecord[0].trim());
            csvRecord.category = currentRecord[1].trim();
            csvRecord.title = currentRecord[2].trim();
            csvRecord.amount = currentRecord[3].trim();
            csvRecord.estabelecimentoPrestador = csvRecord.title
            csvRecord.valor = parseFloat(csvRecord.amount)
            csvRecord.efetuada = true
            csvRecord.origem = this.cartaoNubankSelecionado._id
            csvRecord.orcamento = this.orcamentos.filter(e=>e.title=="Normal")[0]._id
            csvRecord.descricao = csvRecord.title
            csvRecord.natureza = "D"
            //csvRecord.mesRef = parseFloat(csvRecord.date.toLocaleDateString("pt-BR",{year:'numeric'}) + csvRecord.date.toLocaleDateString("pt-BR",{month:'2-digit'}))
            csvRecord.mesRef = this.mesDeReferenciaSelecionado.codigoMesRef
            csvRecord.anoRef = parseFloat(csvRecord.mesRef.toString().substring(0,4))
            if(csvRecord.category !== "") {
              csvRecord.categoria = this.categorias.filter(e => e.title == csvRecord.category)[0]._id
            }
            if(csvRecord.estabelecimentoPrestador.indexOf("/")+1 == csvRecord.estabelecimentoPrestador.length-1){
              csvRecord.parcela = csvRecord.estabelecimentoPrestador.substring(csvRecord.estabelecimentoPrestador.length-3,csvRecord.estabelecimentoPrestador.length)
              csvRecord.estabelecimentoPrestador = csvRecord.estabelecimentoPrestador.substring(0,csvRecord.estabelecimentoPrestador.length-4)
              csvRecord.descricao = csvRecord.estabelecimentoPrestador
            }
            if(csvRecord.estabelecimentoPrestador.indexOf("/")+1 == csvRecord.estabelecimentoPrestador.length-2){
              let parcelaTemp = csvRecord.estabelecimentoPrestador.substring(csvRecord.estabelecimentoPrestador.length-5,csvRecord.estabelecimentoPrestador.length)
              if(parcelaTemp.indexOf("") !== -1) {
                csvRecord.parcela = parcelaTemp.substring(1,parcelaTemp.length)
                csvRecord.estabelecimentoPrestador = csvRecord.estabelecimentoPrestador.substring(0,csvRecord.estabelecimentoPrestador.length-5)
                csvRecord.descricao = csvRecord.estabelecimentoPrestador
              } else {
                csvRecord.parcela = parcelaTemp
                csvRecord.estabelecimentoPrestador = csvRecord.estabelecimentoPrestador.substring(0,csvRecord.estabelecimentoPrestador.length-6)
                csvRecord.descricao = csvRecord.estabelecimentoPrestador
              }
            }

            if(csvRecord.valor > 0) {
              this.csvArray.push(csvRecord)
            }
          
          }
        }
        

        /* let csvArrPraEnviar = {
          "origem":this.cartaoNubankSelecionado,
          "array":this.csvArray,
          "mes":this.mesDeReferenciaSelecionado,
          "orcamento":this.orcamentos.filter(e=>e.title == "Normal")[0]._id
        } */

        /* this._wixApiService.adicionarCsvNubank(csvArrPraEnviar).then(data => {
          console.log(data)
        }) */
      }
    }
  }

  isValidCsvFile(file:any) {
    return file.name.endsWith(".csv")
  }

  getOrigens(){
    this._wixApiService.getOrigens().then(data => {
      let temp:any[] = data
      this.origens = temp.filter(e => e.cartaoDeCredito == true)
      
    })
  }

  getOrcamentos(){
    this._wixApiService.getOrcamentos().then(data => {
      this.orcamentos = data
    })
  }

  getCategorias(){
    this._wixApiService.getCategorias().then(data => {
      this.categorias = data
    })
  }

  getMesesDeReferencia() {
    this._wixApiService.getMesesDeReferencia().then(data => {
      let meses:any[] = data.items
      let anos = this._wixApiService.removerIguaisEclassificar(meses.map(e => e.codigoMesRef.toString().substring(0,4)))
      this.mesesDeReferencia = anos.map(e => {
        return {
          ano: e,
          meses:meses.filter(g => g.codigoMesRef.toString().substring(0,4) == e)
        }
      })
    })
  }

  ngOnInit(): void {
    this.getOrigens()
    this.getMesesDeReferencia()
    this.getOrcamentos()
    this.getCategorias()
  }
}

