import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../../checkbox/checkbox.component';

@Component({
  selector: 'ax-selectable-card',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './selectable-card.component.html',
  styleUrls: ['./selectable-card.component.scss'],
})
export class SelectableCardComponent {
  @Input() selected: boolean;
  @Input() disabled: boolean;
  @Input() checkbox = true;
  @Output() selectedState = new EventEmitter();

  setSelected() {
    this.selected = !this.selected;
    this.selectedState.emit(this.selected);
  }
}
