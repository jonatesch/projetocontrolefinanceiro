import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarExclusaoTodasComponent } from './confirmar-exclusao-todas.component';

describe('ConfirmarExclusaoTodasComponent', () => {
  let component: ConfirmarExclusaoTodasComponent;
  let fixture: ComponentFixture<ConfirmarExclusaoTodasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarExclusaoTodasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarExclusaoTodasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
