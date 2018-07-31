import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTenContractorsChartComponent } from './top-ten-contractors-chart.component';

describe('TopTenContractorsChartComponent', () => {
  let component: TopTenContractorsChartComponent;
  let fixture: ComponentFixture<TopTenContractorsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopTenContractorsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTenContractorsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
