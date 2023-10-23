import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { from, merge, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { RadioButtonComponent } from '../radio-button.component';
import { CommonModule } from '@angular/common';
import { MarkAsteriskDirective } from '@ui-coe/shared/util/directives';

@Component({
  imports: [CommonModule, MarkAsteriskDirective, RadioButtonComponent],
  selector: 'ax-radio-group',
  templateUrl: 'radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent implements AfterContentInit, OnDestroy, ControlValueAccessor {
  @Input() layout: string;
  @Input() labelHeading: string;
  @Input() showRequired = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ContentChildren(RadioButtonComponent, { descendants: true })
  radios: QueryList<RadioButtonComponent>;
  protected destroy$ = new Subject<void>();
  protected _value: any;
  protected _name: string;
  protected _disabled: boolean;
  protected onChange = (value: any) => {};
  protected onTouched = () => {};

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
    this.updateValues();
  }

  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    this.updateNames();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this.updateDisabled();
  }

  constructor() {}
  ngAfterContentInit() {
    // In case option 'name' isn't set on ax-radio-button component,
    // we need to set it's name right away, so it won't overlap with options
    // without names from other radio groups. Otherwise they all would have
    // same name and will be considered as options from one group so only the
    // last option will stay selected.
    this.updateNames();

    this.radios.changes
      .pipe(
        startWith(this.radios),
        // 'changes' emit during change detection run and we can't update
        // option properties right of since they already was initialized.
        // Instead we schedule microtask to update radios after change detection
        // run is finished and trigger one more change detection run.
        switchMap((radios: QueryList<RadioButtonComponent>) => from(Promise.resolve(radios))),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.updateAndSubscribeToRadios());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected updateAndSubscribeToRadios() {
    this.updateValueFromCheckedOption();
    this.updateNames();
    this.updateValues();
    this.updateDisabled();
    this.subscribeOnRadiosValueChange();
  }

  protected updateNames() {
    if (this.radios) {
      this.radios.forEach((radio: RadioButtonComponent) => radio._setName(this.name));
    }
  }

  protected updateValues() {
    this.updateAndMarkForCheckRadios(
      (radio: RadioButtonComponent) => (radio.checked = radio.value === this.value)
    );
  }

  protected updateDisabled() {
    if (typeof this.disabled !== 'undefined') {
      this.updateAndMarkForCheckRadios(
        (radio: RadioButtonComponent) => (radio.disabled = this.disabled)
      );
    }
  }

  protected subscribeOnRadiosValueChange() {
    if (!this.radios || !this.radios.length) {
      return;
    }

    merge(...this.radios.map((radio: RadioButtonComponent) => radio.valueChange))
      .pipe(takeUntil(merge(this.radios.changes, this.destroy$)))
      .subscribe((value: any) => {
        this.writeValue(value);
        this.propagateValue(value);
      });
  }

  protected propagateValue(value: any) {
    this.valueChange.emit(value);
    this.onChange(value);
  }

  protected updateAndMarkForCheckRadios(updateFn: (RadioButtonComponent) => void) {
    if (this.radios) {
      this.radios.forEach(radio => {
        updateFn(radio);
        radio._markForCheck();
      });
    }
  }

  protected updateValueFromCheckedOption() {
    const checkedRadio = this.radios.find(radio => radio.checked);
    const isValueMissing = this.value === undefined || this.value === null;
    if (checkedRadio && isValueMissing && checkedRadio.value !== this.value) {
      this.value = checkedRadio.value;
    }
  }
}
