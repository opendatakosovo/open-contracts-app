import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoratesComponent } from './directorates.component';

describe('DirectoratesComponent', () => {
  let component: DirectoratesComponent;
  let fixture: ComponentFixture<DirectoratesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoratesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
