import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsCountByProcurementTypeAndYearComponent } from './contracts-count-by-procurement-type-and-year.component';

describe('ContractsCountByProcurementTypeAndYearComponent', () => {
  let component: ContractsCountByProcurementTypeAndYearComponent;
  let fixture: ComponentFixture<ContractsCountByProcurementTypeAndYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsCountByProcurementTypeAndYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsCountByProcurementTypeAndYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
