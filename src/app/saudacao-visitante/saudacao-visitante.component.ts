import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-saudacao-visitante',
  templateUrl: './saudacao-visitante.component.html',
  styleUrls: ['./saudacao-visitante.component.css']
})
export class SaudacaoVisitanteComponent implements OnInit {

  @Output() fecharSaudacao = new EventEmitter();

  constructor() { }

  close(){
    this.fecharSaudacao.emit()
  }

  ngOnInit(): void {
  }

}
