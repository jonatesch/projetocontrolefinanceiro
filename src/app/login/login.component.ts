import { Component, OnInit, HostListener } from '@angular/core';
import { WixApiService } from '../servico-teste.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { RecuperarSenhaComponent } from '../recuperar-senha/recuperar-senha.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Lógica para esconder as info quando clicado "fora": em verdade ta fazendo isso toda vez que se clica e solta o botão do mouse
  @HostListener('window:mouseup', ['$event'])
  hideInfoMethod(ev:any){
    this.hideInfo = true
  }


  userForLogin = {email:'', senha:''}
  userForRegistration = {email:'', senha:'', name:'', firstName:'', lastName:''}


  logando:boolean = false
  registrando:boolean = false

  hideInfo:boolean = true
  
  logarWixMembers() {
    if(this.userForLogin.senha !== '' && this.userForLogin.email !== '') {
      this.logando = true
      
      this._wix.loginWixMembers(this.userForLogin).then((res:any) => {
        //console.log(res)
        if(res.details) {
          this.logando = false
          this.toastr.error("","usuário e/ou senha incorretos", {positionClass:'toast-top-center'})
        } else {
          this._wix.visitorFirstLogin = true
          this.router.navigate(['/paginaprincipal/movimentacoes'])
          //this.linkAtivo[1] = true
          this.logando = false
          setTimeout(() => {
          this._wix.logouUser({user: res.user, movs: res.movs})
          })
          //console.log(res.user.contactId)
          this._localStorage.set('userLoggedId',res.user.contactId)

          this.userForLogin.email = ''
          this.userForLogin.senha = ''
         

        }
        
      })
    }
    
  }

  disableRegisterButton:boolean = true

  validation(campo:string) {
    if(this.userForRegistration.senha.length > 3 && this.userForRegistration.name !== '' && this.userForRegistration.email !== '' && this.userForRegistration.senha.match(/^\w+$/) !== null){
      this.disableRegisterButton = false
    } else {
      this.disableRegisterButton = true
    }
    if(campo == 'senha') {
      if(this.userForRegistration.senha.match(/^\w+$/) == null){
      this.hideInfo = false
      this.shakeInfo = true
    }
    }
    
  }

  shakeInfo:boolean = false

  redirectingAfterRegistration:boolean = false

  registerWixMember() {
    if(this.userForRegistration.senha !== '' && this.userForRegistration.email !== '' && this.userForRegistration.name !== '') {
      this._wix.verifyLoginEmail(this.userForRegistration.email).then((resposta:any) => {
        if(resposta.erro){
          //console.log(resposta)
          this.registrando = false
          this.toastr.error("tente novamente","ocorreu algum erro no servidor", {positionClass:'toast-top-center'})

        } else {
          if(resposta.resultadoDaQuery.items.length == 0){
                   /*  console.log('registrar user')
                    this.registrando = false */

                    this._wix.registerWixMember(this.userForRegistration).then((data:any) => {
                      console.log(data)
                      if(!data.errorDetails) {
                        this.redirectingAfterRegistration = true
                        this.registrando = false
                        this.userForLogin.email = this.userForRegistration.email
                        this.userForLogin.senha = this.userForRegistration.senha
                        this.logarWixMembers()
                      }

                      if(data.errorDetails) {
                        this.registrando = false
                        this.toastr.error("","ocorreu um erro", {positionClass:'toast-top-center'})
                        this.shakeInfo = true
                        this.hideInfo = false
                        setTimeout(() => {
                          this.shakeInfo = false
                        },1000)
                      }

                    })

                  } else {
                    this.registrando = false
                    this.toastr.error("","já existe um usuário com este email", {positionClass:'toast-top-center'})
                  }
        }
      
        
      })
      this.registrando = true
      let firstName = this.userForRegistration.name.split(' ')[0]
      this.userForRegistration.firstName = firstName
      if(this.userForRegistration.name.split(' ').length > 1){
        this.userForRegistration.lastName = this.userForRegistration.name.split(' ')[this.userForRegistration.name.split(' ').length - 1]
      }
     
     
    }
    
  }

  modalRef:NgbModalRef | undefined

  openRecuperarSenha() {
    this.modalRef = this.modalService.open(RecuperarSenhaComponent,{centered:true})
  }

  logandoVisitante = false

  logarVisitante(){
    this.logandoVisitante = true
    
    let dateMark = new Date().getTime()
    let tempUserEmail = "visitante@" + this._wix.makeId(8) + dateMark + ".com"
    let tempUserPassword = 'visitantecf2022'

    this.userForRegistration.email = tempUserEmail
    this.userForRegistration.senha = tempUserPassword
    this.userForRegistration.name = 'Visitante'

    this.registerWixMember()




   /*  this.logandoVisitante = true
    this.userForLogin.email = 'visitante@controlefinanceiro.com.br'
    this.userForLogin.senha = 'visitantecf2022'
    this.logarWixMembers() */



  }



  constructor(private _wix:WixApiService, private toastr:ToastrService, private router:Router, private route:ActivatedRoute, private _localStorage:LocalStorageService, private modalService:NgbModal) { 
   
  }

  ngOnInit(): void {
    if(this._localStorage.get('userLoggedId')) {
      this.router.navigate(['/paginaprincipal/movimentacoes'])
    }
  }

}
