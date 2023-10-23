import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { AxDashboardCardComponent } from '../../molecules/ax-dashboard-card/ax-dashboard-card.component';
import { AxDashboardCardSetComponent } from './ax-dashboard-card-set.component';

describe('AxDashboardCardSetComponent', () => {
  let component: AxDashboardCardSetComponent;
  let fixture: ComponentFixture<AxDashboardCardSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxDashboardCardSetComponent, MockComponent(AxDashboardCardComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxDashboardCardSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
