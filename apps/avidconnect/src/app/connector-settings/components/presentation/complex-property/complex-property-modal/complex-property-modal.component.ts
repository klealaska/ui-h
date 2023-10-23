import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ComplexSettingValue, ComplexType, Property, PropertyError } from '../../../../../models';
import { ConnectorSettingsState } from '../../../../connector-settings.state';
import { SchemaHelperService } from '../../../../services/schema-helper.service';

@Component({
  selector: 'avc-complex-property-modal',
  templateUrl: './complex-property-modal.component.html',
  styleUrls: ['./complex-property-modal.component.scss'],
})
export class ComplexPropertyModalComponent implements OnInit {
  @Output() valueChanged = new EventEmitter<ComplexSettingValue>();

  complexType: ComplexType;
  duplicatedError: string;

  constructor(
    public dialogRef: MatDialogRef<ComplexPropertyModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      groupName: string;
      property: Property;
      value: any;
      isNew: boolean;
      error: PropertyError;
      complexValues: string[];
    },
    private store: Store,
    private schemaHelper: SchemaHelperService
  ) {}

  ngOnInit(): void {
    if (this.data.value == null) {
      this.data.value = {};
    }

    this.complexType = this.store.selectSnapshot(ConnectorSettingsState.getComplexTypeProperty)(
      this.data.property.ComplexType
    );

    this.complexType?.Properties.forEach(field => {
      this.schemaHelper.validatePropertyValue(
        this.data.groupName,
        field,
        this.data.value[field.Name],
        {
          propertyName: this.data.property.Name,
          name: this.data.property.ComplexType,
        }
      );
    });
  }

  saveComplexForm(): void {
    if (Object.keys(this.data.error || {}).length === 0 && !this.duplicatedError) {
      this.dialogRef.close({ isNew: this.data.isNew, saved: true });
    }
  }

  complexValueChanged(value: any, field: Property, index: number): void {
    if (index === 0) {
      this.duplicatedError = this.data.complexValues?.includes(value.toLowerCase().trim())
        ? `${field.DisplayName || field.Name} already exists`
        : '';
    }

    this.valueChanged.emit({ settings: { name: field.Name, value }, field });
  }
}
