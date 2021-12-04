import { ViewChild, Component, OnInit, ViewChildren, Output, EventEmitter } from '@angular/core';

import { excluirOpcao } from '../excluirOrigem';
import { excluirCategoria } from '../excluirCategoria';

import { WixApiService } from '../servico-teste.service';

import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'modal-editar-opcoes',
  templateUrl: './modal-editar-opcoes.component.html',
  styleUrls: ['./modal-editar-opcoes.component.css']
})

export class ModalEditarOpcoesComponent implements OnInit {

  constructor(private _wixApiService: WixApiService, private toastr:ToastrService) { }

  @ViewChild('novaCategoriaInput') novaCategoriaInput : any
  @ViewChild('novaOrigemInput') novaOrigemInput : any
  @ViewChildren('liCategorias') liCategorias: any
  @ViewChildren('liOrigens') liOrigens: any
  @ViewChild('mensagemOrigemExcluida') mensagemOrigemExcluida: any
  @ViewChild('mensagemCategoriaExcluida') mensagemCategoriaExcluida: any
  @ViewChild('mensagemCategoriaErro') mensagemCategoriaErro: any
  @ViewChild('mensagemOrigemErro') mensagemOrigemErro: any
  @ViewChild('iconSelector') iconSelector:any

  @Output() atualizouCategorias:EventEmitter<any> = new EventEmitter();
  @Output() atualizouOrigens:EventEmitter<any> = new EventEmitter();
  
  categorias: any[] = []
  origens: any[] = []
 
  novaCategoria = {"title": "", "icone":"fas fa-tag", "impedirExclusao":false}
  novaOrigem = {"title": "","cartaoDeCredito":false}

  iconesArray:any[] = []
  
  getIcones() {
    this._wixApiService.getIcones().then((data) => {
      this.iconesArray = data
    })
  }

 getCategorias() : void {
    this._wixApiService.getCategorias().then((data) => {
      this.categorias = data
      this.atualizouCategorias.emit(this.categorias)
    })

 }

 getOrigens() : void {
   this._wixApiService.getOrigens().then((data) => {
     this.origens = data
     this.atualizouOrigens.emit(this.origens)
   })
 } 

  observarInputCategoria(evento:any) {    
    if(evento.keyCode == 13) {
      this.adicionarCategoria()
    }
  }

  setarNovaCategoria(evento:any) {
    this.novaCategoria.title = evento.toLowerCase()
  }


  observarInputOrigem(evento:any) {
    evento.target.value = evento.target.value.substring(0,1).toUpperCase() + evento.target.value.substring(1,evento.target.value.length)
    this.novaOrigem.title = evento.target.value.substring(0,1).toUpperCase() + evento.target.value.substring(1,evento.target.value.length)
    if(evento.keyCode == 13){
      this.adicionarOrigem()
    }
  }

  adicionarOrigem() : void {
    if(this.novaOrigem.title.length > 0) {

      if(this.origens.map(e => e.title).includes(this.novaOrigem.title)) {
        this.toastr.error("","já existe uma origem " + this.novaOrigem.title,{positionClass:"toast-top-center"})
      } else {
        this._wixApiService.adicionarOrigem(this.novaOrigem).then((data:any) => {
        this.origens = data.totais
        this.atualizouOrigens.emit(this.origens)
        this._wixApiService.opcoesAtualizadas('origem')
        this.novaOrigemInput.nativeElement.value = null
        let idNovaCategoria = data.nova._id
        let indice:number = 0
        for(var i = 0; i < this.origens.length; i++) {
          if(this.origens[i]._id == idNovaCategoria) {
            indice = i
          }
        }
        setTimeout(()=>{
          var mensagem = "origem " + this.novaOrigem.title + " adicionada"
        this.toastr.success("",mensagem,{positionClass:"toast-top-center"})
          this.liOrigens._results[indice].nativeElement.classList.add("ressaltar")
          this.liOrigens._results[indice].nativeElement.children[2].textContent = "nova"
          setTimeout(()=>{
            this.liOrigens._results[indice].nativeElement.classList.remove("ressaltar")
            this.liOrigens._results[indice].nativeElement.children[2].textContent = ""
          },3000)
        },500)
      })
    }
      }

       else {
      this.toastr.error("","campo vazio",{positionClass:"toast-top-center"})
    }
  }

  adicionarCategoria() : void {
    if(this.novaCategoria.title.length > 0) {

      if(this.categorias.map(e => e.title).includes(this.novaCategoria.title)) {
        this.toastr.error("","já existe uma categoria " + this.novaCategoria.title,{positionClass:"toast-top-center"})
      } else {
         this._wixApiService.adicionarCategoria(this.novaCategoria).then((data) => {
        this._wixApiService.getCategorias().then(categorias => {
          this.categorias = categorias
          //console.log(this.categorias)
          this.novaCategoriaInput.nativeElement.value = null
          this.atualizouCategorias.emit(this.categorias)
          this._wixApiService.opcoesAtualizadas('categoria') // avisa a NovaMovimentacaoComponent para buscar novamente as categorias no database (a NovaMovimentacaoComponent tem um subscribe ao observable gerado por essa funcao)

          setTimeout(() => {
            let mensagem = "categoria " + this.novaCategoria.title + " adicionada" 
            this.toastr.success("",mensagem,{positionClass:"toast-top-center"})
            let indice = this.categorias.map(e => e._id).indexOf(data.nova._id)
            this.liCategorias._results[indice].nativeElement.classList.add("ressaltar")
            this.liCategorias._results[indice].nativeElement.children[2].textContent = "nova"
            setTimeout(() => {
              this.liCategorias._results[indice].nativeElement.classList.remove("ressaltar")
            this.liCategorias._results[indice].nativeElement.children[2].textContent = ""
            },2500)
        
          },600)

        })
      })
    }
      }

      else {
      this.toastr.error("","campo vazio",{positionClass:"toast-top-center"})
    }
  }

  



  excluirCategoria(objeto:excluirCategoria, index:number) {
    
    if(objeto.impedirExclusao){
      this.toastr.error("","não é permitido excluir essa categoria",{positionClass:"toast-top-center"})
    } else {
      this._wixApiService.excluirCategoria(objeto).then((data) => {
        let excluiu = data.excluiu
        if(excluiu) {
          this.getCategorias()
          let mensagem = "categoria " + objeto.nome + " excluída"
          this.toastr.success("",mensagem,{positionClass:"toast-top-center"})
          this._wixApiService.opcoesAtualizadas('categoria')
        } else {
          this.liCategorias._results[index].nativeElement.children[1].textContent = "*"
          //this.mensagemCategoriaErro.nativeElement.textContent = 'categoria sendo usada'
          var mensagem = "categoria " + objeto.nome.substring(0,1).toUpperCase() + objeto.nome.substring(1,objeto.nome.length) + "(*) está sendo usada"
          this.toastr.error("",mensagem,{positionClass:"toast-top-center"})
          setTimeout(() => {
            this.liCategorias._results[index].nativeElement.children[1].textContent = ""
            //this.mensagemCategoriaErro.nativeElement.textContent = ''
          },2000)
         
        }
      })
    }
  }

  excluirOrigem(objeto:excluirOpcao, index:number) {
    this._wixApiService.excluirOrigem(objeto).then((data) => {
      let excluiu = data.excluiu
      if(excluiu){
        this.getOrigens()
        var mensagem = "origem " + objeto.nome + " excluída"
        this.toastr.success("",mensagem,{positionClass:"toast-top-center"})
        this._wixApiService.opcoesAtualizadas('origem')
        //this.mensagemOrigemExcluida.nativeElement.textContent = 'origem "' + objeto.nome + '" excluída'
        setTimeout(() => {
          this.mensagemOrigemExcluida.nativeElement.textContent = ""
        },2000)
      } else {
        this.liOrigens._results[index].nativeElement.children[1].textContent = "*"
        var mensagem = "origem " + objeto.nome + "(*) está sendo usada"
        this.toastr.error("",mensagem,{positionClass:"toast-top-center"})
        //this.mensagemOrigemErro.nativeElement.textContent = 'origem sendo usada'
        setTimeout(() => {
          this.liOrigens._results[index].nativeElement.children[1].textContent = ""
          this.mensagemOrigemErro.nativeElement.textContent = ''
        },2000)
      }
    })
  }

  mostrarLixeira(index:number) {
    this.liCategorias._results[index].nativeElement.children[0].classList.add("trash-icon-mostrar")
    this.liCategorias._results[index].nativeElement.children[0].children[0].classList.add("branco")
  }

  esconderLixeira(index:number) {
    this.liCategorias._results[index].nativeElement.children[0].classList.remove("trash-icon-mostrar")
    this.liCategorias._results[index].nativeElement.children[0].children[0].classList.remove("branco")
  }

  mostrarLixeiraOrigens(index:number) {
    this.liOrigens._results[index].nativeElement.children[0].classList.add("trash-icon-mostrar")
    this.liOrigens._results[index].nativeElement.children[0].children[0].classList.add("branco")
  }

  esconderLixeiraOrigens(index:number) {
    this.liOrigens._results[index].nativeElement.children[0].classList.remove("trash-icon-mostrar")
    this.liOrigens._results[index].nativeElement.children[0].children[0].classList.remove("branco")
  }

  blur(evento:any) {
    evento.target.blur()
  }

  ngOnInit() {
   this.getCategorias()
   this.getOrigens()
   this.getIcones()
   setTimeout(() => {
     this.iconSelector.nativeElement.blur()
   })
   
  }

  ngAfterViewInit() {
  }


}
