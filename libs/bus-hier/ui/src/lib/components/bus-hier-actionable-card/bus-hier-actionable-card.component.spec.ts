import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierActionableCardComponent } from './bus-hier-actionable-card.component';

describe('BusHierActionableCardComponent', () => {
  let component: BusHierActionableCardComponent;
  let fixture: ComponentFixture<BusHierActionableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierActionableCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierActionableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
