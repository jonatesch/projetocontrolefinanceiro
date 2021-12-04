import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalEditarOpcoesComponent } from '../modal-editar-opcoes/modal-editar-opcoes.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WixApiService } from '../servico-teste.service';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  @ViewChild('sb') sidebar:any

  constructor(private elementRef:ElementRef, private modalService:NgbModal, private _wix:WixApiService) {
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

  linkAtivo = [false, false, false, false, false, false]

  

  openModalOpcoes() {
    this.modalService.open(ModalEditarOpcoesComponent, {windowClass:'myCustomModalClass'})
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = "#f7f7f7"
  }

}
