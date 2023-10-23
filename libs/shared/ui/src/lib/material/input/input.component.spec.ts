import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fieldModelFormGroupStub, fieldModelStub } from '../../../../src/testing/test-stubs';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
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
    beforeEach(() => {
      jest.spyOn(component.onFocus, 'emit').mockImplementation();
      component.onfocus('mockValue');
    });

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
