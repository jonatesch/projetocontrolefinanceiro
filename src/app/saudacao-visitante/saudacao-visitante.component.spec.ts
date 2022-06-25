import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaudacaoVisitanteComponent } from './saudacao-visitante.component';

describe('SaudacaoVisitanteComponent', () => {
  let component: SaudacaoVisitanteComponent;
  let fixture: ComponentFixture<SaudacaoVisitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaudacaoVisitanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaudacaoVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
