import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoratesChartComponent } from './directorates-chart.component';

describe('DirectoratesChartComponent', () => {
  let component: DirectoratesChartComponent;
  let fixture: ComponentFixture<DirectoratesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoratesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoratesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
