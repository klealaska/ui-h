import { Component, Input, EventEmitter, Output, OnInit, OnChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { PropertyType } from '../../../../core/enums';
import { ComplexSettingValue, Property, PropertyError } from '../../../../models';
import { CustomErrorStateMatcher, hasErrors } from '../../../services/schema-helper.service';

@Component({
  selector: 'avc-property-type',
  templateUrl: './property-type.component.html',
  styleUrls: ['./property-type.component.scss'],
})
export class PropertyTypeComponent implements OnInit, OnChanges {
  @Input() groupName: string;
  @Input() property: Property;
  @Input() value: any;
  @Input() isNew = false;
  @Input() error: string | PropertyError;
  @Input() complexValues?: string[];
  @Output() valueChanged = new EventEmitter<any>();
  @Output() complexModalClosed = new EventEmitter<boolean>();
  @Output() complexPropertyChanged = new EventEmitter<ComplexSettingValue>();

  propertyFormControl: UntypedFormControl;
  matcher = new CustomErrorStateMatcher();

  ngOnInit(): void {
    this.propertyFormControl = new UntypedFormControl(this.value, {
      validators: [hasErrors.bind(this)],
    });
  }

  ngOnChanges(): void {
    this.propertyFormControl?.setErrors(this.error ? { error: true } : null);
  }

  getPropertyType(): string {
    return this.property.Type === PropertyType.Password || this.property.IsSecret
      ? 'password'
      : 'text';
  }

  isTypeOfErrorString(): boolean {
    return typeof this.error === 'string';
  }
}
