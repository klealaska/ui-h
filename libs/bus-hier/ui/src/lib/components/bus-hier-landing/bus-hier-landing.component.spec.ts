import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierLandingComponent } from './bus-hier-landing.component';

describe('BusHierLandingComponent', () => {
  let component: BusHierLandingComponent;
  let fixture: ComponentFixture<BusHierLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
