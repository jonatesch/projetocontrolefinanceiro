import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class WixApiService {

  constructor(private http: HttpClient) { }

  //OBSERVABLE PARA A NovaMovimentacaoComponent DAR SUBSCRIBE
          //no subscribe ela busca novamente no database as categorias ou origens, dependendo do que for enviado no 'algo'

    private testandoSource = new Subject<string>();

    teste$ = this.testandoSource.asObservable();

    opcoesAtualizadas(algo: string) {
      this.testandoSource.next(algo)
    }
  //////////////////////


  private loginSource = new Subject<string>();
  logou$ = this.loginSource.asObservable();

  logouUser(dados:any) {
    this.loginSource.next(dados)
  }



////OBSERVABLE PARA a MainPage marcar o sidebar se entrar direto na pagina de movimentações (quando logado)  
 private abriuMovimentacoesSource = new Subject<string>();
 abriuMovs$ = this.abriuMovimentacoesSource.asObservable();

 abriuMovimentacoesComponent(){
   this.abriuMovimentacoesSource.next()
 }
/////////////////////////////////

private entradaDiretaSource = new Subject<number>();
abriuDireto$ = this.entradaDiretaSource.asObservable();

abriuDireto(index:number){
  this.entradaDiretaSource.next(index)
}


  loginWixMembers(dados:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/logarFromExternal'
    let info = JSON.stringify(dados)

    return this.http.post(url,info).toPromise().then(resposta => {
      return resposta
    })
  }


  logarWix() {
    let url = 'https://www.jonathanspinelli.com/_functions/logar'
    let mensagem = "oi"
    return this.http.post(url,JSON.stringify(mensagem)).toPromise().then(resposta => {
      return resposta
    })
  }

  logarWixDois() {
    let url = 'https://www.jonathanspinelli.com/_functions/logarDois'
    let mensagem = "oi"
    return this.http.post(url,JSON.stringify(mensagem)).toPromise().then(resposta => {
      return resposta
    })
  }

  
  registerWixMember(dados:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/registerWixMember'
    return this.http.post(url,JSON.stringify(dados)).toPromise().then(resposta => {
      return resposta
    })
  }

  verifyLoginEmail(email:string) {
    let url = 'https://www.jonathanspinelli.com/_functions/verifyLoginEmail'
    return this.http.post(url, JSON.stringify(email)).toPromise().then(resposta => {
      return resposta
    })

  }


  removerIguaisEclassificar(array:any[]) {
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

  sortByTitle(array:any) {
    return array.sort((a:any,b:any) => (a.title > b.title) ? 1 : -1)
  }

  sortByNaFrente(array:any[]) {
    return array.sort(function(a,b) {
      if(a.naFrente === b.naFrente) {
        if(a.title > b.title) {
          return 1
        } else {
          return -1
        }
      } else {
        if(a.naFrente < b.naFrente){
          return 1
        } else {
          return -1
        }
      }
    })
  }


  sortMesByNaFrente(array:any[]) {
    return array.sort(function(a,b) {
      if(a.naFrente === b.naFrente) {
        if(a.mesRef > b.mesRef) {
          return 1
        } else {
          return -1
        }
      } else {
        if(a.naFrente < b.naFrente){
          return 1
        } else {
          return -1
        }
      }
    })
  }

  sortByMesRef(array:any[]) {
    return array.sort((a:any,b:any) => (a.codigoMesRef > b.codigoMesRef) ? 1 : -1)
  }
  
  getCategorias() {
    let url = 'https://www.jonathanspinelli.com/_functions/categorias'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  getCategoriasFromUser(dados:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/categoriasFromUser'
    let info = JSON.stringify(dados)
    return this.http.post(url, info).toPromise().then((data:any) => {
      return data
    })
  }

  getOrigensFromUser(dados:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/origensFromUser'
    let info = JSON.stringify(dados)
    return this.http.post(url, info).toPromise().then((data:any) => {
      return data
    })
  }

  getOrigens() {
    let url = 'https://www.jonathanspinelli.com/_functions/origens'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  getOrcamentos() {
    let url = 'https://www.jonathanspinelli.com/_functions/orcamentos'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  getMesesDeReferencia() {
    let url = 'https://www.jonathanspinelli.com/_functions/mesesDeReferencia'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  getStatus() {
    let url = 'https://www.jonathanspinelli.com/_functions/status'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  getMovimentacoes() { 
    let url = 'https://www.jonathanspinelli.com/_functions/vejabem'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  getMovimentacoesFromUser(dados:any) { 
    let url = 'https://www.jonathanspinelli.com/_functions/movimentacoesFromUser'
    let user = JSON.stringify(dados)
    return this.http.post(url,user).toPromise().then((data:any) => {
      //console.log(data)
      return data
    })
  }

  novaMovimentacao(novaMovimentacao:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/novaMovimentacao'
    let dados = JSON.stringify(novaMovimentacao)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  novasMovimentacoes(arrayDeMovs:any){
    let url = 'https://www.jonathanspinelli.com/_functions/novasMovimentacoes'
    let dados = JSON.stringify(arrayDeMovs)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  adicionarCategoria(novaCategoria:object){
    let url = 'https://www.jonathanspinelli.com/_functions/adicionarCategoria'
    let dados = JSON.stringify(novaCategoria)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  adicionarCategoriaToUser(novaCategoria:any){
    let url = 'https://www.jonathanspinelli.com/_functions/adicionarCategoriaToUser'
    let dados = JSON.stringify(novaCategoria)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      if(data.criouNovaCategoria) {
        let url = 'https://www.jonathanspinelli.com/_functions/adicionarUserToCategoria'
        let dados = {"userId":novaCategoria.proprietario, "categoriaInserida": data.categoriaInserida._id}
        let enviar = JSON.stringify(dados)
        return this.http.post(url,enviar).toPromise().then((dataFinal:any) => {
          return {resultado:data, resposta:dataFinal.resposta}
        })
      } else {
        return data
      }
    })
  }

  excluirCategoria(categoria:object){
    let url = 'https://www.jonathanspinelli.com/_functions/excluirCategoria'
    let url2 = 'https://www.jonathanspinelli.com/_functions/excluirCategoriaFromUser'
    let dados = JSON.stringify(categoria)
    return this.http.post(url2,dados).toPromise().then((data:any) => {
      return data
    })
  }

  excluirOrigem(origem:object) {
    let url = 'https://www.jonathanspinelli.com/_functions/excluirOrigem'
    let url2 = 'https://www.jonathanspinelli.com/_functions/excluirOrigemFromUser'
    let dados = JSON.stringify(origem)
    return this.http.post(url2,dados).toPromise().then((data:any) => {
      return data
    })
  }

  adicionarOrigem(novaOrigem:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/adicionarOrigem'
    let url2 = 'https://www.jonathanspinelli.com/_functions/adicionarOrigemToUser'
    let dados = JSON.stringify(novaOrigem)
    return this.http.post(url2,dados).toPromise().then((data:any) => {
      if(data.criouNovaOrigem) {
        let url = 'https://www.jonathanspinelli.com/_functions/adicionarUserToOrigem'
        let dados = {"userId":novaOrigem.proprietario, "origemInserida":data.origemInserida._id}
        let enviar = JSON.stringify(dados)
        //console.log(dados)
        return this.http.post(url,enviar).toPromise().then((dataFinal:any) => {
          return {resultado:data, resultadoFinal:dataFinal.resposta}
        })
      } else {
        return data
      }
    })
  }

  marcarComoEfetuadas(movimentacoes:any[]){
    let url = 'https://www.jonathanspinelli.com/_functions/editarEfetuadas'
    let dados = JSON.stringify(movimentacoes)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  getMovimentacaoPraEditar(id:string) {
    let url = 'https://www.jonathanspinelli.com/_functions/movimentPraEditar'
    let dados = JSON.stringify(id)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  atualizarMovimentacao(movimentacao:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/atualizarMovimentacao'
    let dados = JSON.stringify(movimentacao)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  atualizarMovimentacoes(array:any[]) {
    let url = 'https://www.jonathanspinelli.com/_functions/atualizarMovimentacoes'
    let dados = JSON.stringify(array)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  atualizarEfetuadas(movimentacoes:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/atualizarEfetuadas'
    let dados = JSON.stringify(movimentacoes)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  setarResumosMensais(userId:any) {
    return this.getMovimentacoesFromUser(userId).then(movimentacoesRegistradas => {
      return this.getMesesDeReferencia().then(mesesDeRef => {
        let mesesDeReferencia:any[] = mesesDeRef.items
        let movimentacoes:any[] = movimentacoesRegistradas
        let debitos = movimentacoes.filter(mov => mov.natureza == "D")
        let creditos = movimentacoes.filter(mov => mov.natureza == "C")
        let categoriasDebitos:any[] = this.removerDuplicatas(debitos.map(mov => mov.categoria)).sort((a:any, b:any) => a.title > b.title ? 1 : -1)
        let categoriasCreditos:any[] = this.removerDuplicatas(creditos.map(mov => mov.categoria)).sort((a:any, b:any) => a.title > b.title ? 1 : -1)
        let estabelecimentosDebitos:any[] = this.removerIguaisEclassificar(debitos.map(mov => mov.estabelecimentoPrestador))
        let estabelecimentosCreditos:any[] = this.removerIguaisEclassificar(creditos.map(mov => mov.estabelecimentoPrestador))

        let resumosMensais:any[] = this.removerIguaisEclassificar(movimentacoes.map(e => e.mesRef))
        .map(e => {
          return {
            code: e,
            label: mesesDeReferencia.filter(mes => mes.codigoMesRef == e).map(e => e.title).toString().substr(0,3) + "/" + e.toString().substr(2,2),
            subtotalDebitos: debitos.filter(mov => mov.mesRef == e).map(z => z.valor).reduce((sum, current) => sum + current,0),
            subtotalCreditos: creditos.filter(mov => mov.mesRef == e).map(z => z.valor).reduce((sum, current) => sum + current,0),
            resumoPorCategoria_Debitos: categoriasDebitos.map(categ => {
              return {
                categoria: categ,
                subtotal: debitos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title)
                .map(z => z.valor).reduce((sum, current) => sum + current,0),
                descricoes:this.removerIguaisEclassificar(debitos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title).map(e => e.descricao)).map(um => {
                  return {
                    descricao: um,
                    subtotal:debitos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title && mov.descricao == um).map(e => e.valor).reduce((sum, current) => sum + current,0)
                  }
                })
              }
            }),
            resumoPorCategoria_Creditos: categoriasCreditos.map(categ => {
              return {
                categoria: categ,
                subtotal: creditos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title)
                .map(z => z.valor).reduce((sum, current) => sum + current,0),
                descricoes:this.removerIguaisEclassificar(creditos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title).map(e => e.descricao)).map(um => {
                  return {
                    descricao: um,
                    subtotal:creditos.filter(mov => mov.mesRef == e && mov.categoria.title == categ.title && mov.descricao == um).map(e => e.valor).reduce((sum, current) => sum + current,0)
                  }
                })
              }
            }),
            resumoPorEstabelecimento_Debitos: estabelecimentosDebitos.map(estab => {
              return {
                estabelecimento:estab,
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
            resumoPorEstabelecimento_Creditos: estabelecimentosCreditos.map(estab => {
              return {
                estabelecimento:estab,
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

        return resumosMensais

      })
    })
  }

  excluirMovimentacao(id:string) {
    let url = 'https://www.jonathanspinelli.com/_functions/excluirMovimentacao'
    return this.http.post(url, id).toPromise().then((data:any) => {
      return data
    })
  }

  excluirTodas(ids:string[]){
    let url = 'https://www.jonathanspinelli.com/_functions/excluirVarias'
    let dados = JSON.stringify(ids)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }

  adicionarCsvNubank(nubankCsvArray:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/adicionarCsvNubank'
    let dados = JSON.stringify(nubankCsvArray)
    return this.http.post(url,dados).toPromise().then((data:any) => {
      return data
    })
  }


  getIcones() {
    let url = 'https://www.jonathanspinelli.com/_functions/icones'
    return this.http.get(url).toPromise().then((data:any) => {
      return data
    })
  }

  
}
