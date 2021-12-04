import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmar-exclusao',
  templateUrl: './confirmar-exclusao.component.html',
  styleUrls: ['./confirmar-exclusao.component.css']
})
export class ConfirmarExclusaoComponent implements OnInit {

  movExcluir = {'date':'', 'estabelecimentoPrestador': '', 'valor':''}
  carregandoExclusao:boolean = false

  @Output() fecharModal:EventEmitter<any> = new EventEmitter;
  @Output() exclusaoConfirmada:EventEmitter<any> = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
  }

  fechar() {
    this.fecharModal.emit()
  }

  confirmarExclusao() {
    this.exclusaoConfirmada.emit()
    this.carregandoExclusao = true
  }

}
