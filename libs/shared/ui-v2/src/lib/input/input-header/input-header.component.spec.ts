import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHeaderComponent } from './input-header.component';
import { FormControl, Validators } from '@angular/forms';

describe('InputHeaderComponent', () => {
  let component: InputHeaderComponent;
  let fixture: ComponentFixture<InputHeaderComponent>;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(InputHeaderComponent);
    component = fixture.componentInstance;
    component.id = 'LabelFor';
    component.label = 'Input Label';
    component.optional = false;
    component.control = new FormControl({ value: '', disabled: false }, [Validators.required]);
    component.tooltip = {
      tooltipText: 'test',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('readonly', () => {
    it('should not have readonly class', () => {
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.classList.contains('ax-input__header-label-readonly')).toBeFalsy();
    });

    it('should have readonly class', () => {
      component.readonly = true;
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();

      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.classList.contains('ax-input__header-label-readonly')).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('should not have disabled class', () => {
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.classList.contains('ax-input__header-label-disabled')).toBeFalsy();
    });

    it('should have disabled class', () => {
      component.control = new FormControl({ value: '', disabled: true });
      fixture.detectChanges();

      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.classList.contains('ax-input__header-label-disabled')).toBeTruthy();
    });
  });

  describe('astrisk', () => {
    it('should display astrisk', () => {
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.classList.contains('ax-input__header-label-asterisk')).toBeTruthy();
    });
    it('should not display astrisk', () => {
      component.control = new FormControl({ value: '', disabled: false }, [Validators.email]);
      component.ngOnInit();
      fixture.detectChanges();
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.classList.contains('ax-input__header-label-asterisk')).toBeFalsy();
    });
  });

  describe('id', () => {
    it('label should contain a "for" attribute of id', () => {
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.getAttribute('for')).toEqual('LabelFor');
    });
  });

  describe('label', () => {
    it('should have a label without optional text', () => {
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      const optional = fixture.nativeElement.querySelector('.ax-input__header-optional');
      expect(inputLabel.textContent).toEqual('Input Label');
      expect(optional).toBeFalsy();
    });

    it('should have a label with optional text', () => {
      component.optional = true;
      fixture.detectChanges();

      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel.textContent).toEqual('Input Label(optional)');
    });

    it('should not have a label', () => {
      component.label = '';
      fixture.detectChanges();
      const inputLabel = fixture.nativeElement.querySelector('.ax-input__header-label');
      expect(inputLabel).toBeFalsy();
    });
  });

  describe('tooltip', () => {
    it('should have a tooltip', () => {
      const tooltip = fixture.nativeElement.querySelector('.ax-input__header-tooltip');
      expect(tooltip).toBeTruthy();
    });

    it('should not have a tooltip', () => {
      component.tooltip = undefined;
      fixture.detectChanges();
      const tooltip = fixture.nativeElement.querySelector('.ax-input__header-tooltip');
      expect(tooltip).toBeFalsy();
    });
  });
});
