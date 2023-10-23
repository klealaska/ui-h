import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DocumentLabelKeys,
  FieldBase,
  InputDataTypes,
  InvoiceTypes,
} from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-archive-fields',
  templateUrl: './archive-fields.component.html',
  styleUrls: ['./archive-fields.component.scss'],
})
export class ArchiveFieldsComponent implements OnChanges {
  @Input() field: FieldBase<string>;
  @Input() fieldToHighlight: string;
  @Input() invoiceType: string;
  @Input() supplierAddressField: FieldBase<string>;
  @Input() shipToAddressField: FieldBase<string>;
  @Input() isUtilityField: boolean;
  @Input() canDisplayPredictedValues: boolean;
  @Input() isSponsorUser: boolean;
  @Output() boundingBoxToHighlight = new EventEmitter<string>();
  @Output() labelHoverEvent = new EventEmitter<string>();

  turnOnHighlight = false;
  labelTextColor = 'default';
  currentField = '';
  documentLabelKeys = DocumentLabelKeys;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fieldToHighlight) {
      this.turnOnHighlight =
        changes.fieldToHighlight.currentValue === this.field.labelDisplayName ? true : false;
    }
  }

  getLabelTextColor(field: FieldBase<string>): string {
    return field.type === InputDataTypes.Currency && Number(field.value) < 0 ? 'red' : 'default';
  }

  displayField(): string {
    const confidence = this.field.confidence * 100;
    const displayThreshold = this.field.displayThreshold.view;

    if (
      this.invoiceType.toLowerCase() === InvoiceTypes.Standard.toLowerCase() &&
      this.isUtilityField &&
      this.field.confidence !== 1
    ) {
      return '';
    } else if (
      this.field.value !== '' &&
      this.field.confidence !== 1 &&
      (!this.canDisplayPredictedValues ||
        (this.canDisplayPredictedValues && confidence < displayThreshold) ||
        (this.canDisplayPredictedValues && !this.isSponsorUser))
    ) {
      return '';
    }

    return this.field.value;
  }
}
