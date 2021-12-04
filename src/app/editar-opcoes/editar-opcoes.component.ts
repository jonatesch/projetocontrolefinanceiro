import { Component, OnInit } from '@angular/core';
import { WixApiService } from '../servico-teste.service';

@Component({
  selector: 'app-editar-opcoes',
  templateUrl: './editar-opcoes.component.html',
  styleUrls: ['./editar-opcoes.component.css']
})
export class EditarOpcoesComponent implements OnInit {

  constructor(private _wix:WixApiService) { }

  categorias:any[] = []

  getCategorias() {
    this._wix.getCategorias().then(data => {
      this.categorias = data
    })
  }

  ngOnInit(): void {
    this.getCategorias()
  }

}
