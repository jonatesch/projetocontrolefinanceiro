import { Component, Output, OnInit, ViewChild, ViewChildren, EventEmitter } from '@angular/core';
import { WixApiService } from '../servico-teste.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmarExclusaoComponent } from '../confirmar-exclusao/confirmar-exclusao.component';
import { FiltrosComponent } from '../filtros/filtros.component';
import { NovaMovimentacaoComponent } from '../nova-movimentacao/nova-movimentacao.component';
import { EditarComponent } from '../editar/editar.component';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ConfirmarExclusaoTodasComponent } from '../confirmar-exclusao-todas/confirmar-exclusao-todas.component';
import { MarcarEfetuadasComponent } from '../marcar-efetuadas/marcar-efetuadas.component';
import { LocalStorageService } from '../local-storage.service';

import { Router } from '@angular/router';
import { ModalAguardarComponent } from '../modal-aguardar/modal-aguardar.component';

@Component({
  selector: 'app-tabela-movimentacoes',
  templateUrl: './tabela-movimentacoes.component.html',
  styleUrls: ['./tabela-movimentacoes.component.css']
})
export class TabelaMovimentacoesComponent implements OnInit {

  

  @ViewChild(FiltrosComponent) filtrosComponent:any;
  @ViewChild(NovaMovimentacaoComponent) novamovComponent:any;
  @ViewChild(EditarComponent) editarComponent:any
  @ViewChildren('tr') tableRows:any

  setarFiltro(evento:any) {
    if(evento !== 0) {
      if(evento.meses !== '') {
      this.filtro_MesesSelecionados = evento.meses
    }

    if(evento.categorias !== '') {
      this.filtro_CategoriasSelecionadas = evento.categorias
    }

    if(evento.estabelecimentos !== '') {
      this.filtro_EstabelecimentosSelecionados = evento.estabelecimentos
    }

    if(evento.origens !== '') {
      this.filtro_OrigensSelecionadas = evento.origens
    }

    if(evento.orcamentos !== '') {
      this.filtro_OrcamentosSelecionados = evento.orcamentos
    }

    this.tamanho = this.filtro_MesesSelecionados.length + this.filtro_CategoriasSelecionadas.length + this.filtro_EstabelecimentosSelecionados.length + this.filtro_OrcamentosSelecionados.length + this.filtro_OrigensSelecionadas.length
    }
    
    if(evento == 0) {
      this.tamanho = 0
    }
  }

  limparFiltros() {
    this.filtrosComponent.limparFiltros()
    this.filtro_MesesSelecionados = []
    this.filtro_CategoriasSelecionadas = []
    this.filtro_EstabelecimentosSelecionados = []
    this.filtro_OrcamentosSelecionados = []
    this.filtro_OrigensSelecionadas = []
  }

  filtro_MesesSelecionados:any[] = []
  filtro_CategoriasSelecionadas:any[] = []
  filtro_EstabelecimentosSelecionados:any[] = []
  filtro_OrigensSelecionadas:any[] = []
  filtro_OrcamentosSelecionados:any[] = []

  tamanho = 0

  limparCategoria(categoria:any) {
    let agaga:any[] = this.filtrosComponent.categoriasUtilizadas
    let indice = agaga.map(e => e._id).indexOf(categoria._id)
    this.filtrosComponent.setarFiltro_Categoria(indice)
  }

  limparMes(mes:any) {
    let agaga:any[] = this.filtrosComponent.mesesUtilizados
    let indice = agaga.map(e => e._id).indexOf(mes._id)
    this.filtrosComponent.setarFiltro_Meses(indice)
  }

  limparEstabelecimento(estab:any) {
    let agaga:any[] = this.filtrosComponent.estabelecimentosUtilizados
    let indice = agaga.map(e => e.title).indexOf(estab.title)
    this.filtrosComponent.setarFiltro_Estabelecimento(indice)
  }

  limparOrigem(origem:any) {
    let agaga:any[] = this.filtrosComponent.origensUtilizadas
    let indice = agaga.map(e => e._id).indexOf(origem._id)
    this.filtrosComponent.setarFiltro_Origem(indice)
  }

  limparOrcamento(orc:any) {
    let agaga:any[] = this.filtrosComponent.orcamentosUtilizados
    let indice = agaga.map(e => e._id).indexOf(orc._id)
    this.filtrosComponent.setarFiltro_Orcamento(indice)
  }

  userId:any = ''

  constructor(private _WixApiService:WixApiService, private modalService: NgbModal, private clipboardService:ClipboardService, private toastr:ToastrService, private _localStorage:LocalStorageService, private router:Router) { 
    _WixApiService.logou$.subscribe((dados:any) => {
      //this.movimentacoes = dados.movs
      this.userId = dados.user.contactId
      this.getMovimentacoesTeste('','')
    })
  }

  movimentacoes:any[] = []
  totalDebitos:number = 0
  totalCreditos:number = 0

  categoriasUtilizadas:any[] = []
  estabelecimentosUtilizados:any[] = []
  origensUtilizadas:any[] = []
  mesesUtilizados:any[] = []
  orcamentosUtilizados:any[] = []
  descricoes:string[] = []

  mesesDeReferencia:any[]

  carregandoMovimentacoes:boolean = false

  page = 1

  pageSize = 20

  escondido:boolean = true
  esconderNovaMov = true
  esconderFiltros = true

  esconderLixeira:boolean[] = []

  modoEdicao:boolean = false

  tooltipDescricao:boolean[] = []
  
  cbDescricao(index:number, descricao:string) {
    this.clipboardService.copy(descricao)
    this.tooltipDescricao[index] = false
    this.esconderLixeira[index] = true
  }

  showOptions(indice:number, evento:any) {
    evento.stopPropagation()
    this.esconderLixeira[indice] = false
  }

  hideOptions(indice:number, evento:any) {
    evento.stopPropagation()
    this.esconderLixeira[indice] = true
  }



  getMovimentacoes() {
    this.carregandoMovimentacoes = true
    this._WixApiService.getMovimentacoes().then(data => {
      this.movimentacoes = data
      this.movimentacoes.forEach(() => {
      })
      this.descricoes = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.descricao)) 
      this.movimentacoes.forEach(() => {
        this.esconderLixeira.push(true)
      })
      this.totalDebitos = this.getSum(this.movimentacoes,"D")
      this.totalCreditos = this.getSum(this.movimentacoes,"C")
      this.categoriasUtilizadas = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(this.movimentacoes.map(e => e.categoria))) 
      this.estabelecimentosUtilizados = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.estabelecimentoPrestador))  
      this.origensUtilizadas = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.origem.title)) 
      this.orcamentosUtilizados = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(this.movimentacoes.map(e => e.orcamento))) 
      let mesesTemp = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.mesRef))
      this.carregandoMovimentacoes = false
      return mesesTemp
    }).then((mesesRecebidos) => {
      this._WixApiService.getMesesDeReferencia().then(data => {
        this.mesesDeReferencia = data.items
        let meses:any[] = data.items
        this.mesesUtilizados = meses.filter(e => mesesRecebidos.includes(e.codigoMesRef))
        this.mesesUtilizados.forEach(mes => {
          mes.label = mes.title.substring(0,3).toLowerCase() + "/" + mes.codigoMesRef.toString().substring(2,4)
        })
      })
    })
  }

  getMovimentacoesTeste(comando:string, atualizadas:any) {
    this.carregandoMovimentacoes = true
    this._WixApiService.getMovimentacoesFromUser(this.userId).then(data => {
      this.movimentacoes = data
      if(comando == 'filtrar'){
        let dados = {
          mesesSelecionados: atualizadas[0].mesRef,
          origensSelecionadas: atualizadas[0].origem,
        }

        atualizadas[0].origem = atualizadas[0].origem._id


        this.filtrosComponent.getMovimentacoesTeste(atualizadas[0],dados)
      }
      this.movimentacoes.forEach(() => {
      })
      this.descricoes = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.descricao)) 
      this.movimentacoes.forEach(() => {
        this.esconderLixeira.push(true)
      })
      this.totalDebitos = this.getSum(this.movimentacoes,"D")
      this.totalCreditos = this.getSum(this.movimentacoes,"C")
      this.categoriasUtilizadas = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(this.movimentacoes.map(e => e.categoria))) 
      this.estabelecimentosUtilizados = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.estabelecimentoPrestador))  
      this.origensUtilizadas = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.origem.title)) 
      this.orcamentosUtilizados = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(this.movimentacoes.map(e => e.orcamento))) 
      let mesesTemp = this._WixApiService.removerIguaisEclassificar(this.movimentacoes.map(e => e.mesRef))
      this.carregandoMovimentacoes = false
      return mesesTemp
    }).then((mesesRecebidos) => {
      this._WixApiService.getMesesDeReferencia().then(data => {
        this.mesesDeReferencia = data.items
        let meses:any[] = data.items
        this.mesesUtilizados = meses.filter(e => mesesRecebidos.includes(e.codigoMesRef))
        this.mesesUtilizados.forEach(mes => {
          mes.label = mes.title.substring(0,3).toLowerCase() + "/" + mes.codigoMesRef.toString().substring(2,4)
        })
      })
    })
  }

  getSum(movimentacoes:any[],natureza:string) {
    let soma = 0
    for(var i = 0; i < movimentacoes.length; i++){
      if(movimentacoes[i].natureza == natureza)
      soma = soma + movimentacoes[i].valor
    }
    return soma
  }

  edicaoPendente:boolean = false
  mostrarFiltros() {
    if(!this.edicaoPendente) {
      this.escondido = !this.escondido
    }
    
  }

  mostrarNovaMov() {
    this.esconderNovaMov = !this.esconderNovaMov
  }

  selectPage(page:string) {
    this.page = parseInt(page, 10) || 1;
  }

  filtro(movsFiltradas:any) {
    this.movimentacoes = movsFiltradas
    this.totalDebitos = this.getSum(movsFiltradas,"D")
    this.totalCreditos = this.getSum(movsFiltradas,"C")
  }

  modalRef: NgbModalRef | undefined

  carregandoExclusao:boolean = false

  confirmarExclusao(index:number) {
    let numero = index + (this.pageSize*(this.page - 1))
    this.modalRef = this.modalService.open(ConfirmarExclusaoComponent, {centered:true})
    this.modalRef.componentInstance.movExcluir = this.movimentacoes[numero]
    this.modalRef.componentInstance.fecharModal.subscribe(() => {
      this.modalRef?.close()
    })
    this.modalRef.componentInstance.carregandoExclusao = this.carregandoExclusao
    this.modalRef.componentInstance.exclusaoConfirmada.subscribe(() => {
      this.carregandoExclusao = true
      let id = this.movimentacoes[numero]._id
      this._WixApiService.excluirMovimentacao(id).then((data) => {
        this.carregandoExclusao = false
        this.modalRef?.close()
        this.filtrosComponent.getMovimentacoesTeste('exclusao','')
        this.getMovimentacoesTeste('','')
        this.limparFiltros()

      })
    })
  }


  //quando emitido o evento 'novaMovimentacaoInserida' pela NovaMovimentacaoComponent:
  teste(evento:any) {
    this.limparFiltros()
    this.filtrosComponent.getMovimentacoesTeste(evento,'')
    
  }

  //quando emitido o evento 'done' pela filtrosComponent (avisa que terminou a função getMovimentacoes()):
  teste2() {
    this.novamovComponent.enviandoNovaMov = false
    this.escondido = false
  }

  resetMovs(){
    /* this.limparFiltros()
    this.filtrosComponent.getMovimentacoesTeste('atualizar','') */
    this.getMovimentacoesTeste('','')
    this.filtrosComponent.getMovimentacoesTeste('','')
    this.filtrosComponent.ajustarCategs()
    this.filtrosComponent.ajustarEstabs()
    this.filtrosComponent.ajustarMeses()
    this.filtrosComponent.ajustarOrcamentos()
    this.filtrosComponent.ajustarOrigs()
    this.limparFiltros()
    this.novamovComponent.enviandoNovaMov = false
  }

  editarMovimentacao(index:number) {
    if(this.modoEdicao) {
      let indice = index + ((this.page -1) * this.pageSize)
      this.modalRef = this.modalService.open(EditarComponent, {centered: true, windowClass: 'myCustomModalClass2'})
      this.modalRef.componentInstance.movimentacao = this.movimentacoes[indice]
      this.modalRef.componentInstance.editouMovimentacao.subscribe(() => {
        this.filtrosComponent.getMovimentacoesTeste('exclusao','')
        this.limparFiltros()
        this.getMovimentacoesTeste('','')

        this.modalRef?.close()
        
      })
      this.modalRef.componentInstance.editouSemSalvar.subscribe(() => {
        this.movimentacoes[indice].pendente = true
        this.escondido = true
        this.edicaoPendente = true
      })
      this.modalRef.componentInstance.naoAlterou.subscribe(() => {
        this.movimentacoes[indice].pendente = false
      })
    }
  }

  cancelarEdicao() {
    this.movimentacoes.filter(e => e.pendente == true).forEach((mov) => {
      delete mov.pendente
    })
    this.getMovimentacoesTeste('filtrar','')
    this.edicaoPendente = false
    this.modoEdicao = false
    
  }

  toggleModoEdicao() {
    this.modoEdicao = !this.modoEdicao
  }

  dePeriodize(info:any) {
    // apenas para retirar o ponto da abreviação de mês (ex.: '14 nov.' para '14 nov')
    if(info !== null) {
     return info.substring(0,6) 
    }
    
  }

  salvandoEdicoes:boolean = false
  editarMovimentacoes() {
    this.salvandoEdicoes = true
    let movimentacoes = this.movimentacoes.filter(e => e.pendente == true)

    this._WixApiService.atualizarMovimentacoes(movimentacoes).then((data) => {
      //console.log(data)
      this.salvandoEdicoes = false
      this.modalRef = this.modalService.open(ModalAguardarComponent,{centered:true, backdrop:'static'})
      this.edicaoPendente = false
      this.modoEdicao = false
      movimentacoes.forEach((mov) => {
        mov.pendente = false
      })
      this.limparFiltros()
      this.getMovimentacoesTeste('filtrar',movimentacoes)     
    })
  }

  fecharAguarde(){
    this.modalRef?.close()
  }

  openModal_Exclusao() {
    this.modalRef = this.modalService.open(ConfirmarExclusaoTodasComponent, {centered: true})
    this.modalRef.componentInstance.movimentacoes = this.movimentacoes
    this.modalRef.componentInstance.fecharModal.subscribe(() => {
      this.modalRef?.close()
    })
    this.modalRef.componentInstance.exclusoesRealizadas.subscribe((data:any) => {
      
      this.getMovimentacoesTeste('','')
      this.filtrosComponent.getMovimentacoesTeste('','')
      this.filtrosComponent.ajustarCategs()
      this.filtrosComponent.ajustarEstabs()
      this.filtrosComponent.ajustarMeses()
      this.filtrosComponent.ajustarOrcamentos()
      this.filtrosComponent.ajustarOrigs()
      this.limparFiltros()
      this.modalRef?.close()
    })

  }

  openModal_Efetuadas() {
    this.modalRef = this.modalService.open(MarcarEfetuadasComponent, {windowClass:'myCustomModalClass3', centered: true, scrollable: true})
  
    let naoEfetuadas = this.movimentacoes.filter(e => e.efetuada == false)
    this.modalRef.componentInstance.movsNaoEfetuadas = naoEfetuadas
    this.modalRef.componentInstance.atualizouEfetuadas.subscribe(() => {
      this.getMovimentacoesTeste('','')
      this.filtrosComponent.getMovimentacoesTeste('','')
      this.filtrosComponent.ajustarCategs()
      this.filtrosComponent.ajustarEstabs()
      this.filtrosComponent.ajustarMeses()
      this.filtrosComponent.ajustarOrcamentos()
      this.filtrosComponent.ajustarOrigs()
      this.limparFiltros()
      this.modalRef?.close()
    })
  
  }
  
  ngOnInit(): void {
   //this._WixApiService.opcoesAtualizadas('movimentacoesComponent')
   // this.getMovimentacoes()
   if(this._localStorage.get('userLoggedId') !== null){
    this.userId = this._localStorage.get('userLoggedId')
    this._WixApiService.abriuMovimentacoesComponent()
    this.getMovimentacoesTeste('','')
   } else {
     this.router.navigate(['/paginaprincipal'])
   }
   
   
    

  }

}
