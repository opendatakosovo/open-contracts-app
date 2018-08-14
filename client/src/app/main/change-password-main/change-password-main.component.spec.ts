import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordMainComponent } from './change-password-main.component';

describe('ChangePasswordMainComponent', () => {
  let component: ChangePasswordMainComponent;
  let fixture: ComponentFixture<ChangePasswordMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
