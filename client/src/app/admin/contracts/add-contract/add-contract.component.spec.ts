import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractComponent } from './add-contract.component';

describe('AddContractComponent', () => {
  let component: AddContractComponent;
  let fixture: ComponentFixture<AddContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
