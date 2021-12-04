import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WixApiService } from '../servico-teste.service';

@Component({
  selector: 'app-confirmar-exclusao-todas',
  templateUrl: './confirmar-exclusao-todas.component.html',
  styleUrls: ['./confirmar-exclusao-todas.component.css']
})
export class ConfirmarExclusaoTodasComponent implements OnInit {

  @Output() fecharModal:EventEmitter<any> = new EventEmitter;
  @Output() exclusoesRealizadas:EventEmitter<any> = new EventEmitter;

  ids:string[] = []
  taCarregandoExclusao:boolean = false

  movimentacoes:any[] = []

  fechar(){
    this.fecharModal.emit()
  }

  exclusaoConfirmada() {
    this.taCarregandoExclusao = true
    this._WixApiService.excluirTodas(this.ids).then(data => {
      this.exclusoesRealizadas.emit()
      setTimeout(() => {
        this.taCarregandoExclusao = false
      },1500)
    })
   
  }

  constructor(private _WixApiService:WixApiService) { }

  ngOnInit(): void {
    this.ids = this.movimentacoes.map(e => e._id)
    console.log(this.ids)
  }

}
