import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bus-hier-add-address',
  templateUrl: './bus-hier-add-address.component.html',
  styleUrls: ['./bus-hier-add-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierAddAddressComponent {
  @Input() addAddressButonText: string;

  @Output() addAddress = new EventEmitter<void>();
}
