import { Component, Input, ViewEncapsulation } from '@angular/core';

import { axIconPaper, axIconUsers, axIconWarning } from '../../assets/ax-icons.model';

@Component({
  selector: 'ax-dashboard-card',
  templateUrl: './ax-dashboard-card.component.html',
  styleUrls: ['./ax-dashboard-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxDashboardCardComponent {
  @Input() count = 0;
  @Input() text = '';
  @Input() icon: string;

  icons = {
    paper: axIconPaper.data,
    user: axIconUsers.data,
    warning: axIconWarning.data,
  };
}
