import { Component } from '@angular/core';
import { WixApiService } from '../servico-teste.service';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})


export class RelatoriosComponent {

  resumosMensais:any[] = []
  anos:string[] = []
  ativos:boolean[] = []
  anoSelecionado:string = ''
  mesesFiltrados:any[] = []

  constructor(private _wix: WixApiService) { }
   
  getResumosMensais() {
    this._wix.setarResumosMensais('').then(data => {
      this.resumosMensais = data

      this.resumosMensais.forEach(mes => {
        mes.rotulo = mes.code.toString().substring(4,6) + '/' + mes.code.toString().substring(0,4)
        mes.ativo = false
      })

      this.anos = this._wix.removerIguaisEclassificar(this.resumosMensais.map(e => e.code.toString().substring(0,4))) 
      this.anoSelecionado = this.anos[this.anos.length-1]

      this.mesesFiltrados = this.resumosMensais.filter(e => e.code.toString().substring(0,4) == this.anoSelecionado)
    })
  }

  toggleActive(index:number) {
    let ativos_qtde = this.resumosMensais.filter(e => e.ativo == true).length
    
   if(ativos_qtde < 2) {
     this.resumosMensais[index].ativo = !this.resumosMensais[index].ativo
   }

   if(ativos_qtde == 2) {
     if(this.resumosMensais[index].ativo) {
       this.resumosMensais[index].ativo = false
     }
   }

   console.log(this.resumosMensais.filter(e => e.ativo == true).map(e => e.code).sort())
    
  }

  setarAnoSelecionado(ano:string) {
    this.anoSelecionado = ano
    this.mesesFiltrados = this.resumosMensais.filter(e => e.code.toString().substring(0,4) == this.anoSelecionado)
  }

  ngOnInit() {
    this.getResumosMensais()
  }

}
