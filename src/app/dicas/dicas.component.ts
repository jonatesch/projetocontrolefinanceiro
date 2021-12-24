import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dicas',
  templateUrl: './dicas.component.html',
  styleUrls: ['./dicas.component.css']
})
export class DicasComponent implements OnInit {


  @Output() fecharDicas:EventEmitter<any> = new EventEmitter();

  campo:string = ''

  constructor() { }

  closeModal() {
    this.fecharDicas.emit('')
  }

  redirect_modalEditarOpcoes() {
    this.fecharDicas.emit('redirect')

  }

  ngOnInit(): void {
  }

}
