import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import type { MenuPositionX, MenuPositionY } from '@angular/material/menu';

import { axChevron, axIconLogout } from '../../assets/ax-icons.model';
import { MenuOption } from '../../shared/models/ax-menu';

@Component({
  selector: 'ax-mat-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() addLogoutOption = false;
  @Input() buttonIcon = 'expand_more';
  @Input() xPosition: MenuPositionX = 'after';
  @Input() yPosition: MenuPositionY = 'below';
  @Input() menuOptions: MenuOption[] = [];
  @Input() menuItemClass = '';

  // specific inouts for mat slide toggle component
  @Input() toggleColor = 'primary';

  @Output() logout = new EventEmitter();
  @Output() selectedMenuItem = new EventEmitter<string>();
  @Output() selectedMenuItemChanged = new EventEmitter<MenuOption>();

  menuTriggerIcon = axChevron.data;
  logoutIcon = axIconLogout.data;

  options: MenuOption[] = [];
  defaultLogoutDropdownOption: MenuOption = {
    text: 'Logout',
    icon: 'logout',
  };

  ngOnInit(): void {
    this.id = this.id ?? `ax-mat-menu-${new Date().getTime()}`;
    this.addMenuOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.menuOptions) {
      this.addMenuOptions();
    }
  }

  menuOptionSelected(event: Event, optionSelected: MenuOption): void {
    if (optionSelected.selectable) {
      event.stopPropagation();
    }

    if (this.defaultLogoutDropdownOption.text === optionSelected.text) {
      this.logout.emit();
    } else if (optionSelected.selectable) {
      this.toggleChange(optionSelected);
    } else {
      this.selectedMenuItem.emit(optionSelected.text);
    }
  }

  addMenuOptions(): void {
    this.addLogoutOption
      ? (this.options = this.menuOptions.concat(this.defaultLogoutDropdownOption))
      : (this.options = this.menuOptions);
  }

  toggleClicked(event: Event): void {
    event.stopPropagation();
  }

  toggleChange(option: MenuOption): void {
    option.value = !option.value;
    this.selectedMenuItemChanged.emit(option);
  }
}
