import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDetails, IEditEntity } from '@ui-coe/bus-hier/shared/types';
import { ButtonType, ButtonTypes, FormFieldError } from '@ui-coe/shared/types';

@Component({
  selector: 'bus-hier-details-edit',
  templateUrl: './bus-hier-details-edit.component.html',
  styleUrls: ['./bus-hier-details-edit.component.scss'],
})
export class BusHierDetailsEditComponent implements OnInit {
  editFormGroup: FormGroup;
  @Input() orgId: string;
  @Input() erpId: string;
  @Input() details: IDetails;
  @Input() saveBtnText: string;
  @Input() cancelBtnText: string;
  @Input() errors: string[];

  @Output() toggleEditDetailsMode = new EventEmitter<boolean>();
  @Output() saveDetails = new EventEmitter<IEditEntity>();

  tertiary: ButtonType = ButtonTypes.tertiary;

  ngOnInit(): void {
    this.editFormGroup = new FormGroup({
      name: new FormControl(this.details.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      code: new FormControl(this.details.code, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
    });
  }

  onSaveButtonClick() {
    const event: IEditEntity = {
      id: this.details.id,
      body: {
        name: this.editFormGroup.value.name,
        code: this.editFormGroup.value.code,
      },
      type: this.details?.type,
      orgId: this.orgId,
      erpId: this.erpId,
      level: this.details?.level,
    };
    this.saveDetails.emit(event);
  }

  requiredErrorMessage(fieldName: string): FormFieldError {
    return {
      message: `${fieldName} ${this.errors[0]}`,
      icon: 'warning',
    };
  }

  maxLengthErrorMessage(fieldName: string): FormFieldError {
    return {
      message: `${fieldName} ${this.errors[1]}`,
      icon: 'warning',
    };
  }

  buildErrorMessage(fieldName: string) {
    if (this.editFormGroup.controls[fieldName].errors) {
      if (this.editFormGroup.controls[fieldName].errors.maxlength) {
        return this.maxLengthErrorMessage(fieldName);
      }
      if (this.editFormGroup.controls[fieldName].errors.required) {
        return this.requiredErrorMessage(fieldName);
      }
    }
  }

  onCancelButtonClick() {
    this.toggleEditDetailsMode.emit(false);
  }
}
