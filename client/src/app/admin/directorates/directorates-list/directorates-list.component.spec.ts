import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoratesListComponent } from './directorates-list.component';

describe('DirectoratesListComponent', () => {
  let component: DirectoratesListComponent;
  let fixture: ComponentFixture<DirectoratesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoratesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoratesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
