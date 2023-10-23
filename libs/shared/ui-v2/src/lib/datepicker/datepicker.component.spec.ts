import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;
  let loader: HarnessLoader;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.control = new FormControl({ value: '', disabled: false });
    component.id = 'LabelFor';
    component.label = 'Input Label';
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

  describe('placeholder', () => {
    it('should contain a placeholder', () => {
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-datepicker"]')
      );
      expect(input.placeholder).toEqual('Placeholder');
    });
  });

  describe('disabled', () => {
    it('should not contain the disabled attr', () => {
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-datepicker"]').disabled
      );
      expect(input).toBeFalsy();
    });
    it('should contain the disabled attr', () => {
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();
      const input = <HTMLInputElement>(
        fixture.nativeElement.querySelector('[data-test="ax-datepicker"]').disabled
      );
      expect(input).toBeTruthy();
    });
  });

  describe('Date Panel', () => {
    it('should call dateClass function', async () => {
      const spy = jest.spyOn(component, 'dateClass');
      const harness = await loader.getHarness(MatDatepickerInputHarness);
      await harness.openCalendar();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dataChange', () => {
    it('should trigger applyFilter function and emit.inputValueEvent', async () => {
      const spy = jest.spyOn(component.dateInput, 'emit');
      const harness = await loader.getHarness(MatDatepickerInputHarness);
      await harness.setValue('01/01/2023');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dataInput', () => {
    it('should trigger applyFilter function and emit.inputValueEvent', async () => {
      const spy = jest.spyOn(component.dateChange, 'emit');
      const harness = await loader.getHarness(MatDatepickerInputHarness);
      await harness.setValue('01/01/2023');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });
});
