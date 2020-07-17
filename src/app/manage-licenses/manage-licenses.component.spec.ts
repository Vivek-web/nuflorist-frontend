import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLicensesComponent } from './manage-licenses.component';

describe('ManageLicensesComponent', () => {
  let component: ManageLicensesComponent;
  let fixture: ComponentFixture<ManageLicensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLicensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
