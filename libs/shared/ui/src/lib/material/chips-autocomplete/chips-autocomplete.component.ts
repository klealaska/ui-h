import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import { MatChipEvent, MatChipSelectionChange } from '@angular/material/chips';
import type { ThemePalette } from '@angular/material/core';
import type { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { axIconClose } from '../../assets/ax-icons.model';
import { Autocomplete } from '../../shared/models';

@Component({
  selector: 'ax-mat-chips-autocomplete',
  templateUrl: './chips-autocomplete.component.html',
  styleUrls: ['./chips-autocomplete.component.scss'],
})
export class ChipsAutocompleteComponent implements OnInit, OnChanges, OnDestroy {
  // MatFormField
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette;
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() hideRequiredMarker = false;
  @Input() hintLabel: string;
  @Input() hintAlign: 'start' | 'end' = 'end';

  // MatChip
  @Input() chipColor: ThemePalette = 'primary';
  @Input() chipDisableRipple: boolean;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() removable = true;
  @Input() selectable = true;
  @Input() selectedChip: boolean;
  @Input() value: any;
  @Output() destroyed = new EventEmitter<MatChipEvent>();
  @Output() removed = new EventEmitter<Autocomplete[]>();
  @Output() removedItem = new EventEmitter<Autocomplete>();
  @Output() selectionChange = new EventEmitter<MatChipSelectionChange>();

  // MatAutoComplete
  @Input() autoActiveFirstOption = false;
  @Input() disableRipple: boolean;
  @Input() displayWith: ((value: any) => string) | null;
  @Input() panelWidth: string | number;
  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();
  @Output() optionActivated = new EventEmitter<MatAutocompleteActivatedEvent>();
  @Output() itemSelected = new EventEmitter<Autocomplete>();
  @Output() optionSelected = new EventEmitter<Autocomplete[]>();

  @Input() placeholder = '';
  @Input() showRemainingHint = false;
  @Input() labelText: string;
  @Input() maxSelections = 0; // signifies unlimited
  @Input() minSearchLength = 1;
  @Input() debounceTime = 0;
  @Input() data: Autocomplete[];
  @Input() selectedItems: Autocomplete[] = [];
  @Output() filterTextChange = new EventEmitter<string>();

  @ViewChild('formInput') formInput: ElementRef<HTMLInputElement>;

  formCtrl = new UntypedFormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  closeImage = axIconClose.data;
  chosenItems: Autocomplete[];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.formCtrl.valueChanges
        .pipe(
          debounceTime(this.debounceTime),
          tap((value: string) => {
            if (value?.length > this.minSearchLength) {
              this.filterTextChange.emit(value);
            }
          })
        )
        .subscribe()
    );
    this.data = this.sortData([...this.data]);
    this.chosenItems = [...this.selectedItems];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.data = this.sortData([...changes.data.currentValue]);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  remove(item: Autocomplete): void {
    const index = this.chosenItems.findIndex(x => x.id === item.id);

    if (index > -1) {
      this.chosenItems.splice(index, 1);
    }

    this.removed.emit(this.chosenItems);
    this.removedItem.emit(item);
  }

  selected(item: Autocomplete): void {
    if (this.multiple) {
      if (this.maxSelections > 0 && this.chosenItems.length >= this.maxSelections) {
        return;
      }

      this.chosenItems.push(item);
    } else {
      this.chosenItems = [item];
    }

    this.formInput.nativeElement.value = '';
    this.formCtrl.setValue('');
    this.optionSelected.emit(this.chosenItems);
    this.itemSelected.emit(item);
  }

  private sortData(arrayToSort: Autocomplete[]): Autocomplete[] {
    return arrayToSort.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
}
