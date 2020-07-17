import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotLicencesComponent } from './allot-licences.component';

describe('AllotLicencesComponent', () => {
  let component: AllotLicencesComponent;
  let fixture: ComponentFixture<AllotLicencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotLicencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
