import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { formGroupInstanceStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';

import { TextBoxComponent } from './text-box.component';

const fieldModelStub = {
  key: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
  value: 'mockValue',
  required: true,
};

describe('TextBoxComponent', () => {
  let component: TextBoxComponent;
  let fixture: ComponentFixture<TextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextBoxComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxComponent);
    component = fixture.componentInstance;
    component.formGroupInstance = formGroupInstanceStub;
    component.fieldModel = fieldModelStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enableDisableField()', () => {
    describe('when disabled is true', () => {
      beforeEach(() => {
        component.disabled = true;
        component.enableDisableField();
      });

      it('should disabled form control', () =>
        expect(
          component.formGroupInstance.get(DocumentLabelKeys.nonLookupLabels.InvoiceAmount).disabled
        ).toBeTruthy());
    });

    describe('when disabled is false', () => {
      beforeEach(() => {
        component.disabled = false;
        component.enableDisableField();
      });

      it('should enable form control', () =>
        expect(
          component.formGroupInstance.get(DocumentLabelKeys.nonLookupLabels.InvoiceAmount).enabled
        ).toBeTruthy());
    });
  });

  describe('onblur()', () => {
    describe('when having a fieldModel', () => {
      beforeEach(() => {
        jest.spyOn(component.onBlur, 'emit').mockImplementation();
        jest.spyOn(component.isValid, 'emit').mockImplementation();
        component.onblur('mockValue');
      });

      it('should emit value for onBlur emitter', () =>
        expect(component.onBlur.emit).toHaveBeenCalledWith('mockValue'));

      it('should emit false for isvalid emitter', () =>
        expect(component.isValid.emit).toHaveBeenCalledWith(false));
    });

    describe('when not having a fieldModel', () => {
      beforeEach(() => {
        jest.spyOn(component.onBlur, 'emit').mockImplementation();
        jest.spyOn(component.isValid, 'emit').mockImplementation();
        component.fieldModel = null;
        component.onblur('mockValue');
      });

      it('should emit value for onBlur emitter', () =>
        expect(component.onBlur.emit).toHaveBeenCalledWith('mockValue'));

      it('should not emit for isvalid emitter', () =>
        expect(component.isValid.emit).not.toHaveBeenCalled());
    });
  });

  describe('onfocus()', () => {
    const selectStub = jest.fn();

    const eventStub = {
      target: {
        select: selectStub,
        value: 'mockValue',
      } as any,
    } as MouseEvent;

    beforeEach(() => {
      jest.spyOn(component.onFocus, 'emit').mockImplementation();
      component.onfocus(eventStub);
    });

    it('should select any text in input', () => expect(selectStub).toHaveBeenCalledTimes(1));

    it('should emit value for onFocus emitter', () =>
      expect(component.onFocus.emit).toHaveBeenCalledWith('mockValue'));
  });

  describe('handleOnKeyUp()', () => {
    describe('when having a fieldModel', () => {
      beforeEach(() => {
        jest.spyOn(component.onKeyUp, 'emit').mockImplementation();
        jest.spyOn(component.isValid, 'emit').mockImplementation();
        component.handleOnKeyUp('mockValue');
      });

      it('should emit value for onKeyUp emitter', () =>
        expect(component.onKeyUp.emit).toHaveBeenCalledWith('mockValue'));

      it('should emit false for isvalid emitter', () =>
        expect(component.isValid.emit).toHaveBeenCalledWith(false));
    });

    describe('when not having a fieldModel', () => {
      beforeEach(() => {
        jest.spyOn(component.onKeyUp, 'emit').mockImplementation();
        jest.spyOn(component.isValid, 'emit').mockImplementation();
        component.fieldModel = null;
        component.handleOnKeyUp('mockValue');
      });

      it('should emit value for onKeyUp emitter', () =>
        expect(component.onKeyUp.emit).toHaveBeenCalledWith('mockValue'));

      it('should not emit for isvalid emitter', () =>
        expect(component.isValid.emit).not.toHaveBeenCalled());
    });
  });
});
