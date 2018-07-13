import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageContractsListComponent } from './main-page-contracts-list.component';

describe('MainPageContractsListComponent', () => {
  let component: MainPageContractsListComponent;
  let fixture: ComponentFixture<MainPageContractsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPageContractsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageContractsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
