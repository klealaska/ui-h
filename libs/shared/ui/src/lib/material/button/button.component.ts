import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ThemePalette } from '@angular/material/core';

import { ButtonTypes } from '../../shared/enums/button-types.enum';
import type { MatButtonType } from '../../shared/types/mat-button.type';

@Component({
  selector: 'ax-mat-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() btnType: MatButtonType = ButtonTypes.raised;
  @Input() color: ThemePalette = 'primary';
  @Input() disableRipple: boolean;
  @Input() disabled = false;
  @Input() text: string;
  @Input() id = `ax-button-${new Date().getTime()}`;
  @Input() icon: string;
  // badge specific inputs
  @Input() matBadge: number | string;
  @Input() matBadgeOverlap: boolean;
  @Input() matBadgeSize = 'medium';
  @Input() matBadgePosition = 'after';
  @Input() matBadgeColor: string;
  @Input() matBadgeHidden: boolean;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() click = new EventEmitter<void>();

  // declaring enums to a local value for the template
  buttonTypes = ButtonTypes;
}
