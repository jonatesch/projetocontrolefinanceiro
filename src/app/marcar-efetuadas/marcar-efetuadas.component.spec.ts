import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcarEfetuadasComponent } from './marcar-efetuadas.component';

describe('MarcarEfetuadasComponent', () => {
  let component: MarcarEfetuadasComponent;
  let fixture: ComponentFixture<MarcarEfetuadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcarEfetuadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcarEfetuadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
