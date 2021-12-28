import { Component, OnInit, ViewChildren } from '@angular/core';

import { WixApiService } from '../servico-teste.service';

import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-relatorio-mensal',
  templateUrl: './relatorio-mensal.component.html',
  styleUrls: ['./relatorio-mensal.component.css']
})
export class RelatorioMensalComponent implements OnInit {

  @ViewChildren('meses') botoesMeses:any

  movimentacoes:any[] = []
  resumosMensais:any[] = []
  mesesSelecionados:any[] = []

  isCollapsedDebitos:boolean[] = []
  isCollapsedCreditos:boolean[] = []
  isCollapsedDebitosPorEstab:boolean[] =[]
  isCollapsedCreditosPorEstab:boolean[] =[]
  categoriasCreditos:any[] =[]
  categoriasDebitos:any[] = []
  estabelecimentosDebitos:any[] = []
  estabelecimentosCreditos:any[] = []
  mesesComRegistro:any[] = []

  carregandoMeses:boolean = true

  constructor(private _WixApiService:WixApiService, private _localStorage:LocalStorageService) { }

  removerDuplicatas(arr:any[]) {
    return arr.reduce((p, c) => {
      var id = [c.title, c._id].join('|')
      if(p.temp.indexOf(id) === -1) {
        p.out.push(c);
        p.temp.push(id);
      }
      return p
    }, {
      temp: [],
      out: []
    }).out;
  }

  removerIguaisEclassificar(array:any[]){
    return array.filter((obj, index, self)=>index===self.indexOf(obj)).sort()
  }

  setarSelecionados(index:number) {  

    if(this.mesesSelecionados.indexOf(this.resumosMensais[index].code) !== -1) {
      if(this.botoesMeses._results[index].nativeElement.classList.value.includes("active")){
        this.botoesMeses._results[index].nativeElement.classList.remove("active")
       this.mesesSelecionados.splice(this.mesesSelecionados.indexOf(this.resumosMensais[index].code),1)
      }
    } else {
      if(this.mesesSelecionados.length < 2){
        this.mesesSelecionados.push(this.resumosMensais[index].code)
        this.botoesMeses._results[index].nativeElement.classList.toggle("active")
      } else {
      }
    }

    this.mesesSelecionados.sort()

    console.log(this.mesesSelecionados)
   
  }

  getMovimentacoes() {
    this._WixApiService.getMovimentacoesFromUser(this._localStorage.get('userLoggedId')).then(movimentacoes => {
      this.movimentacoes = movimentacoes
     this.categoriasDebitos = this.removerDuplicatas(this.movimentacoes.filter(mov => mov.natureza == "D").map(e => e.categoria))
     this.categoriasCreditos = this.removerDuplicatas(this.movimentacoes.filter(mov => mov.natureza == "C").map(e => e.categoria))
     this.mesesComRegistro = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.mesRef))
     this.estabelecimentosDebitos = this.removerIguaisEclassificar(this.movimentacoes.filter(mov => mov.natureza =="D").map(e => e.estabelecimentoPrestador))
     this.estabelecimentosCreditos = this.removerIguaisEclassificar(this.movimentacoes.filter(mov => mov.natureza =="C").map(e => e.estabelecimentoPrestador))
     this.mesesComRegistro.forEach((item) => {
        this.categoriasDebitos.forEach((item) => {
         this.isCollapsedDebitos.push(true)
         })
        this.categoriasCreditos.forEach((item) => {
         this.isCollapsedCreditos.push(true)
        })
        this.estabelecimentosDebitos.forEach((item) => {
          this.isCollapsedDebitosPorEstab.push(true)
        })
        this.estabelecimentosCreditos.forEach((item) => {
          this.isCollapsedCreditosPorEstab.push(true)
        })
     })
    })
  }

  getResumosMensais() {
    this._WixApiService.setarResumosMensais(this._localStorage.get('userLoggedId')).then(retorno => {
      this.resumosMensais = retorno
      console.log(retorno)
      this.carregandoMeses = false
    })
  }

  ngOnInit(): void {
    this.carregandoMeses = true
    this.getMovimentacoes()
    this.getResumosMensais()

  }

}
