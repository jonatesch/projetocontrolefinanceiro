import { Component, OnInit, ViewChild } from '@angular/core';

import { WixApiService } from '../servico-teste.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';

import { MovimentacaoImportada } from '../MovimentacaoImportada';

import * as XLSX from 'xlsx';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditarOpcoesComponent } from '../modal-editar-opcoes/modal-editar-opcoes.component';

import { ToastrService } from 'ngx-toastr';
import { HelpEnviarArquivoXlsComponent } from '../help-enviar-arquivo-xls/help-enviar-arquivo-xls.component';

@Component({
  selector: 'app-enviar-arquivos',
  templateUrl: './enviar-arquivos.component.html',
  styleUrls: ['./enviar-arquivos.component.css']
})
export class EnviarArquivosComponent implements OnInit {

  constructor(private _wix:WixApiService, private router:Router, private localStorage:LocalStorageService, private modal:NgbModal, private toastr:ToastrService) {
    _wix.teste$.subscribe((opcao) => {
      if(opcao == 'categoria') {this.getCategorias()}
      if(opcao == 'origem') {this.getOrigens()}
      this.resetExcelInput()
    })
   }


  @ViewChild('excelInput') excelInput:any

  showExcelFileError:boolean = false
  showCSVNubankFileError:boolean = false

  data: MovimentacaoImportada[] = []

  categoriasRegistradas:any[] = []
  categoriasNaoEncontradas:any[] = []

  origensRegistradas:any[] = []
  origensNaoEncontradas:any[] = []

  orcamentos:any[] = []

  mostrarOpcoesNaoEncontradas:boolean = false

  errorMessage:string = ''
  errorMessageDesciption:string = ''

  page:number = 1

  pageSize:number = 40

  carregando:boolean = true
  temArquivoExcel:boolean = false

  enviandoMovs:boolean = false

  selectPage(page:string) {
    this.page = parseInt(page, 10) || 1;
  }

  analyzeData(event:any) {

    if(this.isValidXlsFile(event.target.files[0])){
      this.showExcelFileError = false

      this.temArquivoExcel = true

    let reader = new FileReader()

    reader.readAsBinaryString(event.target.files[0])

    reader.onload = () => {
      this.data = []
      this.categoriasNaoEncontradas = []
      this.origensNaoEncontradas = []

      let wb = XLSX.read(reader.result, {type: 'binary'})
      let wsname = wb.SheetNames[0]
      let ws = wb.Sheets[wsname]
      let JSONws:any = XLSX.utils.sheet_to_json(ws,{ header: 1, raw:true, defval:''})
      console.log(JSONws)

      let headers = Object.assign([],JSONws[0]) 
      headers.pop()
      headers = headers.join(',')
      console.log(headers)

      if(headers == 'data,m??s de ref,estabelecimento,descri????o,categoria,origem,valor,or??amento,natureza'){
       
        for(var i = 1; i < JSONws.length; i++) {
        let currentMov = new MovimentacaoImportada()
        if(JSONws[i][0] !== ''){
          currentMov.date = new Date((JSONws[i][0] - (25567+1))*86400*1000) //essa l??gica transforma a data serial do excel (um n??mero) em data do Javascript
        } else {
          currentMov.date = new Date('')
        }
        
        let mesRefYear = JSONws[i][1].toString().substring(0,4)
        let mesRefMonth = JSONws[i][1].toString().substring(4,6)
        let dateFromMesRef = new Date(mesRefYear+'-'+mesRefMonth+'-'+'02')
        //currentMov.mesRefLabel = dateFromMesRef.toLocaleDateString('pt-BR',{month:'long'})+'/'+dateFromMesRef.toLocaleDateString('pt-BR',{year:'numeric'}).toString().substring(2,4)
        currentMov.mesRefLabel = JSONws[i][1].toString().substring(4,6) + '/' + JSONws[i][1].toString().substring(0,4)
        currentMov.mesRef = parseFloat(JSONws[i][1])
        currentMov.anoRef = parseFloat(JSONws[i][1].toString().substring(0,4))
        currentMov.estabelecimentoPrestador = JSONws[i][2].toUpperCase()
        currentMov.descricao = JSONws[i][3].substring(0,1).toUpperCase() + JSONws[i][3].substring(1,JSONws[i][3].length)
        if(JSONws[i][4] !== ''){
          currentMov.categoria = {
            title: JSONws[i][4].toLowerCase(),
            _id: '',
            found:false
          } 
        } else {
          currentMov.categoria = {
            title: 'outros',
            _id: this.categoriasRegistradas.filter(e => e.title == 'outros')[0]._id,
            found:true
          }
        }
        
        let categIndex = this.categoriasRegistradas.map(e => e.title).indexOf(JSONws[i][4].toLowerCase())
        if(categIndex !== -1){
          currentMov.categoria._id = this.categoriasRegistradas.map(e => e._id)[categIndex]
          currentMov.categoria.found = true
        } else {

          if(JSONws[i][4] !== '' && this.categoriasNaoEncontradas.indexOf(JSONws[i][4].toLowerCase()) == -1){
            this.categoriasNaoEncontradas.push(JSONws[i][4].toLowerCase())
          } 

        }
        if(JSONws[i][5] !== ''){
           currentMov.origem = {
          title: JSONws[i][5].substring(0,1).toUpperCase() + JSONws[i][5].substring(1,JSONws[i][5].length),
          _id:'',
          found: false //por enquanto...
        } 
        } else {
          currentMov.origem = {
            title: 'Padr??o',
          }
        }
       
        let origemIndex = this.origensRegistradas.map(e => e.title).indexOf(currentMov.origem.title)
        if(origemIndex !== -1) {
          currentMov.origem._id = this.origensRegistradas.map(e => e._id)[origemIndex]
          currentMov.origem.found = true
        } else {

          if(JSONws[i][5] !== '' && this.origensNaoEncontradas.indexOf(JSONws[i][5].substring(0,1).toUpperCase() + JSONws[i][5].substring(1,JSONws[i][5].length)) == -1) {
            this.origensNaoEncontradas.push(JSONws[i][5].substring(0,1).toUpperCase() + JSONws[i][5].substring(1,JSONws[i][5].length))
          }
          
        }
        currentMov.valor = JSONws[i][6]
        currentMov.orcamento = {
          title: JSONws[i][7],
          _id:'',
        }
        let orcamentoIndex = this.orcamentos.map(e => e.title).indexOf(JSONws[i][7])
        if(orcamentoIndex !== -1) {
          currentMov.orcamento._id = this.orcamentos.map(e => e._id)[orcamentoIndex]
        } else {
          currentMov.orcamento.title = 'Normal'
          currentMov.orcamento._id = this.orcamentos.filter(e => e.title == 'Normal')[0]._id
        }
        currentMov.natureza = JSONws[i][8]
        if(JSONws[i][9]){
          if(JSONws[i][9] == "S"){
            currentMov.efetuada = true
          } else {
            currentMov.efetuada = false
          }
        } else {
          currentMov.efetuada = true
        }
        this.data.push(currentMov)

      }

      this.data.sort((a:any,b:any) => (a.mesRef < b.mesRef) ? 1 : (a.date < b.date) ? 0 : -1 )
      console.log(this.data)
      
    } else {
        this.showExcelFileError = true
        this.errorMessage = "Revisar formato da tabela."
        this.temArquivoExcel = false
      }
    
    }

    } else {
      this.showExcelFileError = true
      this.errorMessage = "Arquivo n??o suportado"
    }

  }

  formatDate(date:any) {
    if(isNaN(date)){
      return ''
    } else {
      return date
    }
  }

  getCategorias() {
    this._wix.getCategoriasFromUser(this.localStorage.get('userLoggedId')).then(data => {
      this.categoriasRegistradas = data
      //console.log(this.categoriasRegistradas)
    })
  }

  getOrigens() {
    this._wix.getOrigensFromUser(this.localStorage.get('userLoggedId')).then(data => {
      this.origensRegistradas = data
      //console.log(this.origensRegistradas)
    })
  }

  getOrcamentos() {
    this._wix.getOrcamentos().then(data => {
      this.orcamentos = data
     // console.log(this.orcamentos)
     this.carregando = false
    })
  }

  resetExcelInput() {
    this.excelInput.nativeElement.value = ''
    this.data = []
    this.temArquivoExcel = false
    this.showExcelFileError = false
    //this.showExcelFileError = false
    this.getCategorias()
    this.getOrigens()
  }

  isValidXlsFile(file:any) {
    return file.name.endsWith(".xls") || file.name.endsWith(".xlsx")
  }

  openModalEditarOpcoes() {
    this.modal.open(ModalEditarOpcoesComponent, {windowClass:'myCustomModalClass'})
  }

  enviarMovs() {
    this.enviandoMovs = true
    let categoriasParaCriar = {
      items:this.categoriasNaoEncontradas.map(e => {return {
        title: e,
        impedirExclusao:false
      }}),
      proprietario: this.localStorage.get('userLoggedId')
    }
    /* for(var i = 0; i < this.categoriasNaoEncontradas.length; i++) {
      categoriasParaCriar.items.push({
        title: this.categoriasNaoEncontradas[i], 
        impedirExclusao: false, 
        proprietario: this.localStorage.get('userLoggedId')
      })
    } */

    let origensParaCriar = {
      items:this.origensNaoEncontradas.map(e => {return {
        title:e,
        impedirExclusao:false
      }}),
      proprietario: this.localStorage.get('userLoggedId')
    }



    if(categoriasParaCriar.items.length > 0){ // SE TIVER CATEGORIAS PARA CRIAR...
     this._wix.adicionarCategorias(categoriasParaCriar).then(retornoDoServer => { //enviar array de categorias para o server
      console.log(retornoDoServer)
      if(origensParaCriar.items.length > 0){ // ...E TB TIVER ORIGENS PARA CRIAR
        this._wix.adicionarOrigens(origensParaCriar).then(retornoDoServer => { //enviar array de origens para o server
          console.log('retorno do server:' + retornoDoServer)

          let movimentacoes = this.data.map(e => Object.assign({},e))
      
          movimentacoes.forEach((mov:any) => {
          delete mov.mesRefLabel
          })

          let user = this.localStorage.get('userLoggedId')
          this._wix.getCategoriasFromUser(user).then(retorno => { // RETOMAR CATEGORIAS FROM SERVER
            this.categoriasRegistradas = retorno
           
            this._wix.getOrigensFromUser(user).then(data => {
              this.origensRegistradas = data

              movimentacoes.forEach((mov:any) => {
                mov.categoria = this.categoriasRegistradas.filter(e => e.title == mov.categoria.title)[0]._id
                mov.origem = this.origensRegistradas.filter(e => e.title == mov.origem.title)[0]._id
                mov.orcamento = this.orcamentos.filter(e => e.title == mov.orcamento.title)[0]._id
                mov.proprietario = user
              })

              this._wix.novasMovimentacoes(movimentacoes).then(respostaFinal => {
                console.log(respostaFinal)
                this.enviandoMovs = false
                this.toastr.success('','Movimenta????es enviadas!',{positionClass:"toast-top-center"})
                this.router.navigate(['/paginaprincipal/movimentacoes'])

              })

            })
           
          })

        })
      } else { //MAS NAO TIVER ORIGENS PARA CRIAR:

        let movimentacoes = this.data.map(e => Object.assign({},e))
      
        movimentacoes.forEach((mov:any) => {
        delete mov.mesRefLabel
        })

        let user = this.localStorage.get('userLoggedId')

        this._wix.getCategoriasFromUser(user).then(retorno => { // RETOMAR CATEGORIAS FROM SERVER
          this.categoriasRegistradas = retorno

          movimentacoes.forEach((mov:any) => {
            mov.categoria = this.categoriasRegistradas.filter(e => e.title == mov.categoria.title)[0]._id
            mov.origem = this.origensRegistradas.filter(e => e.title == mov.origem.title)[0]._id
            mov.orcamento = this.orcamentos.filter(e => e.title == mov.orcamento.title)[0]._id
            mov.proprietario = user
          })

          this._wix.novasMovimentacoes(movimentacoes).then(respostaFinal => {
            console.log(respostaFinal)
            this.enviandoMovs = false
            this.toastr.success('','Movimenta????es enviadas!',{positionClass:"toast-top-center"})
            this.router.navigate(['/paginaprincipal/movimentacoes'])

          })          
          
        })

      }
    }) 
    //console.log(categoriasParaCriar)
    } else { // (SE N??O TIVER CATEGORIAS PARA CRIAR)
      if(origensParaCriar.items.length > 0){ // MAS TIVER ORIGENS PARA CRIAR:
        this._wix.adicionarOrigens(origensParaCriar).then(retornoDoServer => { //enviar as origens para o server
          console.log(retornoDoServer)

          let movimentacoes = this.data.map(e => Object.assign({},e))
      
          movimentacoes.forEach((mov:any) => {
          delete mov.mesRefLabel
          })

          let user = this.localStorage.get('userLoggedId')
          this._wix.getCategoriasFromUser(user).then(retorno => { // RETOMAR CATEGORIAS FROM SERVER
            this.categoriasRegistradas = retorno
           
            this._wix.getOrigensFromUser(user).then(data => {
              this.origensRegistradas = data

              movimentacoes.forEach((mov:any) => {
                mov.categoria = this.categoriasRegistradas.filter(e => e.title == mov.categoria.title)[0]._id
                mov.origem = this.origensRegistradas.filter(e => e.title == mov.origem.title)[0]._id
                mov.orcamento = this.orcamentos.filter(e => e.title == mov.orcamento.title)[0]._id
                mov.proprietario = user
              })

              this._wix.novasMovimentacoes(movimentacoes).then(respostaFinal => {
                console.log(respostaFinal)
                this.enviandoMovs = false
                this.toastr.success('','Movimenta????es enviadas!',{positionClass:"toast-top-center"})
                this.router.navigate(['/paginaprincipal/movimentacoes'])

              })

            })
           
          })
          
          
        })
      } else { // (SE N??O TIVER NEM CATEGORIAS NEM ORIGENS PARA CRIAR)
        
        let movimentacoes = this.data.map(e => Object.assign({},e))
      
          movimentacoes.forEach((mov:any) => {
          delete mov.mesRefLabel
          })

          let user = this.localStorage.get('userLoggedId')

          movimentacoes.forEach((mov:any) => {
            mov.categoria = this.categoriasRegistradas.filter(e => e.title == mov.categoria.title)[0]._id
            mov.origem = this.origensRegistradas.filter(e => e.title == mov.origem.title)[0]._id
            mov.orcamento = this.orcamentos.filter(e => e.title == mov.orcamento.title)[0]._id
            mov.proprietario = user
          })

          this._wix.novasMovimentacoes(movimentacoes).then(respostaFinal => {
            console.log(respostaFinal)
            this.enviandoMovs = false
            this.toastr.success('','Movimenta????es enviadas!',{positionClass:"toast-top-center"})
            this.router.navigate(['/paginaprincipal/movimentacoes'])

          })


      }
    }
    
    
  }

  openInstrucoes(){
    this.modal.open(HelpEnviarArquivoXlsComponent,{windowClass:'myCustomModalClass'})
  }

  ngOnInit(): void {

    if(this.localStorage.get('userLoggedId') !== null){
      this._wix.abriuDireto(3)
      this.getCategorias()
      this.getOrigens()
      this.getOrcamentos()
    } else {
      this.router.navigate(['/paginaprincipal'])
    }
    
  }

}
