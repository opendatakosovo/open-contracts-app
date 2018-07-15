import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCommentsComponent } from './contract-comments.component';

describe('ContractCommentsComponent', () => {
  let component: ContractCommentsComponent;
  let fixture: ComponentFixture<ContractCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
