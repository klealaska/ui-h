import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ThemePalette } from '@angular/material/core';
import type { MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { ButtonTypes } from '../../shared/enums';
import { ButtonMenuOption } from '../../shared/models/ax-button-menu';

@Component({
  selector: 'ax-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss'],
})
export class ButtonMenuComponent {
  // button specif input values
  @Input() btnType: ButtonTypes = ButtonTypes.raised;
  @Input() options: ButtonMenuOption[];
  @Input() color: ThemePalette = 'primary';
  @Input() disableRipple: boolean;
  @Input() disabled = false;
  @Input() text: string;
  @Input() id = `ax-button-${new Date().getTime()}`;
  @Input() icon: string;

  // menu specific input values
  @Input('aria-describedby') ariaDescribedby: string;
  @Input('aria-label') ariaLabel: string;
  @Input('aria-labelledby') ariaLabelledby: string;
  @Input() backdropClass: string;
  @Input() hasBackdrop: boolean | undefined;
  @Input() overlapTrigger: boolean;
  @Input() xPosition: MenuPositionX = 'after';
  @Input() yPosition: MenuPositionY = 'below';

  // badge specific inputs
  @Input() matBadge: number | string;
  @Input() matBadgeOverlap: boolean;
  @Input() matBadgeSize = 'medium';
  @Input() matBadgePosition = 'after';
  @Input() matBadgeColor: string;
  @Input() matBadgeHidden: boolean;

  @Output() menuClosed = new EventEmitter<void>();
  @Output() menuOpened = new EventEmitter<void>();
  @Output() menuOptionSelected = new EventEmitter<void>();

  buttonTypes = ButtonTypes;
}
