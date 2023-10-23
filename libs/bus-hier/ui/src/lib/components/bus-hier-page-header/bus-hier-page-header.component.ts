import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bus-hier-page-header',
  templateUrl: './bus-hier-page-header.component.html',
  styleUrls: ['./bus-hier-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierPageHeaderComponent {
  @Input() title: string;
  @Input() buttonText: string;
  @Input() buttonId: string;

  @Output() buttonClicked = new EventEmitter<void>();
}
