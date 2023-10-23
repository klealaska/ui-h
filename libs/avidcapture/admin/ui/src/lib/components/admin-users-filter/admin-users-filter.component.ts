import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@ui-coe/shared/ui';

@Component({
  selector: 'xdc-admin-users-filter',
  templateUrl: './admin-users-filter.component.html',
  styleUrls: ['./admin-users-filter.component.scss'],
})
export class AdminUsersFilterComponent {
  @Input() users: User[] = [];
  @Input() filteredUsers: User[] = [];

  @Output() customerChangedEvent = new EventEmitter<User[]>();
  @Output() customerTextChangedEvent = new EventEmitter<string>();
}
