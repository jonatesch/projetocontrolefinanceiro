import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioMensalComponent } from './relatorio-mensal.component';

describe('RelatorioMensalComponent', () => {
  let component: RelatorioMensalComponent;
  let fixture: ComponentFixture<RelatorioMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioMensalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
