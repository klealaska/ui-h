import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SlideToggleComponent } from './slide-toggle.component';

describe('SlideToggleComponent', () => {
  let component: SlideToggleComponent;
  let fixture: ComponentFixture<SlideToggleComponent>;
  let toggleInput: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(SlideToggleComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
    toggleInput = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should className correct', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.firstElementChild.classList).toContain(
      'toggle-switch'
    );
  });

  it('Setting `checked` to `false` makes toggle input off', () => {
    component.checked = false;
    fixture.detectChanges();
    expect(toggleInput.nativeElement.attributes.checked).not.toContain['checked'];
  });

  it('Setting `checked` to `true` makes toggle input on', () => {
    component.checked = true;
    fixture.detectChanges();
    expect(toggleInput.nativeElement.attributes.checked).toContain['checked'];
  });

  it('Setting `disabled` to `true` disables toggle input', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(toggleInput.nativeElement.attributes.disabled).toContain['disabled'];
  });

  it('Setting `disabled` to `false` enables toggle input', () => {
    component.disabled = false;
    fixture.detectChanges();
    expect(toggleInput.nativeElement.attributes.disabled).not.toContain['disabled'];
  });

  it('should return active text when true', () => {
    component.checked = true;
    component.subLabelConfig = {
      active: 'Yes',
      inactive: 'No',
    };
    fixture.detectChanges();
    expect(component.statusText).toBe('Yes');
  });
  it('should return active text when false', () => {
    component.checked = false;
    component.subLabelConfig = {
      active: 'Yes',
      inactive: 'No',
    };
    fixture.detectChanges();
    expect(component.statusText).toBe('No');
  });

  it('should set value of `disabled` to true', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
  });

  it('should set value of `disabled` to be false', () => {
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });

  it('should stop event propagation', () => {
    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });
    const evt = jest.spyOn(clickEvent, 'stopPropagation');
    component.onInputClick(clickEvent);
    expect(evt).toHaveBeenCalled();
  });

  it('should call change detector', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = jest.spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');
    component.writeValue(true);
    expect(component.checked).toBeTruthy();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should set value of function', () => {
    const foo = () => undefined;
    component.registerOnTouched(foo);
    component.registerOnChange(foo);
    expect(component.onChange).toEqual(foo);
    expect(component.onTouched).toEqual(foo);
  });

  it('should update value', () => {
    const target = { checked: true };
    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, 'target', { writable: false, value: target });
    const emitEvent = jest.spyOn(component.checkedChange, 'emit');
    component.updateValue(clickEvent);
    fixture.detectChanges();
    expect(component.checked).toBeTruthy();
    expect(emitEvent).toHaveBeenCalledWith(component.checked);
  });
});
