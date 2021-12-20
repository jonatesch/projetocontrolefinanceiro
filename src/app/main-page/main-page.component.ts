import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalEditarOpcoesComponent } from '../modal-editar-opcoes/modal-editar-opcoes.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WixApiService } from '../servico-teste.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../local-storage.service';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  @ViewChild('sb') sidebar:any

  constructor(private elementRef:ElementRef, private modalService:NgbModal, private _wix:WixApiService, private router:Router, private http:HttpClient, private _localStorage:LocalStorageService) {
    _wix.teste$.subscribe(algo => {
      if(algo == 'movimentacoesComponent') {
        this.ativar(1)
      }
    })
   }

  ativar(indice:number) {
    this.linkAtivo[indice] = true
    for (var i = 0; i < 6; i++) {
      if(i !== indice) {
        this.linkAtivo[i] = false
      }
    }
  }

  userForLogin = {email:'', senha:''}

  linkAtivo = [false, false, false, false, false, false]

  loginEsconder:boolean = true
  userIsLogged:boolean = false
  usuario:string = ''

  openModalOpcoes() {
    this.modalService.open(ModalEditarOpcoesComponent, {windowClass:'myCustomModalClass'})
  }

  logarWixMembers() {
    if(this.userForLogin.senha !== '' && this.userForLogin.email !== '') {
      
      this._wix.loginWixMembers(this.userForLogin).then((res:any) => {
        //console.log(res)
        if(res.details) {

        } else {
          this.router.navigate(['/paginaprincipal/movimentacoes'])
          setTimeout(() => {
          this._wix.logouUser({user: res.user, movs: res.movs})
          })
          //console.log(res.user.contactId)
          this._localStorage.set('userLoggedId',res.user.contactId)

          this.userIsLogged = true

          this.userForLogin.email = ''
          this.userForLogin.senha = ''
          this.usuario = res.user.firstName

        }
        
      })
    }
    
  }

  getUserName(id:any) {
    let url = 'https://www.jonathanspinelli.com/_functions/username'
    let info = JSON.stringify(id)
    this.http.post(url,info).toPromise().then((resposta:any) => {
      this.usuario = resposta.firstName
    })
  }

  

  deslogarWixMembers() {
    this._localStorage.clear('userLoggedId')
    this.router.navigate(['/paginaprincipal'])
    this.userIsLogged = false
    this.loginEsconder = true
  }

  logarWix() {
    this._wix.logarWix().then((res:any) => {
      //console.log(res)
      /* this.router.navigate(['/paginaprincipal/testes']) */
      setTimeout(() => {
        this._wix.logouUser({user: res.user, movs: res.movs})
      })
      
    })
  }

  logarWixDois() {
    this._wix.logarWixDois().then((res:any) => {
      /* console.log(res) */
      this.router.navigate(['/paginaprincipal/testes'])
      setTimeout(() => {
        this._wix.logouUser({user: res.user, movs: res.movs, details:res.details})
      })
      
    })
  }

  ngOnInit(): void {
    if(this._localStorage.get('userLoggedId') !== null){
      this.userIsLogged = true
      this.getUserName(this._localStorage.get('userLoggedId'))
      
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = "#f7f7f7"
  }

}
