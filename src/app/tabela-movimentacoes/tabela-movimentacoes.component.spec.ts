import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaMovimentacoesComponent } from './tabela-movimentacoes.component';

describe('TabelaMovimentacoesComponent', () => {
  let component: TabelaMovimentacoesComponent;
  let fixture: ComponentFixture<TabelaMovimentacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabelaMovimentacoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabelaMovimentacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
