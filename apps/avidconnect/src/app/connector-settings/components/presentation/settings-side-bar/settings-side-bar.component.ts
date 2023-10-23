import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Errors, PropertyGroup } from '../../../../models';

@Component({
  selector: 'avc-settings-side-bar',
  templateUrl: './settings-side-bar.component.html',
  styleUrls: ['./settings-side-bar.component.scss'],
})
export class SettingsSideBarComponent {
  @Input() propertyGroups: PropertyGroup[];
  @Input() groupSelected: string;
  @Input() errors: Errors;

  @Output() propertyGroupSelected = new EventEmitter<PropertyGroup>();

  getErrorsCount(groupName: string): number | string {
    const errors = this.errors[groupName] || {};
    return Object.keys(errors).length || '';
  }
}
