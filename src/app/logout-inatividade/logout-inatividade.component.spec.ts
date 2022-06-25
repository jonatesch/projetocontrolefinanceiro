import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutInatividadeComponent } from './logout-inatividade.component';

describe('LogoutInatividadeComponent', () => {
  let component: LogoutInatividadeComponent;
  let fixture: ComponentFixture<LogoutInatividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutInatividadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutInatividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
