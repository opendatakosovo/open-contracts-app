import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractBySigningDatePublicationDateChartComponent } from './contract-by-signing-date-publication-date-chart.component';

describe('ContractBySigningDatePublicationDateChartComponent', () => {
  let component: ContractBySigningDatePublicationDateChartComponent;
  let fixture: ComponentFixture<ContractBySigningDatePublicationDateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractBySigningDatePublicationDateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractBySigningDatePublicationDateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
