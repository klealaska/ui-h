import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IItemSelection } from '@ui-coe/bus-hier/shared/types';

@Component({
  selector: 'bus-hier-toggle-card',
  templateUrl: './bus-hier-toggle-card.component.html',
  styleUrls: ['./bus-hier-toggle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierToggleCardComponent {
  @Input() id: string;
  @Input() type: string;
  @Input() name: string;
  @Input() status: string;
  @Input() statusText: string;
  @Input() isDisabled: boolean;
  @Input() isSelected: boolean;
  @Input() isActive: boolean;
  @Input() entityTypeName: string;

  @Output() toggleItemSelection = new EventEmitter<IItemSelection>();

  selectBtnClick() {
    this.toggleItemSelection.emit({
      id: this.id,
      isSelected: !this.isSelected,
    });
  }
}
