import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsCountByYearsChartComponent } from './contracts-count-by-years-chart.component';

describe('ContractsCountByYearsChartComponent', () => {
  let component: ContractsCountByYearsChartComponent;
  let fixture: ComponentFixture<ContractsCountByYearsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsCountByYearsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsCountByYearsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
