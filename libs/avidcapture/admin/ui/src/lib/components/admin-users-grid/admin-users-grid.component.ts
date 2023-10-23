import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@ui-coe/shared/ui';

@Component({
  selector: 'xdc-admin-users-grid',
  templateUrl: './admin-users-grid.component.html',
  styleUrls: ['./admin-users-grid.component.scss'],
})
export class AdminUsersGridComponent {
  @Input() dataSource: User[];
  @Output() userSelected = new EventEmitter<User>();
}
