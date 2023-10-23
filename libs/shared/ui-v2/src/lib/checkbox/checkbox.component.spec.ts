import {
  ChangeDetectorRef,
  Component,
  DebugElement,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';

import { CheckboxComponent } from './checkbox.component';
import { CommonModule } from '@angular/common';

describe('CheckboxComponent', () => {
  let checkbox: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  let label: DebugElement;

  let checkboxInput: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    checkbox = fixture.componentInstance;
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
    checkboxInput = fixture.debugElement.query(By.css('input'));
    label = fixture.debugElement.query(By.css('.text'));
  });

  it('should create', () => {
    expect(checkbox).toBeTruthy();
  });

  it('Setting disabled to true disables checkbox input', fakeAsync(() => {
    checkbox.disabled = true;
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    console.log(checkboxInput.nativeElement.disabled);
    expect(checkboxInput.nativeElement.attributes.disabled).toContain['disabled'];
  }));

  it('Setting disabled to false enables checkbox input', () => {
    checkbox.disabled = false;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.attributes.disabled).not.toContain['disabled'];
  });

  it('Setting checked to true makes checkbox input checked', () => {
    checkbox.checked = true;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.attributes.checked).toContain['checked'];
  });

  it('Setting checked to false makes checkbox input unchecked', () => {
    checkbox.checked = false;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBeFalsy();
  });

  it('should change value to opposite when clicked', () => {
    label.nativeElement.click();
    fixture.detectChanges();

    expect(checkbox.checked).toEqual(true);

    label.nativeElement.click();
    fixture.detectChanges();

    expect(checkbox.checked).toEqual(false);
  });

  it('should reset indeterminate state when clicked on unchecked checkbox', () => {
    checkbox.indeterminate = true;
    fixture.detectChanges();

    expect(checkbox.indeterminate).toEqual(true);

    label.nativeElement.click();
    fixture.detectChanges();
    expect(checkbox.indeterminate).toEqual(false);
  });

  it('should reset indeterminate state when clicked on unchecked checkbox', () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;
    fixture.detectChanges();

    expect(checkbox.indeterminate).toEqual(true);

    label.nativeElement.click();
    fixture.detectChanges();
    expect(checkbox.indeterminate).toEqual(false);
  });

  it('should set value of function', () => {
    const foo = () => undefined;
    checkbox.registerOnTouched(foo);
    checkbox.registerOnChange(foo);
    expect(checkbox.onChange).toEqual(foo);
    expect(checkbox.onTouched).toEqual(foo);
  });

  it('should call change detector', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = jest.spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');
    checkbox.writeValue(true);
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should set value of `disabled` to be FALSE', () => {
    checkbox.setDisabledState(false);
    expect(checkbox.disabled).toBeFalsy();
  });
});

/** Test component with reactive forms */
@Component({
  template: `<ax-checkbox [formControl]="formControl"></ax-checkbox>`,
})
class CheckboxWithFormControlComponent {
  formControl = new FormControl();
}

describe('Component: Checkbox with form control', () => {
  let fixture: ComponentFixture<CheckboxWithFormControlComponent>;
  let checkboxComponent: DebugElement;
  let checkboxInstance: CheckboxComponent;
  let testComponent: CheckboxWithFormControlComponent;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CheckboxComponent],
      declarations: [CheckboxWithFormControlComponent],
    });

    fixture = TestBed.createComponent(CheckboxWithFormControlComponent);
    fixture.detectChanges();

    checkboxComponent = fixture.debugElement.query(By.directive(CheckboxComponent));
    checkboxInstance = checkboxComponent.componentInstance;
    testComponent = fixture.debugElement.componentInstance;
    inputElement = <HTMLInputElement>checkboxComponent.nativeElement.querySelector('input');
  });

  it('Toggling form control disabled state properly toggles checkbox input', () => {
    expect(checkboxInstance.disabled).toBeFalsy();

    testComponent.formControl.disable();
    fixture.detectChanges();

    expect(checkboxInstance.disabled).toBeTruthy();
    expect(inputElement.disabled).toBeTruthy();

    testComponent.formControl.enable();
    fixture.detectChanges();

    expect(checkboxInstance.disabled).toBeFalsy();
    expect(inputElement.disabled).toBeFalsy();
  });

  it('should mark touched on blur', () => {
    expect(testComponent.formControl.touched).toEqual(false);

    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(testComponent.formControl.touched).toEqual(true);
  });
});

@Component({
  template: `
    <ax-checkbox-group>
      <ax-checkbox [(ngModel)]="optionA" value="optionA"></ax-checkbox>
      <ax-checkbox [(ngModel)]="optionB" value="optionB"></ax-checkbox>
    </ax-checkbox-group>
  `,
})
export class CheckboxWithDynamicValuesTestComponent {
  checkboxValues: number[] = [];
  showCheckbox = true;
  optionA;
  optionB;

  @ViewChild(CheckboxGroupComponent) checkboxGroupComponent: CheckboxGroupComponent;
  @ViewChildren(CheckboxComponent) checkboxComponents: QueryList<CheckboxComponent>;
}

@Component({
  template: `
    <ax-checkbox-group #firstGroup name="1">
      <ax-checkbox checked></ax-checkbox>
    </ax-checkbox-group>
    <ax-checkbox-group #secondGroup name="2">
      <ax-checkbox checked></ax-checkbox>
    </ax-checkbox-group>
  `,
})
export class TwoCheckboxGroupsComponent {
  @ViewChild('firstGroup', { read: CheckboxGroupComponent }) firstGroup: CheckboxGroupComponent;
  @ViewChild('secondGroup', { read: CheckboxGroupComponent }) secondGroup: CheckboxGroupComponent;
  @ViewChildren(CheckboxComponent, { read: ElementRef }) checkboxes: QueryList<ElementRef>;
}

@Component({
  template: `
    <ax-checkbox-group name="1" [formControl]="control">
      <ax-checkbox></ax-checkbox>
      <ax-checkbox></ax-checkbox>
    </ax-checkbox-group>
  `,
})
export class FormsIntegrationComponent {
  @ViewChild(CheckboxComponent) checkboxGroup: CheckboxComponent;
  control = new FormControl({ value: '1', disabled: true });
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <ax-checkbox-group formControlName="checkboxGroup"></ax-checkbox-group>
    </form>
  `,
})
export class TestCheckboxGroupFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      checkboxGroup: [
        [
          { label: 'Apple', value: 'Apple', checked: true },
          { label: 'Pear', value: 'Pear', disabled: true },
          { label: 'Orange', value: 'Orange' },
        ],
      ],
    });
  }

  disable(): void {
    this.formGroup.disable();
  }
}

describe('CheckboxGroupComponent', () => {
  let fixture: ComponentFixture<CheckboxWithDynamicValuesTestComponent>;
  let checkboxGroupFixture: ComponentFixture<TestCheckboxGroupFormComponent>;
  let checkboxGroupTestComp: TestCheckboxGroupFormComponent;
  let checkboxTestComponent: CheckboxWithDynamicValuesTestComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxGroupComponent,
        CheckboxComponent,
      ],
      declarations: [
        CheckboxWithDynamicValuesTestComponent,
        TwoCheckboxGroupsComponent,
        FormsIntegrationComponent,
        TestCheckboxGroupFormComponent,
      ],
    });

    fixture = TestBed.createComponent(CheckboxWithDynamicValuesTestComponent);
    checkboxGroupFixture = TestBed.createComponent(TestCheckboxGroupFormComponent);
    checkboxTestComponent = fixture.componentInstance;
    checkboxGroupTestComp = checkboxGroupFixture.componentInstance;
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
  }));

  it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
    flush();
    expect(checkboxGroupTestComp?.formGroup?.get('checkboxGroup')?.valid).toBe(true);
    expect(checkboxGroupTestComp?.formGroup?.get('checkboxGroup').pristine).toBe(true);
  }));

  it('should set value of function in Checkbox Group', () => {
    const foo = () => undefined;
    fixture.componentInstance.checkboxGroupComponent.registerOnChange(foo);
    fixture.componentInstance.checkboxGroupComponent.registerOnChange(foo);
    expect(fixture.componentInstance.checkboxGroupComponent.onChange).toEqual(foo);
  });

  it('should call change detector in checkbox group', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = jest.spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');
    fixture.componentInstance.checkboxGroupComponent.writeValue(true);
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should set value of `disabled` to be false', () => {
    fixture.componentInstance.checkboxGroupComponent.setDisabledState(false);
    expect(fixture.componentInstance.checkboxGroupComponent.disabled).toBeFalsy();
  });
});
