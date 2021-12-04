import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { WixApiService } from '../servico-teste.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-marcar-efetuadas',
  templateUrl: './marcar-efetuadas.component.html',
  styleUrls: ['./marcar-efetuadas.component.css']
})
export class MarcarEfetuadasComponent implements OnInit {

  @Output() atualizouEfetuadas:EventEmitter<any> = new EventEmitter();

  @ViewChildren('tableRow') tableRows: QueryList<ElementRef>

  movsNaoEfetuadas:any[] = []
  origens:any[] = []

  selecionadas:any[] = []

  marcaTodas:boolean = true

  taCarregandoUpdateEfetuadas:boolean = false

  carregando:boolean = true

  mostrarMensagemErro:boolean = false

  setarData(evento:any) {
    return new Date(evento+"T00:00:00")
  }

  adicionarCampo() {
    this.movsNaoEfetuadas.forEach((item) => {
      item.enviar = true
    })
  }

  toggleMarcar() {
    this.marcaTodas = !this.marcaTodas
    if(this.marcaTodas) {
      this.movsNaoEfetuadas.forEach((item) => {
        item.enviar = true
      })
      this.selecionadas = this.movsNaoEfetuadas.filter(e => e.enviar)
    } else {
      this.movsNaoEfetuadas.forEach((item) => {
        item.enviar = false
      })
      this.selecionadas = []
    }
  }

  setarEnvio(index:number) {
    this.movsNaoEfetuadas[index].enviar = !this.movsNaoEfetuadas[index].enviar
    this.selecionadas = this.movsNaoEfetuadas.filter(e => e.enviar)
  }


  atualizarMovsSelecionadas() {
    let movsSelecionadas = this.movsNaoEfetuadas.filter(mov => mov.enviar == true)
    if(movsSelecionadas.length > 0) {
      this.taCarregandoUpdateEfetuadas = true
      movsSelecionadas = this.movsNaoEfetuadas.filter(item => item.enviar == true)
      this._WixApiService.atualizarEfetuadas(movsSelecionadas).then(retorno => {
        console.log(retorno)
        this.atualizouEfetuadas.emit(retorno)
        setTimeout(() => {
          this.taCarregandoUpdateEfetuadas = false
        },3000)
      })
    } else {
      this.toastr.error("","Nenhuma movimentação selecionada",{positionClass:"toast-bottom-center"})
      /* this.mostrarMensagemErro = true
      setTimeout(() => {
        this.mostrarMensagemErro = false
      },3000) */
    }
  }

  getOrigens() {
    this._WixApiService.getOrigens().then((data) => {
      this.origens = data
      this.carregando = false
    })
  }

  comparaObjetos(c1: any, c2: any) {
    return c1._id === c2._id
  }

  constructor(private _WixApiService:WixApiService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.adicionarCampo()
    this.getOrigens()
    this.selecionadas = this.movsNaoEfetuadas.filter(e => e.enviar == true)
  
  }

  ngAfterViewInit() {
  }

}
