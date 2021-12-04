import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirCsvComponent } from './inserir-csv.component';

describe('InserirCsvComponent', () => {
  let component: InserirCsvComponent;
  let fixture: ComponentFixture<InserirCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
