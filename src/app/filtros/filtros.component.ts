import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WixApiService } from '../servico-teste.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent implements OnInit {


  @Output() filtro:EventEmitter<any> = new EventEmitter()
  @Input() dadosNovaMovimentacao: {}
  @Output() done:EventEmitter<any> = new EventEmitter()
  @Output() setouFiltro:EventEmitter<any> = new EventEmitter()
  @Output() fecharAguarde:EventEmitter<any> = new EventEmitter()


  constructor(private _WixApiService:WixApiService, private _localStorage:LocalStorageService) {
    _WixApiService.logou$.subscribe((dados:any) => {
      console.log(dados)
      this.user = dados.user.contactId
      console.log(this.user)
      this.getMovimentacoesTeste('','')
    })
   }

  movimentacoesAll:any[] = []
  movimentacoesAtuais:any[] = []

  mesesUtilizados:any[] = []
  categoriasUtilizadas:any[] = []
  estabelecimentosUtilizados:any[] = []
  origensUtilizadas:any[] = []
  orcamentosUtilizados:any[] = []

  ativados_Meses:boolean[] = []
  ativados_Categorias:boolean[] = []
  ativados_Estabelecimentos:boolean[] = []
  ativados_Origens:boolean[] = []
  ativados_Orcamentos:boolean[] = []

  temFiltro:boolean = false
  temCoisa_Estabelecimentos:boolean[] = []
  temCoisa_Origens:boolean[] = []
  temCoisa_Orcamentos:boolean[] = []
  temCoisa_Meses:boolean[] = []


  ativados_Meses_Qtde:number = 0
  ativados_Orcamentos_Qtde:number = 0

  filtro_categoriasSelecionadas:any[] = []
  filtraCategoria:boolean = false
  filtro_mesesSelecionados:any[] = []
  filtraMes:boolean = false
  filtro_estabelecimentosSelecionados:any[] = []
  filtraEstabelecimento:boolean = false
  filtro_origensSelecionadas:any[] =[]
  filtraOrigem:boolean = false
  filtro_orcamentosSelecionados:any[] = []
  filtraOrcamento:boolean = false

  isFiltered_CategoriaSlicer:boolean = false
  isFiltered_EstabelecimentoSlicer:boolean = false
  isFiltered_OrigemSlicer:boolean = false
  isFiltered_MesSlicer:boolean = false
  isFiltered_OrcamentosSlicer:boolean = false

  mesesAfrente:number = 0
  categsAfrente:number = 0
  estabsAfrente:number = 0
  origsAfrente:number = 0
  orcsAfrente:number = 0


  limparFiltros() {

    this.mesesUtilizados.forEach(mes => {
      mes.filtrar = false
    })
    this.filtro_mesesSelecionados = []

    this.categoriasUtilizadas.forEach(categ => {
      categ.filtrar = false
    })
    this.filtro_categoriasSelecionadas = []

    this.estabelecimentosUtilizados.forEach(estab => {
      estab.filtrar = false
    })
    this.filtro_estabelecimentosSelecionados = []

    this.origensUtilizadas.forEach(orig => {
      orig.filtrar = false
    })
    this.filtro_origensSelecionadas = []

    this.orcamentosUtilizados.forEach(orc => {
      orc.filtrar = false
    })
    this.filtro_orcamentosSelecionados = []

    this.ajustarMeses()
    this.ajustarCategs()
    this.ajustarEstabs()
    this.ajustarOrigs()
    this.ajustarOrcamentos()


   

    this.filtrarTabela()
    this.setouFiltro.emit(0)
  }

  setarFiltro_Categoria(index:number) {
      this.categoriasUtilizadas[index].filtrar = !this.categoriasUtilizadas[index].filtrar
      this.filtro_categoriasSelecionadas = this.categoriasUtilizadas.filter(e => e.filtrar == true)

    /*  if(this.filtro_categoriasSelecionadas.length == 0) {
        this.filtro_categoriasSelecionadas = this.categoriasUtilizadas      
      } else {
        this.isFiltered_EstabelecimentoSlicer = true
      } */

      this.filtrarTabela()  

      this.ajustarEstabs()
      this.ajustarOrigs()
      this.ajustarMeses()
      this.ajustarOrcamentos()

      if(this.filtro_categoriasSelecionadas.length == 0) {
        this.ajustarCategs()
      }

      let filtrosTags = {categorias:this.filtro_categoriasSelecionadas, meses:'', estabelecimentos:'', origens:'',orcamentos:''}

      this.setouFiltro.emit(filtrosTags)

    // this.ajustarFiltros('categoria')
    
  }

  setarFiltro_Estabelecimento(index:number) {
    this.estabelecimentosUtilizados[index].filtrar = !this.estabelecimentosUtilizados[index].filtrar
    this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados.filter(e => e.filtrar == true) 

    this.filtrarTabela()

    this.ajustarCategs()
    this.ajustarOrigs()
    this.ajustarMeses()
    this.ajustarOrcamentos()

    if(this.filtro_estabelecimentosSelecionados.length == 0) {
      this.ajustarEstabs()
    }

    let filtrosTags = {categorias:'', meses:'', origens:'', orcamentos:'', estabelecimentos:this.filtro_estabelecimentosSelecionados}

    this.setouFiltro.emit(filtrosTags)
  }

  setarFiltro_Origem(index:number) {
    this.origensUtilizadas[index].filtrar = !this.origensUtilizadas[index].filtrar
    this.filtro_origensSelecionadas = this.origensUtilizadas.filter(e => e.filtrar == true)

    this.filtrarTabela()
    this.ajustarCategs() 
    this.ajustarEstabs()
    this.ajustarMeses()
    this.ajustarOrcamentos()

    if(this.filtro_origensSelecionadas.length == 0){
      this.ajustarOrigs()
    }

    let filtrosTags = {origens:this.filtro_origensSelecionadas, meses:'', categorias:'', estabelecimentos:'', orcamentos:''}

    this.setouFiltro.emit(filtrosTags)

    
  }

  setarFiltro_Meses(index:number) {
    this.mesesUtilizados[index].filtrar = !this.mesesUtilizados[index].filtrar
    
    this.filtro_mesesSelecionados = this.mesesUtilizados.filter(e => e.filtrar == true) 

    this.filtrarTabela()

    this.ajustarCategs()
    this.ajustarEstabs()
    this.ajustarOrigs()
    this.ajustarOrcamentos()

    if(this.filtro_mesesSelecionados.length == 0) {
      this.ajustarMeses()
    }

    let filtrosTags = {meses:this.filtro_mesesSelecionados, categorias:'', estabelecimentos:'', origens:'', orcamentos:''}

    this.setouFiltro.emit(filtrosTags)
  }

  setarFiltro_Orcamento(index:number) {
    this.orcamentosUtilizados[index].filtrar = !this.orcamentosUtilizados[index].filtrar
    this.filtro_orcamentosSelecionados = this.orcamentosUtilizados.filter(e => e.filtrar == true)

    this.filtrarTabela()
    this.ajustarCategs()
    this.ajustarEstabs()
    this.ajustarMeses()
    this.ajustarOrigs()

    if(this.filtro_orcamentosSelecionados.length == 0) {
      this.ajustarOrcamentos()
    }

    let filtrosTags = {orcamentos:this.filtro_orcamentosSelecionados, meses:'', categorias:'', estabelecimentos:'', origens:''}

    this.setouFiltro.emit(filtrosTags)
  }




  ajustarCategs() {
    if(this.filtro_estabelecimentosSelecionados.length > 0 || this.filtro_origensSelecionadas.length > 0 || this.filtro_mesesSelecionados.length > 0 || this.filtro_orcamentosSelecionados.length > 0) {
      this.isFiltered_CategoriaSlicer = true
    } else {
      this.isFiltered_CategoriaSlicer = false
    }
  

    //REORDENAR SLICER DE CATEGORIAS:
    let movsAtuais_Categorias = this._WixApiService.sortByTitle(this.categoriasUtilizadas.filter(e => this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.categoria.title)).includes(e.title))) 
    let movsAtuais_CategoriasResto = this._WixApiService.sortByTitle(this.categoriasUtilizadas.filter(e => !this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.categoria.title)).includes(e.title)))
    
    this.categoriasUtilizadas = movsAtuais_Categorias.concat(movsAtuais_CategoriasResto)

    if(this.isFiltered_CategoriaSlicer) {
      this.categsAfrente = this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.categoria.title)).length 
    } else {
      this.categsAfrente = 0
      this._WixApiService.sortByTitle(this.categoriasUtilizadas)
    }

  }

  ajustarMeses() {
    if(this.filtro_categoriasSelecionadas.length > 0 || this.filtro_estabelecimentosSelecionados.length > 0 || this.filtro_origensSelecionadas.length > 0 || this.filtro_orcamentosSelecionados.length > 0) {
      this.isFiltered_MesSlicer = true
    } else {
      this.isFiltered_MesSlicer = false
    }
    
    //REORDENAR SLICER DE MESES:
    let movsAtuais_Meses = this._WixApiService.sortByMesRef(this.mesesUtilizados.filter(e => this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.mesRef)).includes(e.codigoMesRef))) 
    let movsAtuais_MesesResto = this._WixApiService.sortByMesRef(this.mesesUtilizados.filter(e => !this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.mesRef)).includes(e.codigoMesRef))) 
    
    this.mesesUtilizados = movsAtuais_Meses.concat(movsAtuais_MesesResto)

    if(this.isFiltered_MesSlicer) {
      this.mesesAfrente = this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.mesRef)).length
    } else {
      this.mesesAfrente = 0
      this._WixApiService.sortByMesRef(this.mesesUtilizados)
    }

  }

  ajustarEstabs() {
      if(this.filtro_categoriasSelecionadas.length > 0 || this.filtro_origensSelecionadas.length > 0 || this.filtro_mesesSelecionados.length > 0 || this.filtro_orcamentosSelecionados.length > 0) {
        this.isFiltered_EstabelecimentoSlicer = true
      } else {
        this.isFiltered_EstabelecimentoSlicer = false
      }

      console.log(this.isFiltered_EstabelecimentoSlicer)
    //REORDENAR SLICER DE ESTABELECIMENTOS:
    let movsAtuais_Estabelecimentos:any[] = this._WixApiService.sortByTitle(this.estabelecimentosUtilizados.filter(e => this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.estabelecimentoPrestador)).includes(e.title))) 
    let movsAtuais_EstabelecimentosResto:any[] = this._WixApiService.sortByTitle(this.estabelecimentosUtilizados.filter(e => !this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.estabelecimentoPrestador)).includes(e.title))) 

    this.estabelecimentosUtilizados = movsAtuais_Estabelecimentos.concat(movsAtuais_EstabelecimentosResto)
  


    if(this.isFiltered_EstabelecimentoSlicer) {
        this.estabsAfrente = this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.estabelecimentoPrestador)).length 
        
      } else {
        //quando outro filtro for desativado e mais nenhum estiver ativo:
        this.estabsAfrente = 0
        this._WixApiService.sortByTitle(this.estabelecimentosUtilizados)
      }
  
  }

  ajustarOrigs() {
    if(this.filtro_categoriasSelecionadas.length > 0 || this.filtro_estabelecimentosSelecionados.length > 0 || this.filtro_mesesSelecionados.length > 0 || this.filtro_orcamentosSelecionados.length > 0) {
      this.isFiltered_OrigemSlicer = true
    } else {
      this.isFiltered_OrigemSlicer = false
    }

  
    //REORDENAR SLICER DE ORIGENS:
    let movsAtuais_Origens:any[] = this._WixApiService.sortByTitle(this.origensUtilizadas.filter(e => this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.origem.title)).includes(e.title))) 
    let movsAtuais_OrigensResto:any[] = this._WixApiService.sortByTitle(this.origensUtilizadas.filter(e => !this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.origem.title)).includes(e.title))) 

    this.origensUtilizadas = movsAtuais_Origens.concat(movsAtuais_OrigensResto)


    if(this.isFiltered_OrigemSlicer) {
      this.origsAfrente = this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.origem.title)).length 
    } else {
      this.origsAfrente = 0
      this._WixApiService.sortByTitle(this.origensUtilizadas)
    }


  }

  ajustarOrcamentos() {
    if(this.filtro_categoriasSelecionadas.length > 0 || this.filtro_estabelecimentosSelecionados.length > 0 || this.filtro_origensSelecionadas.length > 0 || this.filtro_mesesSelecionados.length > 0) {
      this.isFiltered_OrcamentosSlicer = true
    } else {
      this.isFiltered_OrcamentosSlicer = false
    }

    //REORDENAR SLICER DE ORIGENS:
    let movsAtuais_Orcamentos = this._WixApiService.sortByTitle(this.orcamentosUtilizados.filter(e => this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.orcamento.title)).includes(e.title))) 
    let movsAtuais_OrcamentosResto = this._WixApiService.sortByTitle(this.orcamentosUtilizados.filter(e => !this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.orcamento.title)).includes(e.title)))
  
    this.orcamentosUtilizados = movsAtuais_Orcamentos.concat(movsAtuais_OrcamentosResto)

    if(this.isFiltered_OrcamentosSlicer) {
      this.orcsAfrente = this._WixApiService.removerIguaisEclassificar(this.movimentacoesAtuais.map(e => e.orcamento.title)).length 
    } else {
      this.orcsAfrente = 0
      this._WixApiService.sortByTitle(this.orcamentosUtilizados)
    }
  }




  filtrarTabela() {
    this.movimentacoesAtuais = this.movimentacoesAll

    if(this.filtro_mesesSelecionados.length > 0) {
      this.movimentacoesAtuais = this.movimentacoesAtuais.filter(e => this.filtro_mesesSelecionados.map(e => e.codigoMesRef).includes(e.mesRef))
    }

    //filtro de categoria:
    if(this.filtro_categoriasSelecionadas.length > 0) {
      this.movimentacoesAtuais = this.movimentacoesAtuais.filter(e => this.filtro_categoriasSelecionadas.map(e => e.title).includes(e.categoria.title))  
    } 

    //filtro de estabelecimentos:
    if(this.filtro_estabelecimentosSelecionados.length > 0) {
          this.movimentacoesAtuais = this.movimentacoesAtuais.filter(e => this.filtro_estabelecimentosSelecionados.map(e => e.title).includes(e.estabelecimentoPrestador))
    }   

    if(this.filtro_origensSelecionadas.length > 0) {
      this.movimentacoesAtuais = this.movimentacoesAtuais.filter(e => this.filtro_origensSelecionadas.map(e => e.title).includes(e.origem.title))
    }

    if(this.filtro_orcamentosSelecionados.length > 0) {
      this.movimentacoesAtuais = this.movimentacoesAtuais.filter(e => this.filtro_orcamentosSelecionados.map(e => e.title).includes(e.orcamento.title))
    }
    
    this.filtro.emit(this.movimentacoesAtuais)

  }

  getMovimentacoes(dadosNovaMov:any) {
  this._WixApiService.getMovimentacoes().then(data => {
    //SETAR VARIÁVEL LOCAL COM TODAS AS MOVIMENTAÇÕES QUE VIERAM DO BANCO DE DADOS:
    let movimentacoes:any[] = data
    this.movimentacoesAll = data
    this.movimentacoesAtuais = data

    //SETAR VARIÁVEIS COM AS CATEGORIAS, ESTABELECIMENTOS, ORIGENS E ORCAMENTOS CONTIDOS NAS MOVIMENTAÇÕES
      this.categoriasUtilizadas = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(movimentacoes.map(e => e.categoria)))
      //this.filtro_categoriasSelecionadas = this.categoriasUtilizadas
        this.categoriasUtilizadas.forEach((categoria) => { //para cada categoria no array de categorias utilizadas:
          //this.ativados_Categorias.push(false)    //adicionar um "false" no array de filtros de categorias ativados
          categoria.filtrar = false
          categoria.naFrente = false
        })
      this.estabelecimentosUtilizados = this._WixApiService.removerIguaisEclassificar(movimentacoes.map(e => e.estabelecimentoPrestador)).map(e => ({'title':e}))
       //this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados 
      this.estabelecimentosUtilizados.forEach((estabelecimento) => { //para cada estabelecimento no array de estabelecimentos utilizadas:
          //this.ativados_Estabelecimentos.push(false)    //adicionar um "false" no array de filtros de estabelecimento ativados
          //this.temCoisa_Estabelecimentos.push(false)  
          estabelecimento.filtrar = false
          estabelecimento.naFrente = false
        })
      this.origensUtilizadas = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(movimentacoes.map(e => e.origem)))
        this.origensUtilizadas.forEach((origem) => {
          //this.ativados_Origens.push(false)
          //this.temCoisa_Origens.push(false)
          origem.filtrar = false
        })
      this.orcamentosUtilizados = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(movimentacoes.map(e => e.orcamento)))
        this.orcamentosUtilizados.forEach((orcamento) => {
          //this.ativados_Orcamentos.push(false)
          //this.temCoisa_Orcamentos.push(false)
          orcamento.filtrar = false
         
        })
    ///////////////////
    
    //SETAR VARIÁVEL LOCAL COM OS CÓDIGOS DE MES DE REFERÊNCIA DAS MOVIMENTAÇÕES
      let mesesTemp = this._WixApiService.removerIguaisEclassificar(movimentacoes.map(e => e.mesRef))
        return mesesTemp // tal variável é passada adiante para o then
    /////////////    
  }).then(mesesRecebidos => {
    this._WixApiService.getMesesDeReferencia().then(data => {
      //SETAR VARIÁVEL LOCAL COM OS MESES DE REFERÊNCIA QUE VIERAM DA QUERY NO DATABASE **DE MESES**
      let meses:any[] = data.items

      //SETAR VARIÁVEL COM OS OBJETOS DE MES DE REFERENCIA CONFORME MESES CONTIDOS NAS MOVIMENTAÇÕES
      this.mesesUtilizados = meses.filter(e => mesesRecebidos.includes(e.codigoMesRef))
      //e pra cada mês:
      this.mesesUtilizados.forEach(mes => {
        /* mes.label = mes.title.substring(0,3).toLowerCase() + "/" + mes.codigoMesRef.toString().substring(2,4) */ // adicionar uma propriedade chamada "label" para ser o rótulo das tags de filtro de mês
        mes.label = mes.codigoMesRef.toString().substring(4,6) + "/" + mes.codigoMesRef.toString().substring(0,4) // output tipo "10/2021"
        mes.filtrar = false
        //this.ativados_Meses.push(false) // e inserir um 'false' no array de meses ativados para cada item no mesesUtilizados
       // this.temCoisa_Meses.push(false)
      })
        if(dadosNovaMov !== '' && dadosNovaMov !== 'exclusao') {
          this.estabelecimentosUtilizados.forEach(estab => estab.filtrar = false)
          this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados.filter(e => e.filtrar == true)

          this.origensUtilizadas.forEach(orig => orig.filtrar = false)
          this.filtro_origensSelecionadas = this.origensUtilizadas.filter(e => e.filtrar == true)

          this.orcamentosUtilizados.forEach(orc => orc.filtrar = false)
          this.filtro_orcamentosSelecionados = this.orcamentosUtilizados.filter(e => e.filtrar == true)

          this.mesesUtilizados.forEach(mes => mes.filtrar = false)
          this.filtro_mesesSelecionados = this.mesesUtilizados.filter(e => e.filtrar == true)

          this.ajustarEstabs()
          this.ajustarCategs()
          this.ajustarMeses()
          this.ajustarOrigs()
          this.ajustarOrcamentos()
          
          let categoriaIndex = this.categoriasUtilizadas.map(e => e._id).indexOf(this.categoriasUtilizadas.filter(e => e._id == dadosNovaMov.categoria)[0]._id)
          this.setarFiltro_Categoria(categoriaIndex)

          let mesRefIndex = this.mesesUtilizados.map(e => e.codigoMesRef).indexOf(dadosNovaMov.mesRef)
          this.setarFiltro_Meses(mesRefIndex)

          this.filtrarTabela()
          this.done.emit()
        }

        if(dadosNovaMov == 'exclusao') {
          this.estabelecimentosUtilizados.forEach(estab => estab.filtrar = false)
          this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados.filter(e => e.filtrar == true)

          this.categoriasUtilizadas.forEach(categ => categ.filtrar = false)
          this.filtro_categoriasSelecionadas = this.categoriasUtilizadas.filter(e => e.filtrar == true)

          this.origensUtilizadas.forEach(orig => orig.filtrar = false)
          this.filtro_origensSelecionadas = this.origensUtilizadas.filter(e => e.filtrar == true)

          this.orcamentosUtilizados.forEach(orc => orc.filtrar = false)
          this.filtro_orcamentosSelecionados = this.orcamentosUtilizados.filter(e => e.filtrar == true)

          this.mesesUtilizados.forEach(mes => mes.filtrar = false)
          this.filtro_mesesSelecionados = this.mesesUtilizados.filter(e => e.filtrar == true)

          this.ajustarEstabs()
          this.ajustarCategs()
          this.ajustarMeses()
          this.ajustarOrigs()
          this.ajustarOrcamentos()
        }

    })
  })
  }

  user:any = ''

  getMovimentacoesTeste(dadosNovaMov:any, filtros:any) {
    this._WixApiService.getMovimentacoesFromUser(this.user).then(data => {
     
      //SETAR VARIÁVEL LOCAL COM TODAS AS MOVIMENTAÇÕES QUE VIERAM DO BANCO DE DADOS:
      let movimentacoes:any[] = data
      this.movimentacoesAll = data
      this.movimentacoesAtuais = data
  
      //SETAR VARIÁVEIS COM AS CATEGORIAS, ESTABELECIMENTOS, ORIGENS E ORCAMENTOS CONTIDOS NAS MOVIMENTAÇÕES
        this.categoriasUtilizadas = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(movimentacoes.map(e => e.categoria)))
        //this.filtro_categoriasSelecionadas = this.categoriasUtilizadas
          this.categoriasUtilizadas.forEach((categoria) => { //para cada categoria no array de categorias utilizadas:
            //this.ativados_Categorias.push(false)    //adicionar um "false" no array de filtros de categorias ativados
            categoria.filtrar = false
            categoria.naFrente = false
          })
        this.estabelecimentosUtilizados = this._WixApiService.removerIguaisEclassificar(movimentacoes.map(e => e.estabelecimentoPrestador)).map(e => ({'title':e}))
         //this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados 
        this.estabelecimentosUtilizados.forEach((estabelecimento) => { //para cada estabelecimento no array de estabelecimentos utilizadas:
            //this.ativados_Estabelecimentos.push(false)    //adicionar um "false" no array de filtros de estabelecimento ativados
            //this.temCoisa_Estabelecimentos.push(false)  
            estabelecimento.filtrar = false
            estabelecimento.naFrente = false
          })
        this.origensUtilizadas = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(movimentacoes.map(e => e.origem)))
          this.origensUtilizadas.forEach((origem) => {
            //this.ativados_Origens.push(false)
            //this.temCoisa_Origens.push(false)
            origem.filtrar = false
          })
        this.orcamentosUtilizados = this._WixApiService.sortByTitle(this._WixApiService.removerDuplicatas(movimentacoes.map(e => e.orcamento)))
          this.orcamentosUtilizados.forEach((orcamento) => {
            //this.ativados_Orcamentos.push(false)
            //this.temCoisa_Orcamentos.push(false)
            orcamento.filtrar = false
           
          })
      ///////////////////
      
      //SETAR VARIÁVEL LOCAL COM OS CÓDIGOS DE MES DE REFERÊNCIA DAS MOVIMENTAÇÕES
        let mesesTemp = this._WixApiService.removerIguaisEclassificar(movimentacoes.map(e => e.mesRef))
          return mesesTemp // tal variável é passada adiante para o then
      /////////////    
    }).then(mesesRecebidos => {
      this._WixApiService.getMesesDeReferencia().then(data => {
        //SETAR VARIÁVEL LOCAL COM OS MESES DE REFERÊNCIA QUE VIERAM DA QUERY NO DATABASE **DE MESES**
        let meses:any[] = data.items
  
        //SETAR VARIÁVEL COM OS OBJETOS DE MES DE REFERENCIA CONFORME MESES CONTIDOS NAS MOVIMENTAÇÕES
        this.mesesUtilizados = meses.filter(e => mesesRecebidos.includes(e.codigoMesRef))
        //e pra cada mês:
        this.mesesUtilizados.forEach(mes => {
          /* mes.label = mes.title.substring(0,3).toLowerCase() + "/" + mes.codigoMesRef.toString().substring(2,4) */ // adicionar uma propriedade chamada "label" para ser o rótulo das tags de filtro de mês
          mes.label = mes.codigoMesRef.toString().substring(4,6) + "/" + mes.codigoMesRef.toString().substring(0,4) // output tipo "10/2021"
          mes.filtrar = false
          //this.ativados_Meses.push(false) // e inserir um 'false' no array de meses ativados para cada item no mesesUtilizados
         // this.temCoisa_Meses.push(false)
        })
          if(dadosNovaMov !== '' && dadosNovaMov !== 'exclusao' && dadosNovaMov !== 'atualizar') {
            this.estabelecimentosUtilizados.forEach(estab => estab.filtrar = false)
            this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados.filter(e => e.filtrar == true)
  
            this.origensUtilizadas.forEach(orig => orig.filtrar = false)
            this.filtro_origensSelecionadas = this.origensUtilizadas.filter(e => e.filtrar == true)
  
            this.orcamentosUtilizados.forEach(orc => orc.filtrar = false)
            this.filtro_orcamentosSelecionados = this.orcamentosUtilizados.filter(e => e.filtrar == true)
  
            this.mesesUtilizados.forEach(mes => mes.filtrar = false)
            this.filtro_mesesSelecionados = this.mesesUtilizados.filter(e => e.filtrar == true)
  
            this.ajustarEstabs()
            this.ajustarCategs()
            this.ajustarMeses()
            this.ajustarOrigs()
            this.ajustarOrcamentos()
            
            /* let categoriaIndex = this.categoriasUtilizadas.map(e => e._id).indexOf(this.categoriasUtilizadas.filter(e => e._id == dadosNovaMov.categoria)[0]._id)
            this.setarFiltro_Categoria(categoriaIndex) */

            let mesRefIndex = this.mesesUtilizados.map(e => e.codigoMesRef).indexOf(dadosNovaMov.mesRef)
            this.setarFiltro_Meses(mesRefIndex)

            let origemIndex:number = this.origensUtilizadas.map(e => e._id).indexOf(this.origensUtilizadas.filter(e => e._id == dadosNovaMov.origem)[0]._id)
            this.setarFiltro_Origem(origemIndex)
  
            this.filtrarTabela()
            this.done.emit()
          }
  
          if(dadosNovaMov == 'exclusao') {
            this.estabelecimentosUtilizados.forEach(estab => estab.filtrar = false)
            this.filtro_estabelecimentosSelecionados = this.estabelecimentosUtilizados.filter(e => e.filtrar == true)
  
            this.categoriasUtilizadas.forEach(categ => categ.filtrar = false)
            this.filtro_categoriasSelecionadas = this.categoriasUtilizadas.filter(e => e.filtrar == true)
  
            this.origensUtilizadas.forEach(orig => orig.filtrar = false)
            this.filtro_origensSelecionadas = this.origensUtilizadas.filter(e => e.filtrar == true)
  
            this.orcamentosUtilizados.forEach(orc => orc.filtrar = false)
            this.filtro_orcamentosSelecionados = this.orcamentosUtilizados.filter(e => e.filtrar == true)
  
            this.mesesUtilizados.forEach(mes => mes.filtrar = false)
            this.filtro_mesesSelecionados = this.mesesUtilizados.filter(e => e.filtrar == true)
  
            this.ajustarEstabs()
            this.ajustarCategs()
            this.ajustarMeses()
            this.ajustarOrigs()
            this.ajustarOrcamentos()
          }

          if(dadosNovaMov == 'atualizar'){
            console.log(filtros)            

            this.mesesUtilizados.forEach(mes => {
              if(filtros.mesesSelecionados == mes.codigoMesRef) {
                mes.filtrar = true
              } else {
                mes.filtrar = false
              }
            })

            this.origensUtilizadas.forEach(origem => {
              if(filtros.origensSelecionadas.title == origem.title) {
                origem.filtrar = true
              } else {
                origem.filtrar = false
              }
            })

            this.filtro_mesesSelecionados = this.mesesUtilizados.filter(e => e.filtrar == true)
            this.filtro_origensSelecionadas = this.origensUtilizadas.filter(e => e.filtrar == true)

            this.filtrarTabela()

            this.ajustarMeses()
            this.ajustarOrigs()
            this.ajustarEstabs()

            let filtrosTags = {origens:this.filtro_origensSelecionadas, meses:this.filtro_mesesSelecionados, categorias:'', estabelecimentos:'', orcamentos:''}

            this.setouFiltro.emit(filtrosTags)

            this.fecharAguarde.emit()
            
           

          }
  
      })
    })
    }
 

  ngOnInit(): void {
    //this.getMovimentacoes('')
    if(this._localStorage.get('userLoggedId') !== null){
      this.user = this._localStorage.get('userLoggedId')
      this.getMovimentacoesTeste('','')
     }
    
  }

}
