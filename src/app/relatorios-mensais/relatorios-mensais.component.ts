import { Component, OnInit } from '@angular/core';
import { WixApiService } from '../servico-teste.service';

import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-relatorios-mensais',
  templateUrl: './relatorios-mensais.component.html',
  styleUrls: ['./relatorios-mensais.component.css']
})


export class RelatoriosMensaisComponent implements OnInit {

  isCollapsed:boolean[] = []
  isCollapsedCreditos:boolean[] = []
  isCollapsedEstab:boolean[] = []
  isCollapsedEstabCreditos:boolean[] = []

  movimentacoes:any[] =[]
  categorias: any[] = []
  resumoMensalPorCategoria:any
  categoriasDebitos:any[] = []
  categoriasCreditos:any[] = []
  estabelecimentosDebitos:any[] = []
  estabelecimentosCreditos:any[] = []
  meses:any[] = []

  setarResumosMensais() {
    return this._WixApiService.getMovimentacoes().then(movimentacoes => {
        return this._WixApiService.getMesesDeReferencia().then(mesesDeRef => {
        let mesesDeReferencia:any[] = []
        mesesDeReferencia = mesesDeRef.items
        this.movimentacoes = movimentacoes
        let debitos = this.movimentacoes.filter(e => e.natureza == "D")
        let creditos = this.movimentacoes.filter(e => e.natureza == "C")

        let meses = this.removerIguaisEclassificar(this.movimentacoes.map(e => e.mesRef))
        this.meses = meses
        let categoriasDebitos:any[] = this.removerDuplicatas(debitos.map(e => e.categoria))
        let categoriasCreditos:any[] = this.removerDuplicatas(creditos.map(e => e.categoria))
        this.categoriasDebitos = categoriasDebitos
        this.categoriasCreditos = categoriasCreditos

        let estabelecimentosDebitos:any[] = this.removerIguaisEclassificar(debitos.map(e => e.estabelecimentoPrestador))
        this.estabelecimentosDebitos = estabelecimentosDebitos
        let estabelecimentosCreditos:any[] = this.removerIguaisEclassificar(creditos.map(e => e.estabelecimentoPrestador))
        this.estabelecimentosCreditos = estabelecimentosCreditos

        return this.resumoMensalPorCategoria = meses.map(e => {
          return {
            codigo: e,
            rotulo:mesesDeReferencia.filter(mes => mes.codigoMesRef == e).map(e => e.title).toString().substr(0,3) + "/" + e.toString().substr(2,2),
            creditos:creditos.filter(mov => mov.mesRef == e),
            debitos:debitos.filter(mov => mov.mesRef == e),
            subtotalDebitos: debitos.filter(mov => mov.mesRef == e).map(z => z.valor).reduce((sum, current) => sum + current,0),
            subtotalCreditos: creditos.filter(mov => mov.mesRef == e).map(z => z.valor).reduce((sum, current) => sum + current,0),
            resumoPorCategoria_Debitos: categoriasDebitos.map(categ => {
              return {
                categoria: categ,
                subtotal: debitos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title)
                .map(z => z.valor).reduce((sum, current) => sum + current,0),
                movimentacoes:debitos.filter(deb =>deb.mesRef == e && deb.categoria.title == categ.title),
                descricoes:this.removerIguaisEclassificar(debitos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title).map(e => e.descricao)).map(um => {
                  return {
                    descricao: um,
                    subtotal:debitos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title && mov.descricao == um).map(e => e.valor).reduce((sum, current) => sum + current,0)
                  }
                })
              }
            }),
            resumoPorCategoria_Creditos: categoriasCreditos.map( cat => {
              return {
                categoria: cat,
                subtotal: creditos.filter(mov => mov.mesRef == e && mov.categoria.title == cat.title)
                .map(z => z.valor).reduce((sum, current) => sum + current,0),
                movimentacoes: creditos.filter(cred => cred.categoria.title == cat.title),
                descricoes:this.removerIguaisEclassificar(creditos.filter(mov => mov.mesRef == e && mov.categoria.title == cat.title).map(e => e.descricao)).map(um => {
                  return {
                    descricao: um,
                    subtotal:creditos.filter(mov => mov.mesRef == e && mov.categoria.title == cat.title && mov.descricao == um).map(e => e.valor).reduce((sum, current) => sum + current,0)
                  }
                })
              }
            }),
            resumoPorEstabelecimento_Debitos:estabelecimentosDebitos.map( estab => {
              return {
                estabelecimento: estab,
                subtotal: debitos.filter(mov => mov.mesRef == e && mov.estabelecimentoPrestador == estab)
                .map(z => z.valor).reduce((sum, current) => sum + current,0),
                descricoes: this.removerIguaisEclassificar(debitos.filter(mov => mov.mesRef == e && mov.estabelecimentoPrestador == estab).map(e => e.descricao)).map(desc => {
                  return {
                    descricao: desc,
                    subtotal: debitos.filter(mov => mov.mesRef == e && mov.estabelecimentoPrestador == estab && mov.descricao == desc)
                    .map(z => z.valor).reduce((sum, current) => sum + current,0)
                  }
                })
              }
            }),
            resumoPorEstabelecimento_Creditos:estabelecimentosCreditos.map( estab => {
              return {
                estabelecimento: estab,
                subtotal: creditos.filter(mov => mov.mesRef == e && mov.estabelecimentoPrestador == estab)
                .map(z => z.valor).reduce((sum, current) => sum + current,0),
                descricoes: this.removerIguaisEclassificar(creditos.filter(mov => mov.mesRef == e && mov.estabelecimentoPrestador == estab).map(e => e.descricao)).map(desc => {
                  return {
                    descricao: desc,
                    subtotal: creditos.filter(mov => mov.mesRef == e && mov.estabelecimentoPrestador == estab && mov.descricao == desc)
                    .map(z => z.valor).reduce((sum, current) => sum + current,0)
                  }
                })
              }
            })
          }
        })
      }) 
    })
  }

  removerIguaisEclassificar(array:any[]){
    return array.filter((obj, index, self)=>index===self.indexOf(obj)).sort()
  }

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

  constructor(private _WixApiService:WixApiService,config:NgbCarouselConfig) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = [1055, 194, 368].map((n) => `https://picsum.photos/200/300`);
  

  ngOnInit(): void {
    console.log(this.images)
   this.setarResumosMensais().then(retorno => {
     console.log(retorno)
    this.meses.forEach((mes) => {
      this.categoriasDebitos.forEach((item) => {
        this.isCollapsed.push(true)
      }) 
      this.categoriasCreditos.forEach((item) => {
        this.isCollapsedCreditos.push(true)
      })
      this.estabelecimentosDebitos.forEach((item) => {
        this.isCollapsedEstab.push(true)
      })
      this.estabelecimentosCreditos.forEach((item) => {
        this.isCollapsedEstabCreditos.push(true)
      })
    })
    console.log(retorno)
   })
  }



}
