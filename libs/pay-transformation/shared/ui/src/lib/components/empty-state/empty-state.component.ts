import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-coe-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() messageHeader?: string;
  @Input() messageSub?: string;
}
