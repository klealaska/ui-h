import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PropertyType } from '../../../../core/enums';
import { PropertySettingValue, Property, PropertyError } from '../../../../models';

@Component({
  selector: 'avc-property-item',
  templateUrl: './property-item.component.html',
  styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent implements OnInit {
  @Input() groupName: string;
  @Input() property: Property;
  @Input() value: any;
  @Input() error: string | PropertyError;

  @Output() valueChanged = new EventEmitter<PropertySettingValue>();
  @Output() complexPropertyChanged = new EventEmitter<any>();
  @Output() clearComplexErrors = new EventEmitter();

  propertiesArray: PropertyArrayType[] = [];
  complexValues: any;

  ngOnInit(): void {
    if (this.property.IsArray) {
      if (this.value?.length) {
        this.value.forEach(value => this.propertiesArray.push({ value }));
        if (this.property.Type === PropertyType.Complex) {
          this.complexValues = this.value.map(value =>
            value[Object.keys(value)[0]].toLowerCase().trim()
          );
        }
      } else if (this.property.Type !== PropertyType.Complex) {
        this.addProperty();
      }
    }
  }

  addProperty(): void {
    this.propertiesArray.push({ value: '', isNew: true });
  }

  removeProperty(prop: PropertyArrayType): void {
    this.propertiesArray.splice(this.propertiesArray.indexOf(prop), 1);

    const values = this.propertiesArray.map(obj => obj.value);
    this.emitArrayValues(values);
  }

  complexModalClosed(saved: boolean, prop: { isNew: boolean; value: any }): void {
    if (prop?.isNew) {
      saved ? (prop.isNew = false) : this.propertiesArray.pop();
    }

    this.clearComplexErrors.emit();
  }

  propertyArrayChanged({ value, index }): void {
    this.propertiesArray[index].value = value;

    const values = this.propertiesArray
      .filter(item => typeof item !== 'undefined')
      .map(obj => obj.value);
    this.emitArrayValues(values);
  }

  emitArrayValues(value: any[]): void {
    this.valueChanged.emit({ value, name: this.property.Name, property: this.property });
  }
}

interface PropertyArrayType {
  value: string;
  isNew?: boolean;
}
