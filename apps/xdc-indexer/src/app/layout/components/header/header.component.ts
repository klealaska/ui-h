import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserMenuOption } from '@ui-coe/avidcapture/shared/types';
import { AvatarName } from '@ui-coe/shared/types';

@Component({
  selector: 'xdc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() logoImgSrc = 'assets/images/avid_logo.png';
  @Input() homePath = 'queue';
  @Input() name = '';
  @Input() menuOptions: UserMenuOption[];
  @Output() logout = new EventEmitter<void>();
  @Output() selectedMenuItem = new EventEmitter<string>();

  avatarName: AvatarName;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.avatarName = {
      first: this.name.split(' ')[0],
      last: this.name.split(' ').pop(),
    };
  }

  navigate(): void {
    this.router.navigate([this.homePath]);
  }

  menuOptionSelected(optionSelected: UserMenuOption): void {
    if (optionSelected.text === 'Logout') {
      this.logout.emit();
    } else {
      this.selectedMenuItem.emit(optionSelected.text);
    }
  }
}
