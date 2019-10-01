import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTripsPage } from './ongoing-trips.page';

describe('OngoingTripsPage', () => {
  let component: OngoingTripsPage;
  let fixture: ComponentFixture<OngoingTripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingTripsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
