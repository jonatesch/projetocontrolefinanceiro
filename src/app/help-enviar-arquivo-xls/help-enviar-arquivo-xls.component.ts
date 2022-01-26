import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-help-enviar-arquivo-xls',
  templateUrl: './help-enviar-arquivo-xls.component.html',
  styleUrls: ['./help-enviar-arquivo-xls.component.css']
})
export class HelpEnviarArquivoXlsComponent implements OnInit {

  constructor(private clipboardService:ClipboardService) { }

  expandirInfo1:boolean = true
  expandirInfo2:boolean = true
  expandirInfo3:boolean = true

  excelFormula1 = '=IF(A2;YEAR(A2)&TEXT(A2;"MM");"")'
  excelFormula2 = '=SE(A2;ANO(A2)&TEXTO(A2;"MM");"")'

  copiar(texto:string){
    this.clipboardService.copy(texto)
  }

  baixarTemplate(){
    let link = document.createElement('a');
    link.setAttribute('target','_self')
    link.setAttribute('href','/assets/template.xlsx')
    link.setAttribute('download', 'template.xlsx')
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  ngOnInit(): void {
  }

}
