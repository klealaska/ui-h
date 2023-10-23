import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { InputComponent } from './input.component';
import { SimpleChange } from '@angular/core';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl({ value: '', disabled: false });
    component.id = 'LabelFor';
    component.label = 'Input Label';
    component.placeholder = 'Placeholder';
    component.leftIcon = 'add';
    component.rightIcon = 'add';
    component.hintMessage = 'hint';
    component.error = { message: 'Error Message' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fixed', () => {
    it('should apply the "fixed-width" class to host when fixed is true', () => {
      component.fixed = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains('fixed-width')).toBeTruthy();
    });
  });

  describe('readonly', () => {
    it('should apply the "readonly" class to host', () => {
      component.readonly = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains('ax-form-field-readonly')).toBeTruthy();
    });

    it('should check if readonly changed', () => {
      component.readonly = true;
      component.ngOnChanges({
        readonly: new SimpleChange(false, component.readonly, component.readonly),
      });
      fixture.detectChanges();
      expect(component.control.disabled).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('should not contain the disabled attr', () => {
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-input"]').disabled
      );
      expect(input).toBeFalsy();
    });
    it('should contain the disabled attr', () => {
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-input"]').disabled
      );
      expect(input).toBeTruthy();
    });
  });

  describe('placeholder', () => {
    it('should contain a placeholder', () => {
      const input = <HTMLInputElement>fixture.nativeElement.querySelector('[data-test="ax-input"]');
      expect(input.placeholder).toEqual('Placeholder');
    });
  });

  describe('inputType', () => {
    it('should contain a placeholder', () => {
      const input = <HTMLInputElement>fixture.nativeElement.querySelector('[data-test="ax-input"]');
      expect(input.type).toEqual('text');
    });

    it('should contain a placeholder', () => {
      component.inputType = 'password';
      fixture.detectChanges();

      const input = <HTMLInputElement>fixture.nativeElement.querySelector('[data-test="ax-input"]');
      expect(input.type).toEqual('password');
    });
  });

  describe('leftIcon', () => {
    it('should contain an icon to the left of the input', () => {
      const leftIcon = fixture.nativeElement.querySelector('[data-test="ax-input-icon-left"]');
      expect(leftIcon).toBeTruthy();
    });
    it('should not contain an icon to the left of the input', () => {
      component.leftIcon = '';
      fixture.detectChanges();
      const leftIcon = fixture.nativeElement.querySelector('[data-test="ax-input-icon-left"]');
      expect(leftIcon).toBeFalsy();
    });
  });

  describe('leftIconButton', () => {
    it('should contain a button with icon to the left of the input', () => {
      component.leftIconButton = true;
      fixture.detectChanges();
      const buttonIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-left"]');
      expect(buttonIcon).toBeTruthy();
    });
    it('should not contain a button with icon to the left of the input', () => {
      component.leftIcon = '';
      component.leftIconButton = true;
      fixture.detectChanges();
      const buttonIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-left"]');
      expect(buttonIcon).toBeFalsy();
    });
    it('should not contain a button with icon to the left of the input', () => {
      component.leftIconButton = false;
      fixture.detectChanges();
      const buttonIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-left"]');
      expect(buttonIcon).toBeFalsy();
    });
  });

  describe('rightIcon', () => {
    it('should contain an icon to the right of the input', () => {
      const rightIcon = fixture.nativeElement.querySelector('[data-test="ax-input-icon-right"]');
      expect(rightIcon).toBeTruthy();
    });
    it('should not contain an icon to the right of the input', () => {
      component.rightIcon = '';
      fixture.detectChanges();
      const rightIcon = fixture.nativeElement.querySelector('[data-test="ax-input-icon-right"]');
      expect(rightIcon).toBeFalsy();
    });
  });

  describe('rightIconButton', () => {
    it('should contain a button with icon to the right of the input', () => {
      component.rightIconButton = true;
      fixture.detectChanges();
      const buttonIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-right"]');
      expect(buttonIcon).toBeTruthy();
    });
    it('should not contain a button with icon to the right of the input', () => {
      component.rightIcon = '';
      component.rightIconButton = true;
      fixture.detectChanges();
      const buttonIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-right"]');
      expect(buttonIcon).toBeFalsy();
    });
    it('should not contain a button with icon to the right of the input', () => {
      component.rightIconButton = false;
      fixture.detectChanges();
      const buttonIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-right"]');
      expect(buttonIcon).toBeFalsy();
    });
  });

  describe('leftIconButtonEvent', () => {
    it('should emit option', () => {
      component.leftIconButton = true;
      fixture.detectChanges();
      jest.spyOn(component.leftIconButtonEvent, 'emit');

      const inputIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-left"]');
      inputIcon.click();

      expect(component.leftIconButtonEvent.emit).toHaveBeenCalled();
    });
  });

  describe('rightIconButtonEvent', () => {
    it('should emit option', () => {
      component.rightIconButton = true;
      fixture.detectChanges();
      jest.spyOn(component.rightIconButtonEvent, 'emit');

      const inputIcon = fixture.nativeElement.querySelector('[data-test="ax-input-button-right"]');
      inputIcon.click();

      expect(component.rightIconButtonEvent.emit).toHaveBeenCalled();
    });
  });

  describe('inputValueEvent', () => {
    it('should trigger applyFilter function and emit.inputValueEvent', async () => {
      const event = new KeyboardEvent('keyup');
      const spy = jest.spyOn(component.inputValueEvent, 'emit');
      const input = <HTMLInputElement>fixture.nativeElement.querySelector('[data-test="ax-input"]');
      input.dispatchEvent(event);

      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should call applyFilter and emit data with undefined', async () => {
      const event = undefined;
      const spy = jest.spyOn(component.inputValueEvent, 'emit');

      component.applyFilter(event);
      fixture.detectChanges();

      expect(spy).toBeCalledWith(undefined);
    });
  });
});
