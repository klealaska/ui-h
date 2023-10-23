import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonDropdownOption } from '../../shared/models';

@Component({
  selector: 'ax-top-header',
  templateUrl: './ax-top-header.component.html',
  styleUrls: ['./ax-top-header.component.scss'],
})
export class AxTopHeaderComponent {
  @Input() titleImage: string;
  @Input() titleText: string;
  @Input() isBeta = false;
  @Input() userImage = '';
  @Input() userDisplayName = '';
  @Input() menuOptions: ButtonDropdownOption[] = [];
  @Input() lightThemeIsActive = false;
  @Input() canClickTitle = true;
  @Input() avidPartner: string;
  @Output() logout = new EventEmitter();
  @Output() titleClick = new EventEmitter();
  @Output() menuItemClick = new EventEmitter<string>();
}
