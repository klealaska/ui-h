import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { TextareaComponent } from './textarea.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    component.control = new FormControl({ value: '', disabled: false });
    component.id = 'labelFor';
    component.label = 'Dropdown Label';
    component.placeholder = 'Placeholder';
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
  });

  describe('disabled', () => {
    it('should not contain the disabled class', () => {
      const textarea = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-textarea"]').disabled
      );
      expect(textarea).toBeFalsy();
    });
    it('should contain the disabled class', () => {
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();
      const textarea = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-textarea"]').disabled
      );
      expect(textarea).toBeTruthy();
    });
  });

  describe('placeholder', () => {
    it('should contain a placeholder', () => {
      const textarea = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-textarea"]')
      );
      expect(textarea.placeholder).toEqual('Placeholder');
    });
  });

  describe('applyFilter', () => {
    it('should trigger applyFilter function and emit textareaValueEvent', async () => {
      const event = new KeyboardEvent('keyup');
      const spy = jest.spyOn(component.textareaValueEvent, 'emit');
      const textarea = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-textarea"]')
      );
      textarea.dispatchEvent(event);

      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should call applyFilter and emit data with undefined', async () => {
      const event = undefined;
      const spy = jest.spyOn(component.textareaValueEvent, 'emit');

      component.applyFilter(event);
      fixture.detectChanges();

      expect(spy).toBeCalledWith(undefined);
    });
  });
});
