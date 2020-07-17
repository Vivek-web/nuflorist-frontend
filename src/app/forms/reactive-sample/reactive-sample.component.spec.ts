import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveSampleComponent } from './reactive-sample.component';

describe('ReactiveSampleComponent', () => {
  let component: ReactiveSampleComponent;
  let fixture: ComponentFixture<ReactiveSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactiveSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
