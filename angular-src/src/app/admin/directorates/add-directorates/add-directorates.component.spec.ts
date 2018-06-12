import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectoratesComponent } from './add-directorates.component';

describe('AddDirectoratesComponent', () => {
  let component: AddDirectoratesComponent;
  let fixture: ComponentFixture<AddDirectoratesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDirectoratesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectoratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
