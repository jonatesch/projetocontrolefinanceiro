import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarOpcoesComponent } from './modal-editar-opcoes.component';

describe('ModalEditarOpcoesComponent', () => {
  let component: ModalEditarOpcoesComponent;
  let fixture: ComponentFixture<ModalEditarOpcoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarOpcoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarOpcoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
