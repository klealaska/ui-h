import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bus-hier-item',
  templateUrl: './bus-hier-item.component.html',
  styleUrls: ['./bus-hier-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierItemComponent {
  @Input() name: string;
  @Input() status: string;
  @Input() statusText: number;
  @Input() id: string;
  @Input() type: string;
  @Input() level: number;
  @Input() entityTypeName: string;
  @Input() isDisabled: boolean;

  @Output() selectItem = new EventEmitter<{
    id: string;
    type: string;
    level: number;
    entityTypeName: string;
  }>();

  onClick() {
    this.selectItem.emit({
      id: this.id,
      type: this.type,
      level: this.level,
      entityTypeName: this.entityTypeName,
    });
  }
}
