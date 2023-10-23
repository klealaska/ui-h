import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  IUser,
  UserStatus,
  SHELL_HEADER_HEIGHT,
  UserRowAction,
  IRowAction,
} from '@ui-coe/usr-mgmt/shared/types';
import { DialogV2Component, TableDataSource } from '@ui-coe/shared/ui-v2';
import {
  ButtonColors,
  ButtonTypes,
  DialogDataV2,
  PointerPositions,
  TagTypes,
  TooltipPositions,
  TooltipStyles,
} from '@ui-coe/shared/types';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

@Component({
  selector: 'usr-mgmt-list',
  templateUrl: './usr-mgmt-list.component.html',
  styleUrls: ['./usr-mgmt-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsrMgmtListComponent implements OnInit, OnChanges {
  @Input() displayedColumns;
  @Input() userListData;
  @Input() size;
  @Input() tableType;
  @Input() customSort;
  @Input() selection;
  @Input() parent: ElementRef;
  @Input() tooltips;
  @Input() deactivateUserModal: any;
  @Input() reactivateUserModal: any;
  @Input() deactivateButtonText: string;
  @Input() activateButtonText: string;

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @Output() deactivateButtonClick = new EventEmitter<string>();
  @Output() rowActionSelected: EventEmitter<IRowAction> = new EventEmitter<IRowAction>();

  public gridHeight: number;
  public dataSource: TableDataSource<IUser>;
  public userStatusTagTypeMap = {
    [UserStatus.ACTIVE]: TagTypes.Success,
    [UserStatus.INACTIVE]: TagTypes.Default,
    [UserStatus.INVITED]: TagTypes.Warning,
    [UserStatus.NOT_INVITED]: TagTypes.Informational,
  };
  public userStatusToActionMap = {
    [UserStatus.ACTIVE]: [
      UserRowAction.EDIT,
      UserRowAction.DEACTIVATE,
      UserRowAction.RESET_PASSWORD,
    ],
    [UserStatus.INACTIVE]: [UserRowAction.EDIT, UserRowAction.REACTIVATE],
    [UserStatus.INVITED]: [UserRowAction.EDIT, UserRowAction.RESEND_INVITE],
    [UserStatus.NOT_INVITED]: [UserRowAction.EDIT, UserRowAction.INVITE],
  };
  public userStatusTooltipMap;
  tooltipStyle = TooltipStyles.Primary;
  tooltipPosition = TooltipPositions.Above;
  tooltipPointerPosition = PointerPositions.Center;

  public dialogData: DialogDataV2;
  success = 'success';
  default = 'default';

  primaryBtn = ButtonTypes.primary;
  secondaryBtn = ButtonTypes.secondary;
  btnColorDefault = ButtonColors.default;

  constructor(private element: ElementRef, public readonly dialog: MatDialog) {}

  ngOnChanges(changes): void {
    if (changes.displayedColumns?.currentValue) {
      const { name, email, status, actions } = changes.displayedColumns.currentValue;
      this.displayedColumns = [name, email, status, actions];
    }
    if (changes.userListData?.currentValue) {
      this.userListData = changes.userListData.currentValue;
      if (this.dataSource) {
        this.dataSource.data = this.userListData;
      }
    }
    if (changes.tooltips?.currentValue) {
      const { active, inactive, invited, notInvited } = changes.tooltips.currentValue;
      this.userStatusTooltipMap = {
        [UserStatus.ACTIVE]: active,
        [UserStatus.INACTIVE]: inactive,
        [UserStatus.INVITED]: invited,
        [UserStatus.NOT_INVITED]: notInvited,
      };
    }
  }

  ngOnInit() {
    this.dataSource = new TableDataSource([]);
    this.getGridHeight();
  }

  getStatusType(status: UserStatus) {
    return this.userStatusTagTypeMap[status];
  }

  getToolTip(status: UserStatus) {
    return this.userStatusTooltipMap[status];
  }

  getMenuList(status: UserStatus) {
    return this.userStatusToActionMap[status];
  }

  menuClicked(menuItem: UserRowAction, row: IUser) {
    if (menuItem === UserRowAction.DEACTIVATE) {
      this.onDeactivateUserModal(row);
    } else {
      this.rowActionSelected.emit({ user: row, action: menuItem });
    }
  }

  @HostListener('window:resize')
  getGridHeight() {
    //* Need the height for virtual scroll
    this.gridHeight =
      window.innerHeight - (this.element.nativeElement.offsetTop + SHELL_HEADER_HEIGHT);
  }
  private setDialogData(user: IUser): void {
    this.dialogData = {
      draggable: false,
      type: user.status ? 'alert' : 'default',
      closeIcon: true,
      message: user.status
        ? this.deactivateUserModal.bodyText.replace(
            '{{ user }}',
            `${user.fullName} (${user.email}).`
          )
        : this.reactivateUserModal.bodyText.replace(
            '{{ user }}',
            `${user.fullName} (${user.email}).`
          ),
      overline: {
        hasAlertIcon: user.status ? true : false,
        text: user.status ? 'Deactivate user' : 'Reactivate user',
      },
      actionBtn: {
        type: ButtonTypes.primary,
        color: user.status ? ButtonColors.critical : ButtonColors.default,
        text: user.status ? this.deactivateUserModal.buttonText : this.activateButtonText,
      },
      cancelBtn: {
        type: ButtonTypes.tertiary,
        color: ButtonColors.neutral,
        text: 'Cancel',
      },
    };
  }
  onDeactivateUserModal(user: IUser): void {
    this.setDialogData(user);
    this.dialog
      .open(DialogV2Component, {
        data: this.dialogData,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result.event === this.deactivateUserModal.buttonText) {
          this.deactivateButtonClick.emit(user.userId);
        }
      });
  }
}
