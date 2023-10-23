import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  AddressType,
  HierarchyType,
  IAddress,
  IDeactiveActivateAddressEvent,
  IEditAddressEvent,
} from '@ui-coe/bus-hier/shared/types';
import { ButtonColors, ButtonTypes, DialogDataV2 } from '@ui-coe/shared/types';
import { DialogV2Component } from '@ui-coe/shared/ui-v2';
import { take } from 'rxjs';
interface AddressForm {
  addressLine1: FormControl<string>;
  addressLine2: FormControl<string>;
  addressLine3: FormControl<string>;
  addressLine4: FormControl<string>;
  locality: FormControl<string>;
  region: FormControl<string>;
  postalCode: FormControl<string>;
  addressType: FormControl<string>;
  addressCode: FormControl<string>;
}
@Component({
  selector: 'bus-hier-address',
  templateUrl: './bus-hier-address.component.html',
  styleUrls: ['./bus-hier-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierAddressComponent implements OnInit {
  editAddressForm: FormGroup;
  @Input() addressType: AddressType;
  // this Id can be an Organization Id or an Entity Id
  @Input() id: string;
  @Input() hierarchyType: HierarchyType;
  @Input() address: IAddress;
  @Input() activateAddressText: string;
  @Input() inactiveAddressText: string;
  @Input() deactivateButtonText: string;
  @Input() activateButtonText: string;
  @Input() deactiveWarningModalBodyText: string;
  @Input() deactiveWarningModalTitleText: string;
  @Input() reActiveWarningModalBodyText: string;
  @Input() reActiveWarningModalTitleText: string;
  @Input() sideSheetEditAddressTitleText: string;
  @Input() sideSheetEditAddressSaveButtonText: string;
  @Input() sideSheetEditAddressCancelButtonText: string;

  @Output() deactivateButtonClick = new EventEmitter<IDeactiveActivateAddressEvent>();
  @Output() activateButtonClick = new EventEmitter<IDeactiveActivateAddressEvent>();
  @Output() editAddress = new EventEmitter<IEditAddressEvent>();

  public dialogData: DialogDataV2;
  success = 'success';
  default = 'default';

  options = [
    {
      text: 'Ship to',
      value: AddressType.SHIP_TO,
      disabled: true,
    },
    {
      text: 'Bill to',
      value: AddressType.BILL_TO,
      disabled: true,
    },
  ];
  primaryBtn = ButtonTypes.primary;
  secondaryBtn = ButtonTypes.secondary;
  btnColorDefault = ButtonColors.default;
  constructor(public readonly dialog: MatDialog) {}
  editAddressSideSheetToggle: boolean;
  ngOnInit(): void {
    this.editAddressForm = new FormGroup<AddressForm>({
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      addressLine3: new FormControl(''),
      addressLine4: new FormControl(''),
      locality: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      addressType: new FormControl('', Validators.required),
      addressCode: new FormControl('', [Validators.required]),
    });
    this.editAddressSideSheetToggle = false;
  }

  onCancelButtonClick(): void {
    this.editAddressForm.reset();
    this.toggleEditAddressSideSheet();
  }

  toggleEditAddressSideSheet(): void {
    this.editAddressSideSheetToggle = !this.editAddressSideSheetToggle;
  }

  onSaveButtonClick(): void {
    this.toggleEditAddressSideSheet();
    this.editAddress.emit({
      address: {
        ...this.address,
        ...(this.editAddressForm.value as IAddress),
      },
      type: this.hierarchyType,
      id: this.id,
      addressType: this.addressType,
    });
  }

  onEditAddress(): void {
    this.toggleEditAddressSideSheet();
    this.editAddressForm.controls['addressLine1'].setValue(this.address?.addressLine1);
    this.editAddressForm.controls['addressLine2'].setValue(this.address?.addressLine2);
    this.editAddressForm.controls['addressLine3'].setValue(this.address?.addressLine3);
    this.editAddressForm.controls['addressLine4'].setValue(this.address?.addressLine4);
    this.editAddressForm.controls['locality'].setValue(this.address?.locality);
    this.editAddressForm.controls['region'].setValue(this.address?.region);
    this.editAddressForm.controls['postalCode'].setValue(this.address?.postalCode);
    this.editAddressForm.controls['addressType'].setValue(this.address?.addressType);
    this.editAddressForm.controls['addressCode'].setValue(this.address?.addressCode);
  }

  onDeactivateActivateAddress(address: IAddress): void {
    this.setDialogData(address);
    this.dialog
      .open(DialogV2Component, {
        data: this.dialogData,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result.event === this.deactivateButtonText) {
          this.deactivateButtonClick.emit({
            id: this.id,
            addressId: address.addressId,
            type: this.addressType,
            hierarchyType: this.hierarchyType,
          });
        } else if (result.event === this.activateButtonText) {
          this.activateButtonClick.emit({
            id: this.id,
            addressId: address.addressId,
            type: this.addressType,
            hierarchyType: this.hierarchyType,
          });
        }
      });
  }
  public readonly buttonTypes = ButtonTypes;
  public readonly buttonColors = ButtonColors;
  private setDialogData(address: IAddress): void {
    this.dialogData = {
      draggable: false,
      type: address.isActive ? 'alert' : 'default',
      closeIcon: true,
      title: address.isActive
        ? this.deactiveWarningModalTitleText
        : this.reActiveWarningModalTitleText,
      message: address.isActive
        ? this.deactiveWarningModalBodyText.replace(
            '{{ address }}',
            `${address.addressLine1} ${address.locality}, ${address.region} ${address.postalCode}`
          )
        : this.reActiveWarningModalBodyText.replace(
            '{{ address }}',
            `${address.addressLine1} ${address.locality}, ${address.region} ${address.postalCode}`
          ),
      overline: {
        hasAlertIcon: address.isActive ? true : false,
        text: address.isActive ? 'Warning' : '',
      },
      actionBtn: {
        type: ButtonTypes.primary,
        color: address.isActive ? ButtonColors.critical : ButtonColors.default,
        text: address.isActive ? this.deactivateButtonText : this.activateButtonText,
      },
      cancelBtn: {
        type: ButtonTypes.tertiary,
        color: ButtonColors.neutral,
        text: 'Cancel',
      },
    };
  }
}
