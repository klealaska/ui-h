import {
  ChangeDetectorRef,
  Component,
  DebugElement,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RadioButtonComponent } from './radio-button.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;
  let radioInput: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [RadioButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
    radioInput = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have radio button input["radio"]', () => {
    expect(radioInput).not.toBeNull();
  });

  it('should set value of `disabled` to be FALSE', () => {
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });

  it('should set value of `disabled` to TRUE', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
  });

  it('should set value of function', () => {
    const foo = () => undefined;
    component.registerOnTouched(foo);
    component.registerOnChange(foo);
    expect(component.onChange).toEqual(foo);
    expect(component.onTouched).toEqual(foo);
  });

  it('should stop event propagation', () => {
    const target = { value: 'OptionA' };
    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, 'target', { writable: false, value: target });
    const evt = jest.spyOn(clickEvent, 'stopPropagation');
    component.onInputChange(clickEvent);
    expect(evt).toHaveBeenCalled();
  });
  it('should call change detector', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = jest.spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');
    component.writeValue(true);
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should update value', () => {
    const target = { checked: true };
    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, 'target', { writable: false, value: target });
    component.onInputChange(clickEvent);
    fixture.detectChanges();
    expect(component.checked).toBeTruthy();
  });
});

@Component({
  selector: 'ax-radio-test',
  template: `
    <ax-radio-group [value]="value" (valueChange)="valueChange.emit($event)">
      <ax-radio-button value="1">1</ax-radio-button>
      <ax-radio-button value="2">2</ax-radio-button>
      <ax-radio-button value="3" disabled>3</ax-radio-button>
    </ax-radio-group>
  `,
})
export class RadioTestComponent {
  @Input() value;
  @Output() valueChange = new EventEmitter();
}

@Component({
  template: `
    <ax-radio-group>
      <ng-template [ngIf]="showRadios">
        <ax-radio-button *ngFor="let radio of radioValues" [value]="radio">{{
          radio
        }}</ax-radio-button>
      </ng-template>
    </ax-radio-group>
  `,
})
export class RadioWithDynamicValuesTestComponent {
  radioValues: number[] = [];
  showRadios = false;

  @ViewChild(RadioGroupComponent) radioGroupComponent: RadioGroupComponent;
  @ViewChildren(RadioButtonComponent) radioComponents: QueryList<RadioButtonComponent>;
}

@Component({
  template: `
    <ax-radio-group #firstGroup name="1">
      <ax-radio-button checked value="1"></ax-radio-button>
    </ax-radio-group>
    <ax-radio-group #secondGroup name="2">
      <ax-radio-button checked value="2"></ax-radio-button>
    </ax-radio-group>
  `,
})
export class TwoRadioGroupsComponent {
  @ViewChild('firstGroup', { read: RadioGroupComponent }) firstGroup: RadioGroupComponent;
  @ViewChild('secondGroup', { read: RadioGroupComponent }) secondGroup: RadioGroupComponent;
  @ViewChildren(RadioButtonComponent, { read: ElementRef }) radios: QueryList<ElementRef>;
}

@Component({
  template: `
    <ax-radio-group name="1" [formControl]="control">
      <ax-radio-button value="1"></ax-radio-button>
      <ax-radio-button value="2"></ax-radio-button>
    </ax-radio-group>
  `,
})
export class FormsIntegrationComponent {
  @ViewChild(RadioButtonComponent) radioGroup: RadioButtonComponent;
  control = new FormControl({ value: '1', disabled: true });
}

describe('radio', () => {
  let fixture: ComponentFixture<RadioTestComponent>;
  let comp: RadioTestComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RadioButtonComponent, RadioGroupComponent],
      declarations: [RadioTestComponent],
    });

    fixture = TestBed.createComponent(RadioTestComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
  }));

  it('should render radios', () => {
    const radios: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(RadioButtonComponent)
    );
    expect(radios.length).toBe(3);
  });

  it('should fire value when selected', done => {
    const secondRadio: DebugElement = fixture.debugElement.queryAll(
      By.directive(RadioButtonComponent)
    )[1];
    comp.valueChange.subscribe(value => {
      expect(value).toEqual(secondRadio.componentInstance.value);
      done();
    });
    const input = secondRadio.query(By.css('input'));
    input.nativeElement.click();
  });
});

describe('RadioGroupComponent', () => {
  let fixture: ComponentFixture<RadioWithDynamicValuesTestComponent>;
  let radioTestComponent: RadioWithDynamicValuesTestComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [RadioButtonComponent, RadioGroupComponent, FormsModule, ReactiveFormsModule],
      declarations: [
        RadioWithDynamicValuesTestComponent,
        TwoRadioGroupsComponent,
        FormsIntegrationComponent,
      ],
    });

    fixture = TestBed.createComponent(RadioWithDynamicValuesTestComponent);
    radioTestComponent = fixture.componentInstance;
    fixture.detectChanges();
    flush(); // promise with 'updateAndSubscribeToRadios'
    fixture.detectChanges(); // detect changes made during 'updateAndSubscribeToRadios'
  }));

  it('should update radio value when radios added after radio group initialization', fakeAsync(() => {
    radioTestComponent.radioValues = [1, 2, 3];
    radioTestComponent.showRadios = true;
    radioTestComponent.radioGroupComponent.value = 1;
    fixture.detectChanges(); // adds radios
    flush();
    fixture.detectChanges();

    expect(radioTestComponent.radioComponents.first.checked).toEqual(true);
    const otherRadios = radioTestComponent.radioComponents.toArray().slice(1);
    for (const radio of otherRadios) {
      expect(radio.checked).toEqual(false);
    }
  }));

  it('should update radio name when radios added after radio group initialization', fakeAsync(() => {
    const groupName = 'my-radio-group-name';
    radioTestComponent.radioValues = [1, 2, 3];
    radioTestComponent.showRadios = true;
    radioTestComponent.radioGroupComponent.name = groupName;
    fixture.detectChanges(); // adds radios
    flush();
    fixture.detectChanges();

    for (const radio of radioTestComponent.radioComponents.toArray()) {
      expect(radio.name).toEqual(groupName);
    }
  }));

  it('should update radio disabled state when radios added after radio group initialization', fakeAsync(() => {
    radioTestComponent.radioValues = [1, 2, 3];
    radioTestComponent.showRadios = true;
    radioTestComponent.radioGroupComponent.disabled = true;
    fixture.detectChanges(); // adds radios
    flush();
    fixture.detectChanges();

    for (const radio of radioTestComponent.radioComponents.toArray()) {
      expect(radio.disabled).toEqual(true);
    }
  }));

  it('should update radio value when radios change', fakeAsync(() => {
    radioTestComponent.showRadios = true;
    radioTestComponent.radioGroupComponent.value = 1;
    fixture.detectChanges();

    radioTestComponent.radioValues = [1, 2, 3];
    fixture.detectChanges(); // adds radios
    flush();
    fixture.detectChanges();

    expect(radioTestComponent.radioComponents.first.checked).toEqual(true);
    const otherRadios = radioTestComponent.radioComponents.toArray().slice(1);
    for (const radio of otherRadios) {
      expect(radio.checked).toBeFalsy();
    }
  }));

  it('should update radio name when radios change', fakeAsync(() => {
    const groupName = 'my-radio-group-name';
    radioTestComponent.showRadios = true;
    radioTestComponent.radioGroupComponent.name = groupName;
    fixture.detectChanges();

    radioTestComponent.radioValues = [1, 2, 3];
    fixture.detectChanges(); // adds radios
    flush();
    fixture.detectChanges();

    for (const radio of radioTestComponent.radioComponents.toArray()) {
      expect(radio.name).toEqual(groupName);
    }
  }));

  it('should update radio disabled state when radios change', fakeAsync(() => {
    radioTestComponent.showRadios = true;
    radioTestComponent.radioGroupComponent.disabled = true;
    fixture.detectChanges();

    radioTestComponent.radioValues = [1, 2, 3];
    fixture.detectChanges(); // adds radios
    flush();
    fixture.detectChanges();

    for (const radio of radioTestComponent.radioComponents.toArray()) {
      expect(radio.disabled).toEqual(true);
    }
  }));

  it('should disable radio group if form control is disabled', fakeAsync(() => {
    const radioFixture = TestBed.createComponent(FormsIntegrationComponent);
    radioFixture.detectChanges();

    const { radioGroup } = radioFixture.componentInstance;
    tick();

    expect(radioGroup.disabled).toEqual(true);
  }));
});
