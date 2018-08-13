import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsCountByProcurementValueAndYearComponent } from './contracts-count-by-procurement-value-and-year.component';

describe('ContractsCountByProcurementValueAndYearComponent', () => {
  let component: ContractsCountByProcurementValueAndYearComponent;
  let fixture: ComponentFixture<ContractsCountByProcurementValueAndYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsCountByProcurementValueAndYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsCountByProcurementValueAndYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
