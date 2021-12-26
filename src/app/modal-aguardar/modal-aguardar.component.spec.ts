import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAguardarComponent } from './modal-aguardar.component';

describe('ModalAguardarComponent', () => {
  let component: ModalAguardarComponent;
  let fixture: ComponentFixture<ModalAguardarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAguardarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAguardarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
