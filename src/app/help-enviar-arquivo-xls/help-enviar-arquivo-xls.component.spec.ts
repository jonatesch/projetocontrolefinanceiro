import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEnviarArquivoXlsComponent } from './help-enviar-arquivo-xls.component';

describe('HelpEnviarArquivoXlsComponent', () => {
  let component: HelpEnviarArquivoXlsComponent;
  let fixture: ComponentFixture<HelpEnviarArquivoXlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEnviarArquivoXlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEnviarArquivoXlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
