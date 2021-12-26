import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabelaComponent } from './tabela/tabela.component';
import { RelatoriosMensaisComponent } from './relatorios-mensais/relatorios-mensais.component';
import { RelatorioMensalComponent } from './relatorio-mensal/relatorio-mensal.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TabelaMovimentacoesComponent } from './tabela-movimentacoes/tabela-movimentacoes.component';
import { InserirCsvComponent } from './inserir-csv/inserir-csv.component';
import { NovaMovimentacaoComponent } from './nova-movimentacao/nova-movimentacao.component';
import { TestesComponent } from './testes/testes.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'tabela', component: TabelaComponent },
  { path: 'relatoriosmensais', component: RelatoriosMensaisComponent},
  { path: 'relatoriomensal', component: RelatorioMensalComponent},
  { path: 'paginaprincipal', component: MainPageComponent, children:[
    {path: 'tabela', component:TabelaComponent},
    {path: 'relatoriomensalantigo', component: RelatorioMensalComponent},
    {path: 'movimentacoes', component:TabelaMovimentacoesComponent},
    {path: 'enviarcsv', component: InserirCsvComponent},
    {path: 'novamovimentacao', component: NovaMovimentacaoComponent},
    {path: 'testes', component:TestesComponent},
    {path: 'relatoriomensal', component:RelatoriosComponent},
    {path: 'login', component:LoginComponent}
  ]},
  { path: 'tabelanova', component: TabelaMovimentacoesComponent},
  {path: '', component:MainPageComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
