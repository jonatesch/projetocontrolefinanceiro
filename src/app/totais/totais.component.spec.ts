import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotaisComponent } from './totais.component';

describe('TotaisComponent', () => {
  let component: TotaisComponent;
  let fixture: ComponentFixture<TotaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
