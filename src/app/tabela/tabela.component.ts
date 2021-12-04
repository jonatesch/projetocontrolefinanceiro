import { Component, ViewChild, ViewChildren, EventEmitter, Output, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovimentacaoAntiga } from '../movimentacaoAntiga';
import { NovaMovimentacao} from '../novaMovimentacao';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditarOpcoesComponent } from '../modal-editar-opcoes/modal-editar-opcoes.component';
import { EditarMovimentacaoComponent } from '../editar-movimentacao/editar-movimentacao.component';
import { MarcarEfetuadasComponent } from '../marcar-efetuadas/marcar-efetuadas.component';
import { RelatorioMensalComponent } from '../relatorio-mensal/relatorio-mensal.component';
import { InserirCsvComponent } from '../inserir-csv/inserir-csv.component';
import { ConfirmarExclusaoTodasComponent } from '../confirmar-exclusao-todas/confirmar-exclusao-todas.component';

import { WixApiService } from '../servico-teste.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css'],
})


export class TabelaComponent {

  @Output() tabelaCarregada:EventEmitter<any> = new EventEmitter();

  verTotais:boolean = false
  filtrosMostrar:boolean = true


  movimentacoesNoServidor = []


  getMovimentacoes(){
    this._wixApiService.getMovimentacoes().then(data => {
      this.movimentacoesNoServidor = data
    })
  }

  getCategorias() {
    this.categoriasRegistradas = []
    this._wixApiService.getCategorias().then((data) => {
    this.categoriasRegistradas = data
    //console.log(this.categoriasRegistradas)
    })
  }

  getOrigens() {
    this._wixApiService.getOrigens().then(data => {
      this.origensRegistradas = data
    })
  }

  getOrcamentos(){
    this._wixApiService.getOrcamentos().then(data => {
      this.orcamentosRegistrados = data
    })
  }


  ngOnInit() {
    this.getMovimentacoes()
    this.getCategorias()
    this.getOrigens()
    this.getOrcamentos()
   // this.buscarEatualizar("")
    this.novoBuscar(true,"")
    this.checarValidacao()
  }

 


  novoBuscar(primeirocarregamento:boolean, dadosNovaMov:any) {
    this._wixApiService.getMovimentacoes().then(dados => {

      //CONFIGURAÇÃO DO CAMPO DE DATA:

        //1: deletar se for nulo
        for (var i = 0; i < dados.length; i++) {
            if(dados[i].date === null) {
              let indice = i
              delete dados[i].date
            }
          }

        //2: se não nulo, formatar para que volte a ser data (o Wix envia como uma string)
        for (var i = 0; i < dados.length; i++) {
          let data = new Date(dados[i].date)
          dados[i].date = data  
        }
      /////////////

      this.movimentacoes = dados

      //CONFIGURAR ARRAYS QUE ESTÃO CONECTADOS COM OS BOTÕES DE FILTRO:
        this.meses = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.mesRef))
        //this.categorias = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.categoria.title))
        this.categorias = this._wixApiService.removerDuplicatas(this.movimentacoes.map(e => e.categoria)).sort((a:any,b:any) => (a.title > b.title) ? 1 : -1)
        this.estabelecimentos = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.estabelecimentoPrestador))
        this.origens = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.origem.title))
        this.orcamentos = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.orcamento.title))
        this.naturezas = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.natureza))
      /////////////  

      return dadosNovaMov
        /* if(this.temNovaMovimentacao) {
          let id = dadosNovaMov._id
          let indice:number = 0
          let agaga:any[] = this.movimentacoesToTable
        

          indice = agaga.indexOf(agaga.filter(e => e._id == id)[0])
          this.tableRow._results[indice].nativeElement.classList.add("ressaltar") */
          
    
         /*  setTimeout(()=>{
            agaga = this.movimentacoesToTable
            indice = agaga.indexOf(agaga.filter(e => e._id == id)[0])
            this.tableRow._results[indice].nativeElement.classList.add("ressaltar")
      
           setTimeout(() => {
            agaga = this.movimentacoesToTable
            indice = agaga.indexOf(agaga.filter(e => e._id == id)[0])
            if(indice !== -1){
              this.tableRow._results[indice].nativeElement.classList.remove("ressaltar")
            }
            
           },3000)
          },500) */
    
          //this.temNovaMovimentacao = false 
       // }   
  
    }).then((dadosNovaMov) => {
      this.dadosNovaMov = dadosNovaMov
      setTimeout(() => {
        this.filtrar(primeirocarregamento)
        this.painelFiltros.nativeElement.classList.add("show")
      },500)
    })
  }

  

  dadosNovaMov:any = ""
  novoArrayCsv:boolean = false


 
  private modalRef: NgbModalRef | undefined;

  openModal() {
    this.modalRef = this.modalService.open(ModalEditarOpcoesComponent,{windowClass:'myCustomModalClass'});
    this.modalRef.componentInstance.categorias = this.categoriasRegistradas
    this.modalRef.componentInstance.origens = this.origensRegistradas
    this.modalRef.componentInstance.atualizouCategorias.subscribe((novasCategorias:any[]) => {
     this.categoriasRegistradas = novasCategorias
    })
    this.modalRef.componentInstance.atualizouOrigens.subscribe((novasOrigens:any[]) => {
      this.origensRegistradas = novasOrigens
    })
    
   
  } 

  taDiferente:boolean = false

  movsEmEdicao:string[] = []

  edicaoEmAndamento:boolean = false

  openEditarMovimentacao(index:number) {
    this.modalRef = this.modalService.open(EditarMovimentacaoComponent,{windowClass:'myCustomModalClass2', centered: true, animation: true})
    this.modalRef.componentInstance.idMovPraEditar = this.movPraEditar
    this.modalRef.componentInstance.movimentTeste = this.movimentacoesToTable
    this.modalRef.componentInstance.indiceDaLinha = this.indiceDaLinha
    this.modalRef.componentInstance.idDaMovSendoEditada = this.tableRow._results[this.indiceDaLinha].nativeElement.id

    this.modalRef.componentInstance.atualizouEfetuadas.subscribe(()=> {
      
      this.buscarEatualizar("")
      setTimeout(() => {
        this.modalRef?.close()
      },1500)
     
    })
    this.modalRef.componentInstance.atualizouMovimentacao.subscribe((recebido:any) => {
      this.temNovaMovimentacao = true
      //console.log(recebido)
      setTimeout(() => {
        this.modalRef?.close()
        this.toastr.success("","Alteração salva!",{positionClass:"toast-top-full-width"})
        //this.buscarEatualizar(recebido)
        this.novoBuscar(false,recebido.res)
        setTimeout(() => {
          this.temNovaMovimentacao = false
        },3000)
      },500)
    })

    this.modalRef.componentInstance.modificou.subscribe((id:any) => {
     this.edicaoEmAndamento = true //botões de filtro são desativados quando true
     if(this.movsEmEdicao.length < 1){
      this.testarToasts()
     }
     

      let agaga:any[] = []
      agaga = this.tableRow._results

      agaga.find(e=>e.nativeElement.id == id).nativeElement.classList.add("editando")
      if(this.movsEmEdicao.indexOf(agaga.find(e=>e.nativeElement.id == id).nativeElement.id) !== -1) {

      } else {
        this.movsEmEdicao.push(agaga.find(e=>e.nativeElement.id == id).nativeElement.id)
      }
      
    })
  }

  csvArrayMesRef:any
  csvArrayCartao:any

  openModalEnviarCsv() {
    this.modalRef = this.modalService.open(InserirCsvComponent,{windowClass:'myCustomModalClass5',scrollable: true})
    this.modalRef.componentInstance.salvouCsv.subscribe((recebido:any) => {
      this.csvArrayMesRef = recebido.mesRef
      this.csvArrayCartao = recebido.cartao
      this.novoArrayCsv = true
      this.modalRef?.close()
      //this.buscarEatualizar("")
      this.novoBuscar(false,recebido)
    })
    
  }

  atualizaTabela:boolean = true
  tabelaAtualizada:EventEmitter<any> = new EventEmitter();

  excluirTodas(){
    let ids = this.movimentacoesToTable.map(e => e._id)

    this.modalRef = this.modalService.open(ConfirmarExclusaoTodasComponent)
    this.modalRef.componentInstance.noDeMovimentacoes = this.movimentacoesToTable.length
    this.modalRef.componentInstance.ids = ids
    this.modalRef.componentInstance.fecharModal.subscribe(() => {
      this.modalRef?.close()
    })
    this.modalRef.componentInstance.exclusoesRealizadas.subscribe(() => {
      this.modalRef?.close()
      this.atualizaTabela = false
      //this.buscarEatualizar("")
      this.novoBuscar(false,"")
      this.tabelaAtualizada.subscribe(() => {
        this.filtrar(false)
        setTimeout(() => {this.atualizaTabela = false},2000)
      })
      this.toastr.success("","Movimentações excluídas!",{positionClass:'toast-top-full-width'})
    })

  }

  

  testarToasts() {
    this.toastr.info("conclua as alterações para reativá-los","filtros desativados",{
      positionClass:"toast-top-full-width",
    })
  }

  cancelar(){
    this.toggleModoEdicao()
    this.edicaoEmAndamento = false
    this.movsEmEdicao = []
   //this.buscarEatualizar("")
   this.novoBuscar(false,"")
    this.toastr.success("","Filtros reativados",{
      positionClass:"toast-top-full-width"
    })
    this.toastr.warning("alterações descartadas","atenção",{
      positionClass:"toast-top-full-width"
    })
  }

  atualizarTodas() {
    let movsPraAtualizar = this.movimentacoes.filter(mov => this.movsEmEdicao.includes(mov._id))
    //console.log(this.movimentacoes.filter(mov => this.movsEmEdicao.includes(mov._id)))
    this._wixApiService.atualizarMovimentacoes(movsPraAtualizar).then(retorno => {
      //this.buscarEatualizar("")
      this.novoBuscar(false, "")
      //console.log(retorno)
      this.edicaoEmAndamento = false
      this.movsEmEdicao = []
      this.toastr.success("os filtros foram reativados","Alterações salvas!",{positionClass:"toast-top-full-width"})
      this.modoEdicao = false
    })

  }

 
  openMarcarEfetuadas(){
    let movsNaoEfetuadas = this.movimentacoesToTable.filter(item => item.efetuada == false)
    this.modalRef = this.modalService.open(MarcarEfetuadasComponent,{windowClass:'myCustomModalClass3', centered: true, scrollable: true})
    this.modalRef.componentInstance.movsNaoEfetuadas = movsNaoEfetuadas
    this.modalRef.componentInstance.atualizouEfetuadas.subscribe((recebido:any) => {
      this.buscarEatualizar("")
      setTimeout(() => {
        this.toastr.success("","Movimentações atualizadas!",{positionClass:"toast-top-full-width"})
        this.modalRef?.close()
      },2000)
    })
  }

  openRelatorios(){
    this.modalRef = this.modalService.open(RelatorioMensalComponent,{windowClass:'myCustomModalClass4', scrollable:true})
  }

  movPraEditar = ""
  indiceDaLinha:number = 0

  linhaClicada(index:number) {
    if(this.modoEdicao){
      this.movPraEditar = this.tableRow._results[index].nativeElement.id
      this.indiceDaLinha = index
      this.openEditarMovimentacao(this.indiceDaLinha)
    }
  }

  modoEdicao:boolean = false
  toggleModoEdicao(){
    this.modoEdicao = !this.modoEdicao
  }
 
  novaMovimentacaoAntiga = new MovimentacaoAntiga("",new Date(),0,0,"","","","",null, false,false,{boolean:false},"",{"id":"a3d076a2-ad5a-4c05-b8f6-7623182bd9e2"},"","")
  novaMovimentacao:NovaMovimentacao = {
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

  setarDataNovaMovimentacao(evento:any) {
    let novaData = evento.target.value
    this.novaMovimentacao.date = new Date(novaData + "T00:00:00")
  }

  liberaBotao:boolean = false

  testeMethod() {
    let estadoPadraoArray = Object.values(this.novaMovimentacao)
    estadoPadraoArray.splice(1,2)
    estadoPadraoArray.splice(7,1)
    estadoPadraoArray.splice(8,1)
    this.validacao = estadoPadraoArray.filter(item => item == 0 || item === null || item.title == 'Not selected').length
  }

  validacao:number = 0


  checarValidacao() {
    /* seta a variável 'padrão' para ser um array com o que for string vazia, null ou tiver a propriedade title igual a 'Not selected' 
    de 8 (as que importam para a validação) das 12 propriedades da novaMovimentacao */
    let padrao = Object.values({
      "um": this.novaMovimentacao.categoria,
      "dois": this.novaMovimentacao.descricao,
      "tres":this.novaMovimentacao.estabelecimentoPrestador,
      "quatro": this.novaMovimentacao.mesRef,
      "cinco": this.novaMovimentacao.natureza,
      "seis": this.novaMovimentacao.orcamento,
      "sete": this.novaMovimentacao.origem,
      "oito": this.novaMovimentacao.valor
    }).filter(item => item == 0 || item === null || item.title == 'Not selected')

    //o tamanho do array setado acima será o valor da nossa propriedade 'validação'
    this.validacao = padrao.length
    
    //SE OS 8 CAMPOS PREENCHIDOS, LIBERAR O BOTÃO DE ENVIO MANUAL DE NOVA MOVIMENTAÇÃO
    if(this.validacao > 0) {
      this.liberaBotao = false
    } else {
      this.liberaBotao = true
    }
  }

  setarEstabNovaMovimentacao(evento:any) {
    this.novaMovimentacao.estabelecimentoPrestador = evento.target.value.toUpperCase()
    this.checarValidacao()
  }


  setarAnoRefNovaMovimentacao(){
    this.novaMovimentacao.anoRef = parseFloat(this.novaMovimentacao.mesRef.toString().substring(0,4))
    //console.log(this.novaMovimentacao)
    this.checarValidacao()
    
  }

  comparaCategorias(c1: any, c2: any) {
    return c1.id === c2.id
  }



  @ViewChildren('botoesEstabelecimentos') botoesDeEstabelecimento:any
  @ViewChildren('botoesCategorias') botoesDeCategoria:any
  @ViewChildren('botoesMeses') botoesDeMeses:any
  @ViewChildren('botoesOrigem') botoesDeOrigem:any
  @ViewChildren('botoesEfetuadas') botoesDeStatusEfetuadas:any
  @ViewChildren('botoesOrcamentos') botoesDeOrcamento:any
  @ViewChildren('botoesNatureza') botoesDeNatureza:any
  @ViewChildren('parcelas') parcelas:any
  @ViewChildren('parcelaTags') parcelaTags:any
  @ViewChildren('formValor') formValor:any
  @ViewChildren('botaoEnviar') botaoEnviar:any
  @ViewChildren('tableRow') tableRow: any
  @ViewChildren('confirmaExclusao') confirmaExclusao:any
  @ViewChildren('modalData') modalData:any
  @ViewChild('dataNovaMovimentacao') dataNovaMovimentacao:any
  @ViewChild('parcela') parcela:any
  @ViewChild('painelFiltros') painelFiltros:any
 
  
  hoje = new Date()
  mesRefAtual = this.hoje.toLocaleDateString("pt-BR",{month:"2-digit"}) + "/" + this.hoje.toLocaleDateString("pt-BR",{year:"numeric"})
  mesRefAtualRotulo = this.hoje.toLocaleDateString("pt-BR",{month:"long"}).substring(0,1).toUpperCase() + this.hoje.toLocaleDateString("pt-BR",{month:"long"}).substring(1,this.hoje.toLocaleDateString("pt-BR",{month:"long"}).length)
 
 
  //VALOR SÓ PRA FAZER O BIND COM A MÁSCARA NO CAMPO DE VALOR DO FORMULÁRIO DE NOVA MOVIMENTAÇÃO
  valor = null

  //BOOLEAN QUE TÁ GRUDADO NO CAMPO DAS TAG DE PARCELAS, PRA SABER SE DESABILITA OU NÃO
  dropdownDisabled:boolean = true

  //ARRAY QUE TÁ NO BIND DAS TAGS DE PARCELA
  parcelasObjectParaDropdownMenu:any[] = []


  gerenciarParcelas(event:any) {
    this.parcelasObjectParaDropdownMenu = []
    let qtdeDeParcelas = event.target.value
    
    
    if(qtdeDeParcelas < 2) { // se o total de parcelas for menor que 2
     this.dropdownDisabled = true // desabilita o seletor de tags de parcela
     this.novaMovimentacao.parcela = ""
     setTimeout(() => { // e depois de 3 segundos
      this.parcelas._results[0].nativeElement.value = null // anula o campo de total de parcelas
      
     },1500)

    } else { // mas se o total de parcelas for maior que 2
      this.dropdownDisabled = false // habilita o seletor de tags de parcela
      for (var i = 0; i < qtdeDeParcelas; i++){
        this.parcelasObjectParaDropdownMenu.push( //e adiciona no array das opções os objetos com as tags de parcela
          {
            "label": i+1 + "/" + qtdeDeParcelas,
            "value": i+1 + "/" + qtdeDeParcelas
          }
        )
      }
    }
  }

  url = 'http://echo.jsontest.com/key/value/one/two' //para teste
  url2 = 'https://www.jonathanspinelli.com/_functions/vejabem'
  url3 = 'https://www.jonathanspinelli.com/_functions/subtotalCategorias'
  url4 = 'https://www.jonathanspinelli.com/_functions/mesesDeReferencia'
  url5 = 'https://www.jonathanspinelli.com/_functions/categorias'
  url6 = 'https://www.jonathanspinelli.com/_functions/origens'
  url7 = 'https://www.jonathanspinelli.com/_functions/orcamentos'
  url8 = 'https://www.jonathanspinelli.com/_functions/naturezasDebitoOuCredito'
  url9 = 'https://www.jonathanspinelli.com/_functions/efetuadas'

  mesesDeReferencia:any[] = []
  mesesDeReferenciaFormatados:any = []
  anos:any[] = []

  categoriastemp:any[] = []
  categoriasRegistradas:any[] = []

  origensTemp:any[] = []
  origensRegistradas:any[] = []

  orcamentosTemp:any[] = []
  orcamentosRegistrados:any[] = []

  naturezasRegistradas:any[] = []

  efetuadas:any[] = []

  mensagemErroFormulario = ""

  taCarregando:boolean = false
  movEnviada:boolean = false
  taCarregandoExclusao:boolean = false

 
 
  novoEnvio() {
  //MÉTODO DE VALIDAÇÃO:  
  let estadoPadraoArray = Object.values(this.novaMovimentacao)
    estadoPadraoArray.splice(2,1)
    estadoPadraoArray.splice(4,2)
    estadoPadraoArray.splice(7,2)
    estadoPadraoArray.splice(6,1)
  let camposObrigatoriosVazios = estadoPadraoArray.filter(item => item == 0 || item === null)  
    
    if(camposObrigatoriosVazios.length > 0) {
      //this.mensagemErroFormulario = " Verifique os campos obrigatórios (*)"
      this.toastr.error("","Verifique os campos obrigatórios (*)")
      /* setTimeout(() => {
        this.mensagemErroFormulario = ""  
        
      },3000) */
    } else {
      if(this.novaMovimentacao.origem.title == "Not selected" || this.novaMovimentacao.categoria.title == "Not selected" || this.novaMovimentacao.orcamento.title == "Not selected" ) {
       // console.log("preencher campos")
      } else {
        this.taCarregando = true
        this.temNovaMovimentacao = true
        
        this._wixApiService.novaMovimentacao(this.novaMovimentacao).then(data => {
          //this.buscarEatualizar(data)
          console.log(data)
          this.novoBuscar(false,data.res)
        })
        setTimeout(() => {
          this.taCarregando = false
          this.movEnviada = true
          this.toastr.success("","Movimentação enviada!",{positionClass:"toast-top-full-width"})
          //this.mensagemErroFormulario = "Movimentação enviada!"
          this.resetForm()
          setTimeout(()=>{
            //this.mensagemErroFormulario = ""
            this.movEnviada = false
            
          },3000)
        },1500)
        
      }
    }
  }

  resetForm() {
    this.dataNovaMovimentacao.nativeElement.valueAsDate = null    
    this.novaMovimentacao = {
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
  }

  idNovaMovimentacaoAntiga:string = ""
 
  mostrarLixeira(index:any) {
   if(!this.modoEdicao){
    this.tableRow._results[index].nativeElement.children[0].children[0].children[0].classList.add("branco")
    this.tableRow._results[index].nativeElement.children[0].children[0].classList.add("trash-icon-mostrar")
   } 
  }

  esconderLixeira(index:any) {
    if(!this.modoEdicao){
   this.tableRow._results[index].nativeElement.children[0].children[0].children[0].classList.remove("branco")
   this.tableRow._results[index].nativeElement.children[0].children[0].classList.remove("trash-icon-mostrar")
    }
  }

  closeModal:string = ""

  //ABRE O MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE MOVIMENTAÇÃO (é chamada pelo método excluirMov:
  triggerModal(content:any,index:number) {
    this.idMovimentacaoParaExluir = this.tableRow._results[index].nativeElement.id
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      this.dataInvalida = false
    });
  }

  
  triggerModal2(content:any,index:number) {
    this.idMovimentacaoParaExluir = this.tableRow._results[index].nativeElement.id
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',windowClass:"myCustomModalClass"}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      this.dataInvalida = false
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  idMovimentacaoParaExluir = ""
  indiceDaMovimentacaoClicada:number = 0
  movAserExcluida:any = []
  mensagemConfirmaExclusao:string = ""

  dataInvalida:boolean = false

  excluirMov(index:number,modalData:any) {

    this.indiceDaMovimentacaoClicada = index

    this.triggerModal(modalData,index)
    this.movAserExcluida = this.movimentacoesToTable[index]   

    if(this.notNumber(this.movAserExcluida.date)){
      this.dataInvalida = true
    }
    
    this.idMovimentacaoParaExluir = this.tableRow._results[index].nativeElement.id
   
  }

  constructor(
    private http: HttpClient, 
    private modalService: NgbModal, 
    private _wixApiService: WixApiService,
    private toastr: ToastrService 
    ){

   
    //QUERY NO DATABASE DO WIX PARA PEGAR A RELAÇÃO DE MESES DE REFERENCIA
    this.http.get(this.url4).toPromise().then(dados => {
      this.setarMesesDeReferencia(dados)
    })

    this.http.get(this.url8).subscribe(data => {
      this.setarNaturezasRegistradas(data)
    })

    this.http.get(this.url9).subscribe(data => {
      this.setarEfetuadas(data)
    })
    
  }

  buscarEatualizar(dadosDaNovaMov:any) {
    //QUERY NODATABASE DO WIX PARA PEGAR AS MOVIMENTAÇÕES
    this._wixApiService.getMovimentacoes().then(dados => {
      this.enviarDoWixPraTabela(dados, dadosDaNovaMov)
    })

  }

  setarEfetuadas(query:any) {
    query.forEach((item:any)=>{
      this.efetuadas.push({
        "tituloDaEfetuada":item.title,
        "id":item._id
      })
    })
  }

  setarNaturezasRegistradas(query:any) {
    query.forEach((item:any)=>{
      this.naturezasRegistradas.push({
        "tituloDaNatureza": item.title,
        "id":item._id,
        "tag":item.tagDaNatureza
      })
    })
  }

  setarOrcamentosRegistrados(query:any) {
    query.forEach( (item:any) => {
      this.orcamentosRegistrados.push({
        "tituloDoOrcamento": item.title,
        "id": item._id
      })
    } )
  }


  setarOrigensRegistradas(query:any) {
    query.forEach( (item:any) => {
      this.origensRegistradas.push({
        "title": item.title,
        "_id": item._id
      })
    } )
  }

  setarCategoriasRegistradas(query:any) {
    
    query.forEach((item:any) => {
      this.categoriasRegistradas.push({
        "tituloDaCategoria":item.title,
        "id":item._id
      }) 
    })
  }
 

  parseFloat(string:string){
    return parseFloat(string)
  }

  setarMesesDeReferencia(dadosDoServidor:any){

          
    this.mesesDeReferencia = dadosDoServidor.items
    this.anos = this.removerIguaisEclassificar(this.mesesDeReferencia.map(e => e.codigoMesRef.toString().substring(0,4))) // forma um array com os anos
    
    //FORMATAR OS MESES DE REF. PARA TEREM OBJETOS COM ANO E MESES
    this.anos.forEach((item)=>{
      this.mesesDeReferenciaFormatados.push(
        {
          "ano":item,
          "meses":[]
        }
      )
    })

    //PRA CADA ANO ADICIONAR UM ARRAY DE OBJETOS 'MESES' QUE CONTEM NOME E CODIGO
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

    //CLASSIFICAR OS ARRAY DE MESES DENTRO DOS OBJETOS(ano/meses) EM ORDEM DE CODIGO
    this.mesesDeReferenciaFormatados.forEach((item:any) => {
      item.meses.sort(function (a:any, b:any ) {return a.codigo - b.codigo})
    })
    
  }

  exclusaoConfirmada () {
    this.taCarregandoExclusao = true
    let url = 'https://www.jonathanspinelli.com/_functions/excluirMovimentacao'

    this.http.post(url,this.idMovimentacaoParaExluir).subscribe(dados=>{
      //console.log(dados)

     
      
      //this.mensagemConfirmaExclusao = "Movimentação excluída!"
      //this.buscarEatualizar("")
      this.novoBuscar(false,"")
      setTimeout(()=>{
        //this.mensagemConfirmaExclusao = ""
        this.taCarregandoExclusao = false
        this.toastr.success("","movimentação excluída!",{positionClass:"toast-top-full-width"})
        this.modalService.dismissAll()
        
      },1500)
     
    })
    
  }


  movimentacoes:any[] = [] // array temporário para ser manipulado
  movimentacoesToTable:any[] = [] // array final pronto para ir para a tabela



  categorias:any[] = []
  estabelecimentos:any[] = []
  meses:any[] = []
  origens:any[] = []
  statusEfetuadas:any[] = [
    {
      "letra":"N",
      "tag":"Não efetuadas",
      "value":false
    },
    {
      "letra":"S",
      "tag":"Efetuadas",
      "value":true
    }
  ]
  orcamentos:any[] = []
  naturezas:any[] = []
  resumoDebitosPorCategoria:any[] = []
  resumoDebitosPorEstabelecimentos:any[] = []
  totalDebitos:number = 0
  totalCreditos:number = 0

  temNovaMovimentacao:boolean = false


  enviarDoWixPraTabela(movs:any,dadosDaNovaMov:any){
    
    // REMOVER A PROPERTY date SE O VALOR FOR NULL
    for (var i = 0; i < movs.length; i++) {
      if(movs[i].date === null) {
        let indice = i
        //console.log("temos um null no índice: "+i)
        delete movs[i].date
      }
    }
    
    // FORMATAR o campo de data que o database do wix envia como string para ser Data novamente
    for (var i = 0; i < movs.length; i++) {
        let data = new Date(movs[i].date)
        movs[i].date = data  
    }

   // SETAR o array movimentacoes com os dados que vieram do Wix database  
   this.movimentacoes = movs 

     
   //this.categorias = this.removerIguaisEclassificar(this.movimentacoes.map(e=>e.categoria.title))
   this.categorias = this._wixApiService.removerDuplicatas(this.movimentacoes.map(e => e.categoria)).sort((a:any,b:any) => (a.title > b.title) ? 1 : -1)
   this.meses = this.removerIguaisEclassificar(this.movimentacoes.map(e=>e.mesRef))
   this.estabelecimentos = this.removerIguaisEclassificar(this.movimentacoes.map(e=>e.estabelecimentoPrestador))
   this.origens = this.removerIguaisEclassificar(this.movimentacoes.map(e=>e.origem.title))
   this.orcamentos = this.removerIguaisEclassificar(this.movimentacoes.map(e=>e.orcamento.title))
   this.naturezas = this.removerIguaisEclassificar(this.movimentacoes.map(e=>e.natureza))


    this.statusEfetuadas = [
      {
        "letra":"N",
        "tag":"Não efetuadas",
        "value":false
      },
      {
        "letra":"S",
        "tag":"Efetuadas",
        "value":true
      }
    ]

   this.movimentacoesToTable = this.movimentacoes

  

   this.getSumDebitos(this.movimentacoesToTable)
   this.getSumCreditos(this.movimentacoesToTable)
  
    
    let resumoDebitosCategorias = this.removerIguaisEclassificar(this.movimentacoesToTable.filter(obj=>obj.naturezaDebitoOuCredito === 'D').map(e=>e.categoria))
    this.resumoDebitosPorCategoria = resumoDebitosCategorias.map(z=>{
      return {
        "categoria": z,
        "total": this.movimentacoesToTable.filter(obj=>obj.categoria === z).map(g=>g.valor).reduce((sum,current) => sum + current)
      }
    })

    let resumoDebitosEstabelecimentos = this.removerIguaisEclassificar(this.movimentacoesToTable.filter(obj=>obj.naturezaDebitoOuCredito === 'D').map(e=>e.estabelecimentoPrestador))
    this.resumoDebitosPorEstabelecimentos = resumoDebitosEstabelecimentos.map(e=>{
      return {
        "estabelecimento": e,
        "total": this.movimentacoesToTable.filter(obj=>obj.estabelecimentoPrestador === e).map(g=>g.valor).reduce((sum, current) => sum + current)
      }
    })

    if(this.temNovaMovimentacao) {
      let id = dadosDaNovaMov.res._id
      let indice:number = 0
      let agaga:any[] = this.movimentacoesToTable


      setTimeout(()=>{
        agaga = this.movimentacoesToTable
        indice = agaga.indexOf(agaga.filter(e => e._id == id)[0])
        this.tableRow._results[indice].nativeElement.classList.add("ressaltar")
  
       setTimeout(() => {
        agaga = this.movimentacoesToTable
        indice = agaga.indexOf(agaga.filter(e => e._id == id)[0])
        if(indice !== -1){
          this.tableRow._results[indice].nativeElement.classList.remove("ressaltar")
        }
        
       },3000)
      },500)

      this.temNovaMovimentacao = false

     

      
    }

    //console.log(this.movimentacoesToTable)
  }


  getRotuloBotaoNatureza(letraEnviada:string){
    if(letraEnviada == "C"){
      return "Créditos"
    } else {
      return "Débitos"
    }
  }

  removerIguaisEclassificar(array:any[]){
    return array.filter((obj, index, self)=>index===self.indexOf(obj)).sort()
  }

  getLetra(index:number){
    if(this.movimentacoesToTable[index].efetuada){
      return "S"
    } else {
      return "N"
    }
  }

  
  seletorDeOrcamento(index:any){
      //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/OrcamentoClicado:
      let classesString = this.botoesDeOrcamento._results[index].nativeElement.classList.value
      let classes = this.botoesDeOrcamento._results[index].nativeElement.classList
      
      if(classesString.includes("active")){
        classes.remove("active")
      } else {classes.add("active")} 
 
      this.filtrar(false) // iniciar função do filtro
  }

  seletorDeMeses(index:any){
     //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/MêsClicado:
     let classesString = this.botoesDeMeses._results[index].nativeElement.classList.value
     let classes = this.botoesDeMeses._results[index].nativeElement.classList
     
     if(classesString.includes("active")){
       classes.remove("active")
     } else {classes.add("active")} 

     this.filtrar(false) // iniciar função do filtro
  }

  seletorDeCategoria(index:any){
     //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/EstabelecimentoClicado:
     let classesString = this.botoesDeCategoria._results[index].nativeElement.classList.value
     let classes = this.botoesDeCategoria._results[index].nativeElement.classList
     
     if(classesString.includes("active")){
       classes.remove("active")
     } else {classes.add("active")} 

     this.filtrar(false) // iniciar função do filtro
  }   
  
  seletorDeEstabelecimento(index:any){

    //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/EstabelecimentoClicado:
    let classesString = this.botoesDeEstabelecimento._results[index].nativeElement.classList.value
    let classes = this.botoesDeEstabelecimento._results[index].nativeElement.classList
    
    if(classesString.includes("active")){
      classes.remove("active")
    } else {classes.add("active")} 

    this.filtrar(false)

  }

  seletorDeOrigem(index:any){
    //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/EstabelecimentoClicado:
    let classesString = this.botoesDeOrigem._results[index].nativeElement.classList.value
    let classes = this.botoesDeOrigem._results[index].nativeElement.classList
    
    if(classesString.includes("active")){
      classes.remove("active")
    } else {classes.add("active")} 

    this.filtrar(false) // iniciar função do filtro
  }

  seletorDeEfetuadas(index:any){
    //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/EstabelecimentoClicado:
    let classesString = this.botoesDeStatusEfetuadas._results[index].nativeElement.classList.value
    let classes = this.botoesDeStatusEfetuadas._results[index].nativeElement.classList
    
    if(classesString.includes("active")){
      classes.remove("active")
    } else {classes.add("active")} 

    this.filtrar(false) // iniciar função do filtro
  }
  
  seletorDeNatureza(index:any){
     //ADICIONAR CLASSE PARA MARCAR BOTÃO ATIVADO/EstabelecimentoClicado:
     let classesString = this.botoesDeNatureza._results[index].nativeElement.classList.value
     let classes = this.botoesDeNatureza._results[index].nativeElement.classList
    
     if(classesString.includes("active")){
       classes.remove("active")
     } else {classes.add("active")} 
 
     this.filtrar(false) // iniciar função do filtro
  }

  getSumDebitos(movimentacoes:any[]){
    let soma = 0
    for(var i = 0; i < movimentacoes.length; i++){
      if(movimentacoes[i].natureza == "D")
      soma = soma + movimentacoes[i].valor
    }
    return soma
  }

  getSumCreditos(movimentacoes:any[]){
    let soma = 0
    for(var i = 0; i < movimentacoes.length; i++){
      if(movimentacoes[i].natureza == "C")
      soma = soma + movimentacoes[i].valor
    }
    return soma
  }

  filtrar(primeirocarregamento:boolean){

    //LÓGICA CASO HOUVE INSERÇÃO DE MOVIMENTAÇÕES VIA ARQUIVO CSV:
      if(this.novoArrayCsv){
        //ativar botão do respectivo mês de referência:
        let codigoParaProcurar = this.csvArrayMesRef.codigoMesRef.toString().substring(4,6) + "/" + this.csvArrayMesRef.codigoMesRef.toString().substring(0,4)
        let botaoMesRefNovoArrayCsv:any[] = this.botoesDeMeses._results
        botaoMesRefNovoArrayCsv.filter(e => e.nativeElement.innerText == codigoParaProcurar)[0].nativeElement.classList.add("active")
        
        //desativar outros botões de mês:
        let outrosBotoesAtivos = botaoMesRefNovoArrayCsv.filter(e => e.nativeElement.innerText !== codigoParaProcurar && e.nativeElement.classList.value.includes("active"))
        outrosBotoesAtivos.forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //ativar botão de origem do respectivo cartão de crédito: 
        let botoesDeOrigem:any[] = this.botoesDeOrigem._results
        botoesDeOrigem.filter(e => e.nativeElement.innerText == this.csvArrayCartao.title)[0].nativeElement.classList.add("active")

        //desativar os outros botões de origem
        let outrosBotoesDeOrigemAtivos = botoesDeOrigem.filter(e => e.nativeElement.innerText !== this.csvArrayCartao.title && e.nativeElement.classList.value.includes("active"))
        outrosBotoesDeOrigemAtivos.forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //desativar todos os botões de categoria que estiverem ativos:
        let botoesDeCategoriaAtivos:any[] = this.botoesDeCategoria._results
        botoesDeCategoriaAtivos.filter(e => e.nativeElement.classList.value.includes("active")).forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //desativar todos os botões de estabelecimento que estiverem ativos:
        let botoesDeEstabelecimentoAtivos:any[] = this.botoesDeEstabelecimento._results
        botoesDeEstabelecimentoAtivos.filter(e => e.nativeElement.classList.value.includes("active")).forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //desativar todos os botões de status que estiverem ativos:
        let botoesDeStatusAtivos:any[] = this.botoesDeStatusEfetuadas._results
        botoesDeStatusAtivos.filter(e => e.nativeElement.classList.value.includes("active")).forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //desativar todos os botões de orcamento que estiverem ativos:
        let botoesDeOrcamentoAtivos:any[] = this.botoesDeOrcamento._results
        botoesDeOrcamentoAtivos.filter(e => e.nativeElement.classList.value.includes("active")).forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //desativar todos os botões de natureza que estiverem ativos:
        let botoesDeNaturezaAtivos:any[] = this.botoesDeNatureza._results
        botoesDeNaturezaAtivos.filter(e => e.nativeElement.classList.value.includes("active")).forEach((item) => {
          item.nativeElement.classList.remove("active")
        })

        //VOLTAR BOOLEANO PARA VALOR DE ORIGEM: (fora tornado true após a emissão do evento 'salvouCsv' pela InserirCsvComponent)
        this.novoArrayCsv = false
      }
    //////////////////  
      
      
      

      if(primeirocarregamento) {
       let botoes:any[] = this.botoesDeMeses._results 
      // console.log(botoes)
       botoes = botoes.filter(e => e.nativeElement.innerText == this.mesRefAtual)
       if (botoes.length > 0) {
        botoes[0].nativeElement.classList.add("active")
        this.toastr.info("","Mes atual (" + this.mesRefAtualRotulo + ") selecionado no filtro",{positionClass:"toast-top-full-width"})
       }
      
      }

      //DESCOBRIR QUAIS BOTÕES DE FILTRO DE ESTABELECIMENTO ESTÃO ATIVOS E SEUS VALORES:
      let botoesDeEstabelecimentoAtivos:any[] = []
      let botoesDeCategoriaAtivos:any[] = []
      let botoesDeMesesAtivos:any[] = []
      let botoesDeOrigemAtivos:any[] = []
      let botoesDeEfetuadasAtivos:any[] = []
      let botoesDeOrcamentosAtivos:any[] = []
      let botoesDeNaturezaAtivos:any[] = []
      
      this.botoesDeNatureza.toArray().forEach((item:any)=>{
        botoesDeNaturezaAtivos.push(item.nativeElement.classList.value.includes("active"))
      })


      this.botoesDeOrcamento.toArray().forEach((item:any)=>{
        botoesDeOrcamentosAtivos.push(item.nativeElement.classList.value.includes("active"))
      })

      this.botoesDeStatusEfetuadas.toArray().forEach((item:any)=>{
        botoesDeEfetuadasAtivos.push(item.nativeElement.classList.value.includes("active"))
      })
      
      this.botoesDeOrigem.toArray().forEach((item:any)=>{ //para cada botão de filtro de origem
        botoesDeOrigemAtivos.push(item.nativeElement.classList.value.includes("active")) //enviar true se tiver a classe "active"
      })

      this.botoesDeMeses.toArray().forEach((item:any)=>{ //para cada botão de filtro de mês
        botoesDeMesesAtivos.push(item.nativeElement.classList.value.includes("active")) //enviar true se tiver a classe "active"
      })

     
  
      this.botoesDeEstabelecimento.toArray().forEach((item:any)=>{ //para cada botão de filtro de estabalecimento
        botoesDeEstabelecimentoAtivos.push(item.nativeElement.classList.value.includes("active")) //enviar true se tiver a classe "active"
      })
  
      this.botoesDeCategoria.toArray().forEach((item:any)=>{ //para cada botão de filtro de categoria
        botoesDeCategoriaAtivos.push(item.nativeElement.classList.value.includes("active")) //enviar true se tiver a classe "active"
      })

      let indiceDosBotoesDeNaturezaAtivos:any[] = []
      for (var i = 0; i < botoesDeNaturezaAtivos.length; i++){
        if(botoesDeNaturezaAtivos[i] == true){
          indiceDosBotoesDeNaturezaAtivos.push(i)
        }
      }


      let indicesDosBotoesDeOrcamentoAtivos:any[] = []
      for(var i = 0; i < botoesDeOrcamentosAtivos.length; i++){
        if(botoesDeOrcamentosAtivos[i] == true){
          indicesDosBotoesDeOrcamentoAtivos.push(i)
        }
      }

      let indicesDosBotoesDeEfetuadasAtivos:any[] = []
      for (var i = 0; i < botoesDeEfetuadasAtivos.length; i++){
        if(botoesDeEfetuadasAtivos[i] == true){
          indicesDosBotoesDeEfetuadasAtivos.push(i)
        }
      }

      let indicesDosBotoesDeOrigemAtivos:any[] = []
      for (var i = 0; i < botoesDeOrigemAtivos.length; i++){ //pra cada um dos elementos do array de true/false
        if(botoesDeOrigemAtivos[i] == true){
          indicesDosBotoesDeOrigemAtivos.push(i) //adicionar o index dos que forem true
        }
      }

      let indicesDosBotoesDeMesesAtivos:any[]= []
      for (var i = 0; i < botoesDeMesesAtivos.length; i++){ //pra cada um dos elementos do array de true/false
        if(botoesDeMesesAtivos[i] == true){
          indicesDosBotoesDeMesesAtivos.push(i) //adicionar o index dos que forem true
        }
      }
  
      let indicesDosBotoesDeEstabelecimentoAtivos:any = [] 
      for (var i = 0; i < botoesDeEstabelecimentoAtivos.length; i++){ //pra cada um dos elementos do array de true/false
        if(botoesDeEstabelecimentoAtivos[i] == true){
          indicesDosBotoesDeEstabelecimentoAtivos.push(i) //adicionar o index dos que forem true
        }
      }
  
      let indicesDosbotoesDeCategoriaAtivos:any = [] 
      for (var i = 0; i < botoesDeCategoriaAtivos.length; i++){ //pra cada um dos elementos do array de true/false
        if(botoesDeCategoriaAtivos[i] == true){
          indicesDosbotoesDeCategoriaAtivos.push(i) //adicionar o index dos que forem true
        }
      }

      let naturezasParaFiltrar = []
      for (var i = 0; i < indiceDosBotoesDeNaturezaAtivos.length; i++){
        naturezasParaFiltrar.push(this.botoesDeNatureza._results[indiceDosBotoesDeNaturezaAtivos[i]].nativeElement.id) //usei o id pq o rótulo do botão foi editado
      }

      let orcamentosParaFiltrar = []
      for (var i = 0; i < indicesDosBotoesDeOrcamentoAtivos.length; i++){
        orcamentosParaFiltrar.push(this.botoesDeOrcamento._results[indicesDosBotoesDeOrcamentoAtivos[i]].nativeElement.innerText)
      }

      let efetuadasParaFiltrar = []
      for (var i = 0; i < indicesDosBotoesDeEfetuadasAtivos.length; i++){
        efetuadasParaFiltrar.push(this.botoesDeStatusEfetuadas._results[indicesDosBotoesDeEfetuadasAtivos[i]].nativeElement.id === "true") //usei o id pq o rótulo do botão foi editado
      }
 
   
      let origensParaFiltrar = []
      for (var i = 0; i < indicesDosBotoesDeOrigemAtivos.length; i++){
        origensParaFiltrar.push(this.botoesDeOrigem._results[indicesDosBotoesDeOrigemAtivos[i]].nativeElement.innerText)
      }

      let mesesParaFiltrar = []
      for (var i = 0; i < indicesDosBotoesDeMesesAtivos.length; i++){ //pra cada elemento do array de índice dos ativos
        mesesParaFiltrar.push(parseFloat(this.botoesDeMeses._results[indicesDosBotoesDeMesesAtivos[i]].nativeElement.innerText.substring(3,7)+this.botoesDeMeses._results[indicesDosBotoesDeMesesAtivos[i]].nativeElement.innerText.substring(0,2))) //inserir o texto do botão no array mesesParaFiltrar (código reajusta para formato numérico)
      }
    
      let estabelecimentosParaFiltrar = []
      for (var i = 0; i < indicesDosBotoesDeEstabelecimentoAtivos.length; i++) { //pra cada elemento do array de índice dos ativos
        estabelecimentosParaFiltrar.push(this.botoesDeEstabelecimento._results[indicesDosBotoesDeEstabelecimentoAtivos[i]].nativeElement.innerText) //inserir o texto do botão no array estabelecimentoParaFiltrar
      }
  
      let categoriasParaFiltrar = []
      for (var i = 0; i < indicesDosbotoesDeCategoriaAtivos.length; i++) { //pra cada elemento do array de índice dos ativos
        categoriasParaFiltrar.push(this.botoesDeCategoria._results[indicesDosbotoesDeCategoriaAtivos[i]].nativeElement.innerText) //inserir o texto do botão no array estabelecimentoParaFiltrar
      }


      //EXECUTAR FILTRO chamando a função 'filtrarTabela':
      this.popularTabela(estabelecimentosParaFiltrar, categoriasParaFiltrar, mesesParaFiltrar, origensParaFiltrar, efetuadasParaFiltrar, orcamentosParaFiltrar, naturezasParaFiltrar)
      
  }

  popularTabela(estabelecimentos:any[], categorias:any[], meses:any[], origens:any[], efetuadas:any[], orcamentos:any[], naturezas:any[]){
    let movimentacoesFiltradas = this.movimentacoes //começa com os filtrados sendo igual ao total
      
    //console.log(efetuadas)
    let filtraEstabelecimento:boolean = false
    let filtraCategoria:boolean = false
    let filtraMes:boolean = false
    let filtraOrigem:boolean = false
    let filtraEfetuadas:boolean = false
    let filtraOrcamentos:boolean = false
    let filtraNatureza:boolean = false
   

    if(naturezas.length > 0){
      filtraNatureza = true
    }

    if(efetuadas.length > 0){
      filtraEfetuadas = true
    }
    
    if(estabelecimentos.length > 0){
      filtraEstabelecimento = true
    } 

    if(categorias.length > 0){
      filtraCategoria = true
    }

    if(meses.length > 0){
      filtraMes = true
    }

    if(origens.length > 0){
      filtraOrigem = true
    }

    if(orcamentos.length > 0){
      filtraOrcamentos = true
    }


    


    if(filtraCategoria) {
      movimentacoesFiltradas = []
      for (var i = 0; i < this.movimentacoes.length; i++){
        if(categorias.indexOf(this.movimentacoes[i].categoria.title) !== -1) {
          movimentacoesFiltradas.push(this.movimentacoes[i])
        }  
      }      
    }

    if(filtraEstabelecimento){
      let movimentacoesFiltradas2 = []
      for (var i = 0; i < movimentacoesFiltradas.length; i++){
        if(estabelecimentos.indexOf(movimentacoesFiltradas[i].estabelecimentoPrestador) !== -1) {
          movimentacoesFiltradas2.push(movimentacoesFiltradas[i])
        }  
      } 
      movimentacoesFiltradas = movimentacoesFiltradas2  
    } 

    if(filtraMes){
      let movimentacoesFiltradas2 = []
      for (var i = 0; i < movimentacoesFiltradas.length; i++){
        if(meses.indexOf(movimentacoesFiltradas[i].mesRef) !== -1){
          movimentacoesFiltradas2.push(movimentacoesFiltradas[i])
        }
      }
      movimentacoesFiltradas = movimentacoesFiltradas2
    }

    if(filtraOrigem){
      let movimentacoesFiltradas2 = []
      for (var i = 0; i < movimentacoesFiltradas.length; i++){
        if(origens.indexOf(movimentacoesFiltradas[i].origem.title) !== -1){
          movimentacoesFiltradas2.push(movimentacoesFiltradas[i])
        }
      }
      movimentacoesFiltradas = movimentacoesFiltradas2
    }

    if(filtraEfetuadas){
      let movimentacoesFiltradas2 = []
      for (var i = 0; i < movimentacoesFiltradas.length; i++){
        if(efetuadas.indexOf(movimentacoesFiltradas[i].efetuada) !== -1){
          movimentacoesFiltradas2.push(movimentacoesFiltradas[i])
        }
      }
      movimentacoesFiltradas = movimentacoesFiltradas2
    }

    if(filtraOrcamentos){
      let movimentacoesFiltradas2 = []
      for (var i = 0; i < movimentacoesFiltradas.length; i++){
        if(orcamentos.indexOf(movimentacoesFiltradas[i].orcamento.title) !== -1){
          movimentacoesFiltradas2.push(movimentacoesFiltradas[i])
        }
      }
      movimentacoesFiltradas = movimentacoesFiltradas2
    }

    if(filtraNatureza){
      let movimentacoesFiltradas2 = []
      for (var i = 0; i < movimentacoesFiltradas.length; i++){
        if(naturezas.indexOf(movimentacoesFiltradas[i].natureza) !== -1){
          movimentacoesFiltradas2.push(movimentacoesFiltradas[i])
        }
      }
      movimentacoesFiltradas = movimentacoesFiltradas2
    }

       
   this.totalDebitos = this.getSumDebitos(movimentacoesFiltradas)
   this.totalCreditos = this.getSumCreditos(movimentacoesFiltradas)

    this.movimentacoesToTable = movimentacoesFiltradas
    //console.log(movimentacoesFiltradas)

    this.ressaltar()
   
  }

  ressaltar() {
    if(this.temNovaMovimentacao){
      let agaga = this.movimentacoesToTable
      let indice = agaga.indexOf(agaga.filter(e => e._id == this.dadosNovaMov._id)[0])
      setTimeout(() => {
        this.tableRow._results[indice].nativeElement.classList.add("ressaltar")
        setTimeout(() => {
          agaga = this.movimentacoesToTable
          indice = agaga.indexOf(agaga.filter(e => e._id == this.dadosNovaMov._id)[0])
          this.tableRow._results[indice].nativeElement.classList.remove("ressaltar")
          this.temNovaMovimentacao = false
        },3000)
      },250)
      
    }
   
  }

  notNumber(valor:any) {
    if(valor === null) {
      return true
    } else {
      return isNaN(valor)
    }
    
  }


}

