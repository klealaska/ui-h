import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { from, merge, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { CheckboxComponent } from '../checkbox.component';
import { CommonModule } from '@angular/common';
import { MarkAsteriskDirective } from '@ui-coe/shared/util/directives';

@Component({
  selector: 'ax-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarkAsteriskDirective,
    CheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupComponent implements AfterContentInit, ControlValueAccessor {
  @Input() layout: string;
  @Input() labelHeading: string;
  @Input() showRequired = false;
  @ContentChildren(CheckboxComponent, { descendants: true })
  checkbox: QueryList<CheckboxComponent>;
  @Output() checkedChange: EventEmitter<any> = new EventEmitter();
  protected destroy$ = new Subject<void>();
  @Input() name: string;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this.updateDisabled();
  }

  // To make this control work with Form Controls for Reactive and template driven forms
  protected _disabled: boolean;
  constructor(private changeDetector: ChangeDetectorRef) {}
  ngAfterContentInit() {
    this.checkbox.changes
      .pipe(
        startWith(this.checkbox),
        switchMap((checkbox: QueryList<CheckboxComponent>) => from(Promise.resolve(checkbox))),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.subscribeOnValueChange());
  }

  onChange: any = () => undefined;
  onTouched: any = () => undefined;

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(val: any) {
    this.changeDetector.markForCheck();
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  protected updateDisabled() {
    if (typeof this.disabled !== 'undefined') {
      this.updateAndMarkForCheckbox(
        (checkbox: CheckboxComponent) => (checkbox.disabled = this.disabled)
      );
    }
  }

  protected subscribeOnValueChange() {
    if (!this.checkbox || !this.checkbox.length) {
      return;
    }

    merge(...this.checkbox.map((checkComp: CheckboxComponent) => checkComp.checkedChange))
      .pipe(takeUntil(merge(this.checkbox.changes, this.destroy$)))
      .subscribe((value: any) => {
        this.writeValue(value);
        this.propagateValue(value);
      });
  }

  protected propagateValue(value: any) {
    this.checkedChange.emit(value);
    this.onChange(value);
  }

  protected updateAndMarkForCheckbox(updateFn: (CheckboxComponent) => void) {
    if (this.checkbox) {
      this.checkbox.forEach(checkbox => {
        updateFn(checkbox);
        checkbox._markForCheck();
      });
    }
  }
}
