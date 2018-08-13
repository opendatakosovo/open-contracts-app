import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsCountByProcurementProcedureAndYearComponent } from './contracts-count-by-procurement-procedure-and-year.component';

describe('ContractsCountByProcurementProcedureAndYearComponent', () => {
  let component: ContractsCountByProcurementProcedureAndYearComponent;
  let fixture: ComponentFixture<ContractsCountByProcurementProcedureAndYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsCountByProcurementProcedureAndYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsCountByProcurementProcedureAndYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
