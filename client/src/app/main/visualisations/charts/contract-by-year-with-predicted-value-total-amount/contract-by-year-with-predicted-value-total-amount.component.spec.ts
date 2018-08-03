import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractByYearWithPredictedValueTotalAmountComponent } from './contract-by-year-with-predicted-value-total-amount.component';

describe('ContractByYearWithPredictedValueTotalAmountComponent', () => {
  let component: ContractByYearWithPredictedValueTotalAmountComponent;
  let fixture: ComponentFixture<ContractByYearWithPredictedValueTotalAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractByYearWithPredictedValueTotalAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractByYearWithPredictedValueTotalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
