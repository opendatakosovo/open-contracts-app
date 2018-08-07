import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoratesTableComponent } from './directorates-table.component';

describe('DirectoratesTableComponent', () => {
  let component: DirectoratesTableComponent;
  let fixture: ComponentFixture<DirectoratesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoratesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoratesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
