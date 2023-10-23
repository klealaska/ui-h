import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  AssociatedErrorMessage,
  DocumentLabelKeys,
  FieldBase,
  FieldTypes,
  IndexedLabel,
  InputDataTypes,
  NonLookupErrorMessage,
} from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-non-lookup-field',
  templateUrl: './non-lookup-field.component.html',
  styleUrls: ['./non-lookup-field.component.scss'],
})
export class NonLookupFieldComponent implements OnInit, OnChanges {
  @Input() field: FieldBase<string>;
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() confidence = 0;
  @Input() confidenceColor = 'default';
  @Input() highlightLabels: IndexedLabel[] = [];
  @Input() associatedErrorMessage: AssociatedErrorMessage;
  @Input() nonLookupErrorMessage: NonLookupErrorMessage;
  @Input() tabbedToField: FieldBase<string>;
  @Input() selectedDocumentText: IndexedLabel;
  @Input() isSponsorUser: boolean;
  @Input() canEditPredictedValues: boolean;
  @Input() canDisplayPredictedValues: boolean;
  @Input() multipleDisplayThresholdsIsActive = false;

  @Output() valueChanged = new EventEmitter<FieldBase<string>>();
  @Output() labelHoverEvent = new EventEmitter<string>();
  @Output() fieldSelectedForAssociation = new EventEmitter<FieldBase<string>>();

  editMode = false;
  isValid = true;
  value = '';
  meetsDisplayThreshold = false;
  meetsReadonlyThreshold = false;
  hasFocus = true;
  errorMessage: string;
  labelTextColor = 'default';
  preventSingleClick: boolean;
  turnOnHighlight = false;

  private clickTimer: ReturnType<typeof setTimeout> = setTimeout(() => '', 1000);
  private isNegativeNumber = false;

  ngOnInit(): void {
    this.value = this.field.value;
    this.isNegativeNumber =
      (this.value != null && this.value.includes('-')) || Number(this.value) < 0;

    if (this.field.type === InputDataTypes.Currency) {
      this.value = this.setNegativeCheckValue(this.value);
    }

    if (this.formGroupInstance && this.field) {
      this.isValid = this.formGroupInstance.controls[this.field.key].valid;
    }

    // Logic: Has to be an indexer user and the indexed label "DisplayPredictedValues" has to be true
    //    OR feature flag user targeting is enabled so that InternalOps can see greyed out predicted values for all buyers
    this.meetsReadonlyThreshold =
      // ((this.isSponsorUser && this.canDisplayPredictedValues) ||
      //   this.multipleDisplayThresholdsIsActive) &&
      this.isSponsorUser &&
      this.multipleDisplayThresholdsIsActive &&
      this.value &&
      this.field.confidence !== 1 &&
      this.field?.confidence >= this.field?.displayThreshold.readonly * 0.01;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.confidence?.currentValue >= this.field.displayThreshold?.view * 0.01) {
      this.meetsDisplayThreshold = true;
    }

    if (changes.highlightLabels?.currentValue) {
      const label = changes.highlightLabels.currentValue.find(
        (lbl: IndexedLabel) => lbl.label === this.field.key
      );

      this.turnOnHighlight =
        label && label.value.confidence >= this.field.displayThreshold.view * 0.01 ? true : false;
    }

    if (changes.tabbedToField?.currentValue?.key === this.field.key) {
      this.edit();
    }
  }

  onblur(fieldValue: string): void {
    let newValue = fieldValue !== this.field.value;

    if (this.field.type === FieldTypes.Currency) {
      const regexIsNegative = /^-|-$/;
      const isNegativeNew = regexIsNegative.test(fieldValue) ? '-' : '';
      const isNegativeCurrent = regexIsNegative.test(this.field.value) ? '-' : '';

      newValue =
        `${isNegativeCurrent}${this.field.value.replace(/\D/g, '')}` !==
        `${isNegativeNew}${fieldValue.replace(/\D/g, '')}`;
    }

    this.editMode = false;

    if (newValue) {
      this.errorMessage = '';
      this.updateForm(fieldValue);
    }
  }

  onfocus(fieldValue: string): void {
    this.value = fieldValue;
  }

  handleOnKeyUp(fieldValue: string): void {
    if (this.field.key == DocumentLabelKeys.nonLookupLabels.InvoiceNumber) {
      fieldValue = fieldValue.replace(/[^a-zA-Z-/_().:,0-9]/g, ' ');
      fieldValue = fieldValue.replace(/\s+/g, ' ');
    }

    this.value = fieldValue;
  }

  isFormValid(event: boolean): void {
    this.isValid = event;
  }

  edit(): void {
    this.editMode = true;
    this.isValid = true;
    this.associatedErrorMessage = null;
  }

  handleInputClick(): void {
    if (this.selectedDocumentText) {
      this.fieldSelectedForAssociation.emit(this.field);
    } else {
      this.edit();
    }
  }

  handleSingleClick(): void {
    this.preventSingleClick = false;
    this.clickTimer = setTimeout(() => {
      if (!this.preventSingleClick) {
        this.fieldSelectedForAssociation.emit(this.field);
      }
    }, 250);
  }

  handleDblClick(): void {
    this.preventSingleClick = true;
    clearTimeout(this.clickTimer);
    this.editMode = true;
  }

  private updateForm(fieldValue: string): void {
    this.value = fieldValue;
    this.field.value = fieldValue;
    this.valueChanged.emit(this.field);
  }

  private setNegativeCheckValue(value: string): string {
    this.labelTextColor = this.isNegativeNumber ? 'red' : 'default';
    return value;
  }
}
