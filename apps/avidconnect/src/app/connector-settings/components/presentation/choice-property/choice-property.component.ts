import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Choice, Property } from '../../../../models';
import { ConnectorSettingsState } from '../../../connector-settings.state';
import { CustomErrorStateMatcher, hasErrors } from '../../../services/schema-helper.service';

@Component({
  selector: 'avc-choice-property',
  templateUrl: './choice-property.component.html',
  styleUrls: ['./choice-property.component.scss'],
})
export class ChoicePropertyComponent implements OnInit, OnChanges {
  @Input() property: Property;
  @Input() value: any;
  @Input() error: string;
  @Output() choiceChanged = new EventEmitter<string>();
  choice$: Observable<Choice>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  multiSelectedValues: string[] = [];
  propertyFormControl: UntypedFormControl;
  matcher = new CustomErrorStateMatcher();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.choice$ = this.store.select(ConnectorSettingsState.getChoiceProperty).pipe(
      first(),
      map(filterFn => filterFn(this.property.ChoiceType))
    );

    this.multiSelectedValues =
      this.value
        ?.split(',')
        .map(i => i.trim())
        .filter(i => i) || [];

    this.propertyFormControl = new UntypedFormControl(this.value, {
      validators: [hasErrors.bind(this)],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const error = changes.error?.currentValue ? { error: true } : null;
    this.propertyFormControl?.setErrors(error);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.multiSelectedValues.push(value);
    }

    event.chipInput?.clear();
  }

  remove(value: string): void {
    const index = this.multiSelectedValues.indexOf(value);

    if (index >= 0) {
      this.multiSelectedValues.splice(index, 1);
    }

    this.choiceChanged.emit(this.multiSelectedValues.join(','));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.multiSelectedValues.push(event.option.value);
    this.choiceChanged.emit(this.multiSelectedValues.join(','));
  }

  checkBoxChanged(checked: boolean, value: string): void {
    if (checked && !this.multiSelectedValues.includes(value)) {
      this.multiSelectedValues.push(value);
    }
    if (!checked && this.multiSelectedValues.includes(value)) {
      this.multiSelectedValues.splice(this.multiSelectedValues.indexOf(value), 1);
    }

    this.choiceChanged.emit(this.multiSelectedValues.join(','));
  }
}
