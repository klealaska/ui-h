import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { first } from 'rxjs';

import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  const mockData = {
    id: 'labelFor',
    label: 'Default Label',
    placeholder: 'Placeholder',
    hintMessage: 'hint',
    error: { message: 'Error Message' },
    options: [
      {
        text: 'Option 1',
        value: '1',
      },
      {
        text: 'Option 2',
        value: '2',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.id = mockData.id;
    component.label = mockData.label;
    component.placeholder = mockData.placeholder;
    component.hintMessage = mockData.hintMessage;
    component.error = mockData.error;
    component.control = new FormControl({ value: '', disabled: false }, Validators.required);
    component.options = mockData.options;
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

  describe('placeholder', () => {
    it('should contain a placeholder', () => {
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-autocomplete"]')
      );
      expect(input.placeholder).toEqual('Placeholder');
    });
  });

  describe('disabled', () => {
    it('should not contain the disabled class', () => {
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-autocomplete"]')
      );
      expect(input.disabled).toBeFalsy();
    });
    it('should contain the disabled class', () => {
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();

      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-autocomplete"]')
      );
      expect(input.disabled).toBeTruthy();
    });
  });

  describe('options', () => {
    it('should emit option', () => {
      jest.spyOn(component.selectEvent, 'emit');
      fixture.nativeElement.querySelector('[data-test="ax-autocomplete"]');

      const autocomplete = fixture.nativeElement.querySelector('[data-test="ax-autocomplete"]');
      autocomplete.click();

      fixture.detectChanges();
      const option = fixture.debugElement.query(By.css('.mat-mdc-option'));
      option.nativeElement.click();

      expect(component.selectEvent.emit).toHaveBeenCalled();
    });
    it('filterOptions should return all items in options', async () => {
      await expect(component.filterOptions.pipe(first()).toPromise()).resolves.toEqual(
        mockData.options
      );
    });
    it('filterOptions should return empty array', async () => {
      component.options = [
        {
          text: undefined,
          value: '1',
        },
      ];
      component.ngOnInit();
      fixture.detectChanges();

      await expect(component.filterOptions.pipe(first()).toPromise()).resolves.toEqual([]);
    });

    it('filterOptions should return empty array', async () => {
      component.options = [undefined];
      component.ngOnInit();
      fixture.detectChanges();

      await expect(component.filterOptions.pipe(first()).toPromise()).resolves.toEqual([]);
    });
    it('filterOptions should be empty', async () => {
      component.options = undefined;
      component.ngOnInit();
      fixture.detectChanges();

      await expect(component.filterOptions.pipe(first()).toPromise()).resolves.toBeFalsy();
    });
  });
});
