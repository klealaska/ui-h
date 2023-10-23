import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import { FormControl, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    component.id = 'labelFor';
    component.label = 'Dropdown Label';
    component.placeholder = 'Placeholder';
    component.hintMessage = 'hint';
    component.error = { message: 'Error Message' };
    component.control = new FormControl({ value: '', disabled: false }, Validators.required);
    component.options = [
      {
        text: 'Option 1',
        value: '1',
      },
      {
        text: 'Option 2',
        value: '2',
      },
    ];
    fixture.detectChanges();
  });

  // Sets the offsetWidth to 100
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 100 });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
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
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.mat-form-field-disabled')).toBeFalsy();
    });
    it('should contain the disabled class', () => {
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.mat-form-field-disabled')).toBeTruthy();
    });
  });

  describe('placeholder', () => {
    it('should contain a placeholder', () => {
      const placeholder = fixture.nativeElement.querySelector('.mat-mdc-select-placeholder');
      expect(placeholder.textContent).toEqual('Placeholder');
    });
  });

  describe('options', () => {
    it('should emit option', () => {
      jest.spyOn(component.selectEvent, 'emit');

      const dropdown = fixture.debugElement.query(By.css('.ax-select'));
      dropdown.nativeElement.click();

      fixture.detectChanges();
      const option = fixture.debugElement.query(By.css('.mat-mdc-option'));
      option.nativeElement.click();

      expect(component.selectEvent.emit).toHaveBeenCalled();
    });
  });
});
