import { Component, Input } from '@angular/core';

import { DashboardCard } from '../../shared/models/ax-dashboard-card-set';

@Component({
  selector: 'ax-dashboard-card-set',
  templateUrl: './ax-dashboard-card-set.component.html',
  styleUrls: ['./ax-dashboard-card-set.component.scss'],
})
export class AxDashboardCardSetComponent {
  @Input() cards: DashboardCard[] = [];
}
