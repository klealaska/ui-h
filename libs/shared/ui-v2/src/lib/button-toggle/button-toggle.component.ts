import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ButtonToggleContent, ButtonToggleSize, IconPosition } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatIconModule],
})
export class ButtonToggleComponent {
  @Input() disabled: boolean;
  @Input() multiSelect: boolean;
  @Input() size: ButtonToggleSize;
  @Input() iconPosition: IconPosition;
  @Input() fixedWidth: boolean;
  @Input() content: Array<ButtonToggleContent>;
  @Output() selectedEvent = new EventEmitter();
}
