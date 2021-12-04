import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriosMensaisComponent } from './relatorios-mensais.component';

describe('RelatoriosMensaisComponent', () => {
  let component: RelatoriosMensaisComponent;
  let fixture: ComponentFixture<RelatoriosMensaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatoriosMensaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatoriosMensaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
