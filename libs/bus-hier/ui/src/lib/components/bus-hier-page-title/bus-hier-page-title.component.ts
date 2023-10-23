import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'bus-hier-page-title',
  templateUrl: './bus-hier-page-title.component.html',
  styleUrls: ['./bus-hier-page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierPageTitleComponent {
  @Input() title: string;
}
