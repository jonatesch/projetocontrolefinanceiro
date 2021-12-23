import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { TabelaComponent } from './tabela/tabela.component';

import { CurrencyMaskModule } from "ng2-currency-mask";

import { ClipboardModule} from 'ngx-clipboard'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { ModalEditarOpcoesComponent } from './modal-editar-opcoes/modal-editar-opcoes.component';
import { EditarMovimentacaoComponent } from './editar-movimentacao/editar-movimentacao.component';

import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MarcarEfetuadasComponent } from './marcar-efetuadas/marcar-efetuadas.component';
import { AppRoutingModule } from './app-routing.module';
import { RelatoriosMensaisComponent } from './relatorios-mensais/relatorios-mensais.component';
import { RelatorioMensalComponent } from './relatorio-mensal/relatorio-mensal.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ToastrModule} from 'ngx-toastr';
import { InserirCsvComponent } from './inserir-csv/inserir-csv.component';
import { ConfirmarExclusaoTodasComponent } from './confirmar-exclusao-todas/confirmar-exclusao-todas.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TabelaMovimentacoesComponent } from './tabela-movimentacoes/tabela-movimentacoes.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { TotaisComponent } from './totais/totais.component';
import { NovaMovimentacaoComponent } from './nova-movimentacao/nova-movimentacao.component';
import { ConfirmarExclusaoComponent } from './confirmar-exclusao/confirmar-exclusao.component';
import { EditarComponent } from './editar/editar.component';
import { TestesComponent } from './testes/testes.component';
import { EditarOpcoesComponent } from './editar-opcoes/editar-opcoes.component'

registerLocaleData(localePt);



@NgModule({
  declarations: [
    AppComponent,
    TabelaComponent,
    RelatoriosComponent,
    ModalEditarOpcoesComponent,
    EditarMovimentacaoComponent,
    MarcarEfetuadasComponent,
    RelatoriosMensaisComponent,
    RelatorioMensalComponent,
    InserirCsvComponent,
    ConfirmarExclusaoTodasComponent,
    MainPageComponent,
    TabelaMovimentacoesComponent,
    FiltrosComponent,
    TotaisComponent,
    NovaMovimentacaoComponent,
    ConfirmarExclusaoComponent,
    EditarComponent,
    TestesComponent,
    EditarOpcoesComponent
 
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbCollapseModule,
    NgbCarouselModule,
    HttpClientModule,
    CurrencyMaskModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ClipboardModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'pt-BR'}],
  bootstrap: [AppComponent],
  entryComponents:[
    ModalEditarOpcoesComponent, 
    ConfirmarExclusaoComponent, 
    ConfirmarExclusaoTodasComponent, 
    EditarComponent, 
    MarcarEfetuadasComponent]
})
export class AppModule { }
