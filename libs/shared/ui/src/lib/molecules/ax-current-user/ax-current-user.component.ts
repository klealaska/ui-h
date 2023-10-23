import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { axChevron, axIconUser } from '../../assets/ax-icons.model';
import { MenuOption } from '../../shared/models/ax-menu';

@Component({
  selector: 'ax-current-user',
  templateUrl: './ax-current-user.component.html',
  styleUrls: ['./ax-current-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxCurrentUserComponent {
  @Input() image = '';
  @Input() text = '';
  @Input() menuOptions: MenuOption[] = [];
  @Input() lightThemeIsActive = false;
  @Output() logout = new EventEmitter();
  @Output() selectedMenuItem = new EventEmitter<string>();

  chevronImage = axChevron.data;
  defaultUserImage = axIconUser.data;
}
