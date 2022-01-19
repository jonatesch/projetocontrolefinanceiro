import { Component, OnInit } from '@angular/core';

import { WixApiService } from '../servico-teste.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enviar-arquivos',
  templateUrl: './enviar-arquivos.component.html',
  styleUrls: ['./enviar-arquivos.component.css']
})
export class EnviarArquivosComponent implements OnInit {

  constructor(private _wix:WixApiService, private router:Router, private localStorage:LocalStorageService) { }

  ngOnInit(): void {

    if(this.localStorage.get('userLoggedId') !== null){
      this._wix.abriuDireto(3)
    } else {
      this.router.navigate(['/paginaprincipal'])
    }
    
  }

}
