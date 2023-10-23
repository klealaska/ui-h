import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { fieldModelStub, fieldModelFormGroupStub } from '../../../testing/test-stubs';
import { AxTextBoxComponent } from './ax-text-box.component';

describe('AxTextBoxComponent', () => {
  let component: AxTextBoxComponent;
  let fixture: ComponentFixture<AxTextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxTextBoxComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxTextBoxComponent);
    component = fixture.componentInstance;
    component.formGroupInstance = fieldModelFormGroupStub;
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
        expect(component.formGroupInstance.get('mockKey').disabled).toBeTruthy());
    });

    describe('when disabled is false', () => {
      beforeEach(() => {
        component.disabled = false;
        component.enableDisableField();
      });

      it('should enable form control', () =>
        expect(component.formGroupInstance.get('mockKey').enabled).toBeTruthy());
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

      it('should emit true for isvalid emitter', () =>
        expect(component.isValid.emit).toHaveBeenCalledWith(true));
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

      it('should emit true for isvalid emitter', () =>
        expect(component.isValid.emit).toHaveBeenCalledWith(true));
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
