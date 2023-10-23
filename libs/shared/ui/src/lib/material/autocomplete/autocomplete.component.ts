import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  MatAutocompleteActivatedEvent,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import type { ThemePalette } from '@angular/material/core';
import type { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Autocomplete } from '../../shared/models/ax-autocomplete';

@Component({
  selector: 'ax-mat-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
  // MatAutoComplete
  @Input() autoActiveFirstOption = false;
  @Input() disableRipple: boolean;
  @Input() displayWith: ((value: any) => string) | null;
  @Input() panelWidth: string | number;
  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();
  @Output() optionActivated = new EventEmitter<MatAutocompleteActivatedEvent>();
  @Output() optionSelected = new EventEmitter<MatAutocompleteSelectedEvent>();

  // MatFormField
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette;
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() hideRequiredMarker = false;
  @Input() hintLabel: string;
  @Input() hintAlign: 'start' | 'end' = 'end';

  @Input() placeholder = '';
  @Input() labelText: string;
  @Input() data: Autocomplete[];

  formCtrl = new UntypedFormControl();
  filteredOptions: Observable<Autocomplete[]>;

  ngOnInit(): void {
    this.filteredOptions = this.formCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this.getFilteredOptions(value))
    );
  }

  private getFilteredOptions(value: string): Autocomplete[] {
    if (value) {
      return this.data.filter((option: Autocomplete) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    return this.data;
  }
}
