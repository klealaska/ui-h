import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ThemePalette } from '@angular/material/core';
import type { MatOption } from '@angular/material/core';
import type { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { DropdownOption, DropdownOptionGroup } from '../../shared/models';

@Component({
  selector: 'ax-mat-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  // form field specific inputs
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() color: ThemePalette;
  @Input() floatLabel: FloatLabelType;
  @Input() hideRequiredMarker: boolean;
  @Input() hintLabel: string;
  @Input() fieldWidth: string;

  // select specific inputs
  @Input('aria-label') ariaLabel: string;
  @Input('aria-labelledby') ariaLabelledby: string;
  @Input() disableOptionCentering: boolean;
  @Input() disableRipple: boolean;
  @Input() disabled: boolean;
  @Input() id: string;
  @Input() label: string;
  @Input() multiple: boolean;
  @Input() options: DropdownOption[];
  @Input() optionGroups: DropdownOptionGroup[];
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() sortComparator: (a: MatOption, b: MatOption, options: MatOption[]) => number;
  @Input() typeaheadDebounceInterval: number;
  @Input() value: any;

  @Output()
  openedChange = new EventEmitter<boolean>();
  @Output() selectionChange = new EventEmitter<any>();
}
