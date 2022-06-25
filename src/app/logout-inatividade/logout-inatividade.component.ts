import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-logout-inatividade',
  templateUrl: './logout-inatividade.component.html',
  styleUrls: ['./logout-inatividade.component.css']
})
export class LogoutInatividadeComponent implements OnInit {

  @Output() closeInatividade = new EventEmitter();

  constructor() { }

  close(){
    this.closeInatividade.emit()
  }

  ngOnInit(): void {
  }

}
