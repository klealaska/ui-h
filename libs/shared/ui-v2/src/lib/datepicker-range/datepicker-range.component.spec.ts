import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerRangeComponent } from './datepicker-range.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { FormControl } from '@angular/forms';

describe('DatepickerRangeComponent', () => {
  let component: DatepickerRangeComponent;
  let fixture: ComponentFixture<DatepickerRangeComponent>;
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

    fixture = TestBed.createComponent(DatepickerRangeComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.id = 'LabelFor';
    component.label = 'Input Label';
    component.hintMessage = 'hint';
    component.error = { message: 'Error Message' };
    component.disabled = false;
    component.startControl = new FormControl({ value: '', disabled: false });
    component.endControl = new FormControl({ value: '', disabled: false });
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
    it('Date input should not be disabled', async () => {
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      fixture.detectChanges();
      expect(await harness.isDisabled()).toBeFalsy();
    });
    it('Date input should be disabled', async () => {
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      component.disabled = true;
      component.ngOnInit();
      expect(await harness.isDisabled()).toBeTruthy();
    });
  });

  describe('startDataChange', () => {
    it('should trigger startDataChangeFunc and emit.startDataChange', async () => {
      const spy = jest.spyOn(component.startDataChange, 'emit');
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      await (await harness.getStartInput()).setValue('01/01/2023');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('startDateInput', () => {
    it('should trigger startDateInputFunc and emit.startDateInput', async () => {
      const spy = jest.spyOn(component.startDateInput, 'emit');
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      await (await harness.getStartInput()).setValue('01/01/2023');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Date Panel', () => {
    it('should call dateClass function', async () => {
      const spy = jest.spyOn(component, 'dateClass');
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      await harness.openCalendar();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('endDataChange', () => {
    it('should trigger endDataChangeFunc and emit.endDataChange', async () => {
      const spy = jest.spyOn(component.endDataChange, 'emit');
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      await (await harness.getEndInput()).setValue('01/01/2023');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('endDateInput', () => {
    it('should trigger endDateInputFunc and emit.endDateInput', async () => {
      const spy = jest.spyOn(component.endDateInput, 'emit');
      const harness = await loader.getHarness(MatDateRangeInputHarness);
      await (await harness.getEndInput()).setValue('01/01/2023');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });
  });
});
