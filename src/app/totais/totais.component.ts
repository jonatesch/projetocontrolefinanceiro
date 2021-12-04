import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'totais',
  templateUrl: './totais.component.html',
  styleUrls: ['./totais.component.css']
})
export class TotaisComponent implements OnInit {

  constructor() { }

  mostrarTotal_Debitos:boolean = false
  mostrarTotal_Creditos:boolean = false

  @Input() totalDebitos:number = 0
  @Input() totalCreditos:number = 0

  toggleMostrarTotal_Debitos() {
    this.mostrarTotal_Debitos = !this.mostrarTotal_Debitos
  }

  toggleMostrarTotal_Creditos() {
    this.mostrarTotal_Creditos = !this.mostrarTotal_Creditos
  }

  ngOnInit(): void {
  }

}
