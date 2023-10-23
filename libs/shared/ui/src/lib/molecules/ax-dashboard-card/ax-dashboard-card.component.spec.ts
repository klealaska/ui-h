import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { AxHeaderComponent } from '../../atoms/ax-header/ax-header.component';
import { AxIconComponent } from '../../atoms/ax-icon/ax-icon.component';
import { AxLabelComponent } from '../../atoms/ax-label/ax-label.component';
import { AxDashboardCardComponent } from './ax-dashboard-card.component';

describe('AxDashboardCardComponent', () => {
  let component: AxDashboardCardComponent;
  let fixture: ComponentFixture<AxDashboardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AxDashboardCardComponent,
        MockComponent(AxHeaderComponent),
        MockComponent(AxIconComponent),
        MockComponent(AxLabelComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
