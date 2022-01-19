import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarArquivosComponent } from './enviar-arquivos.component';

describe('EnviarArquivosComponent', () => {
  let component: EnviarArquivosComponent;
  let fixture: ComponentFixture<EnviarArquivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarArquivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
