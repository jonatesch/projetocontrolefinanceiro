import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOpcoesComponent } from './editar-opcoes.component';

describe('EditarOpcoesComponent', () => {
  let component: EditarOpcoesComponent;
  let fixture: ComponentFixture<EditarOpcoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarOpcoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarOpcoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
