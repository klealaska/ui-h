import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UserStatus, AdminUsersBehavior } from '../../shared/enums';
import { axIconUser } from '../../assets/ax-icons.model';
import { User } from '../../shared/models';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ax-admin-users-grid',
  templateUrl: './admin-users-grid.component.html',
  styleUrls: ['./admin-users-grid.component.scss'],
})
export class AdminUsersGridComponent implements OnChanges {
  @Input() dataSource: User[] = [];
  @Output() userSelected: EventEmitter<User> = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  defaultImage = axIconUser;
  displayedColumns: string[] = ['image', 'name', 'email', 'role', 'status', 'behavior'];
  dataSourceUsers;

  ngOnChanges(simpleChange: SimpleChanges): void {
    if (simpleChange.dataSource) {
      this.dataSourceUsers = new MatTableDataSource(this.dataSource);
      this.dataSourceUsers.sort = this.sort;
    }
  }

  setBehavior(status: string): string {
    return status === UserStatus.Active ? AdminUsersBehavior.EditMember : AdminUsersBehavior.Resend;
  }
}
