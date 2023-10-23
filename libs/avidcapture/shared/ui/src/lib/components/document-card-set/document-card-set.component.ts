import { Component, Input } from '@angular/core';
import { DashboardCard } from '@ui-coe/shared/ui';

@Component({
  selector: 'xdc-document-card-set',
  templateUrl: './document-card-set.component.html',
  styleUrls: ['./document-card-set.component.scss'],
})
export class DocumentCardSetComponent {
  @Input() documentCards: DashboardCard[];
}
