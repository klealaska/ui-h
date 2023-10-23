import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bus-hier-actionable-card',
  templateUrl: './bus-hier-actionable-card.component.html',
  styleUrls: ['./bus-hier-actionable-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierActionableCardComponent {
  @Input() id: number;
  @Input() isDisabled: boolean;
  @Input() isActive: boolean;
  @Input() fixed: boolean;

  @Output() click = new EventEmitter<number>();

  getClass() {
    return `${
      !this.fixed ? 'hover:bg-secondary-200' : ''
    } border-solid border-[1px] rounded border-primary-50 ${
      this.isDisabled ? '!cursor-not-allowed' : ''
    }`;
  }
  onClick() {
    if (!this.isDisabled) {
      this.click.emit(this.id);
    }
  }
}
