import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDashboardComponent } from './data-dashboard.component';

describe('DataDashboardComponent', () => {
  let component: DataDashboardComponent;
  let fixture: ComponentFixture<DataDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
