import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  AddressSectionContent,
  AddressType,
  HierarchyType,
  IActivateOrDeactivateItem,
  IDeactiveActivateAddressEvent,
  IDetails,
  IEditAddressEvent,
} from '@ui-coe/bus-hier/shared/types';
import { ButtonColors, ButtonTypes, DialogDataV2 } from '@ui-coe/shared/types';
import { DialogV2Component } from '@ui-coe/shared/ui-v2';
import { take } from 'rxjs';

@Component({
  selector: 'bus-hier-details',
  templateUrl: './bus-hier-details.component.html',
  styleUrls: ['./bus-hier-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierDetailsComponent {
  @Input() details: IDetails;
  @Input() deactivateMessage: string;
  @Input() reactivateMessage: string;
  @Input() reactivateText: string;
  @Input() deactivateText: string;
  @Input() editBtnText: string;
  @Input() addressSectionContent: AddressSectionContent;

  @Output() activateItem = new EventEmitter<IActivateOrDeactivateItem>();
  @Output() deactivateItem = new EventEmitter<IActivateOrDeactivateItem>();
  @Output() toggleEditDetailsMode = new EventEmitter<boolean>();
  @Output() activateAddressButtonClick = new EventEmitter<IDeactiveActivateAddressEvent>();
  @Output() deactivateAddressButtonClick = new EventEmitter<IDeactiveActivateAddressEvent>();
  @Output() addAddress = new EventEmitter<AddressType>();
  @Output() editAddress = new EventEmitter<IEditAddressEvent>();

  public dialogData: DialogDataV2;
  public readonly buttonTypes = ButtonTypes;
  public readonly buttonColors = ButtonColors;
  entitiesType = HierarchyType.ENTITIES;
  orgType = HierarchyType.ORGANIZATION;
  shipTo = AddressType.SHIP_TO;
  billTo = AddressType.BILL_TO;
  constructor(public readonly dialog: MatDialog) {}

  onActivateOrDeactivateItem(item: IDetails): void {
    const params = {
      id: item?.id,
      hierarchyType: item?.type,
      name: item?.name,
    };

    this.setDialogData(item, item?.status === 'Active');
    this.dialog
      .open(DialogV2Component, {
        data: this.dialogData,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result.event === this.deactivateText) {
          this.deactivateItem.emit(params);
        } else if (result.event === this.reactivateText) {
          this.activateItem.emit(params);
        }
      });
  }

  private setDialogData(item: IDetails, isActive: boolean): void {
    this.dialogData = {
      draggable: false,
      type: isActive ? 'alert' : 'default',
      closeIcon: true,
      title: `${isActive ? this.deactivateText : ''} ${item?.name}`,
      message: isActive ? this.deactivateMessage : this.reactivateMessage,
      overline: {
        hasAlertIcon: isActive ? true : false,
        text: isActive ? 'Warning' : this.reactivateText,
      },
      actionBtn: {
        type: ButtonTypes.primary,
        color: isActive ? ButtonColors.critical : ButtonColors.default,
        text: isActive ? this.deactivateText : this.reactivateText,
      },
      cancelBtn: {
        type: ButtonTypes.tertiary,
        color: ButtonColors.neutral,
        text: 'Cancel',
      },
    };
  }
}
