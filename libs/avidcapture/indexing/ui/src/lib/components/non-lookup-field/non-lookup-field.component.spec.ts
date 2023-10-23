import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  fieldBaseStub,
  formGroupInstanceStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  indexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, FieldTypes, InputDataTypes } from '@ui-coe/avidcapture/shared/types';
import {
  DocumentFieldLabelComponent,
  MaskedInputComponent,
  TextBoxComponent,
} from '@ui-coe/avidcapture/shared/ui';
import { MockComponent } from 'ng-mocks';

import { NonLookupFieldComponent } from './non-lookup-field.component';

describe('NonLookupFieldComponent', () => {
  let component: NonLookupFieldComponent;
  let fixture: ComponentFixture<NonLookupFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NonLookupFieldComponent,
        MockComponent(MaskedInputComponent),
        MockComponent(TextBoxComponent),
        MockComponent(DocumentFieldLabelComponent),
      ],
      imports: [MatIconModule, MatButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonLookupFieldComponent);
    component = fixture.componentInstance;
    component.editMode = true;
    component.formGroupInstance = formGroupInstanceStub;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when doing a negative number check', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = '-$20.00';
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldStub;
        fixture.detectChanges();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));

      it('should set isNegativeNumber to true', () =>
        expect(component['isNegativeNumber']).toBeTruthy());

      it('should set labelTextColor to red', () => expect(component.labelTextColor).toBe('red'));

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when doing a negative number check & number is NOT negative', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = '$20.00';
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldStub;
        fixture.detectChanges();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));

      it('should set isNegativeNumber to true', () =>
        expect(component['isNegativeNumber']).toBeFalsy());

      it('should set labelTextColor to red', () =>
        expect(component.labelTextColor).toBe('default'));
    });

    describe('when formGroupInstance && field does NOT exist', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

      beforeEach(() => {
        component.formGroupInstance = null;
        component.field = fieldStub;
        fixture.detectChanges();
      });

      it('should keep isValid to true', () => expect(component.isValid).toBeTruthy());
    });

    describe('when formGroupInstance && fieldModel exist', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        fixture.detectChanges();
      });

      it('should set isValid to true', () => expect(component.isValid).toBeTruthy());
    });

    describe('checking readonly threshold', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      describe('when multipleDisplayThresholdsIsActive is false', () => {
        beforeEach(() => {
          component.multipleDisplayThresholdsIsActive = false;
          component.formGroupInstance = formGroupInstanceStub;
          component.field = fieldStub;
          fixture.detectChanges();
        });

        it('should set meetsReadonlyThreshold to false', () =>
          expect(component.meetsReadonlyThreshold).toBeFalsy());
      });

      // describe('when multipleDisplayThresholdsIsActive is false and isSponsorUser is true and canDisplayPredictedValues is true', () => {
      //   beforeEach(() => {
      //     fieldStub.value = '20.00';
      //     fieldStub.displayThreshold.readonly = 90;
      //     fieldStub.displayThreshold.view = 50;
      //     fieldStub.confidence = 0.95;
      //     component.isSponsorUser = true;
      //     component.canDisplayPredictedValues = true;
      //     component.multipleDisplayThresholdsIsActive = false;
      //     component.formGroupInstance = formGroupInstanceStub;
      //     component.field = fieldStub;
      //     fixture.detectChanges();
      //   });

      //   it('should set meetsReadonlyThreshold to true', () =>
      //     expect(component.meetsReadonlyThreshold).toBeTruthy());
      // });

      describe('when multipleDisplayThresholdsIsActive is false and isSponsorUser is false and canDisplayPredictedValues is true', () => {
        beforeEach(() => {
          fieldStub.value = '20.00';
          fieldStub.displayThreshold.readonly = 90;
          fieldStub.displayThreshold.view = 50;
          fieldStub.confidence = 0.95;
          component.isSponsorUser = false;
          component.canDisplayPredictedValues = true;
          component.multipleDisplayThresholdsIsActive = false;
          component.formGroupInstance = formGroupInstanceStub;
          component.field = fieldStub;
          fixture.detectChanges();
        });

        it('should set meetsReadonlyThreshold to false', () =>
          expect(component.meetsReadonlyThreshold).toBeFalsy());
      });

      describe('when multipleDisplayThresholdsIsActive is false and isSponsorUser is true and canDisplayPredictedValues is false', () => {
        beforeEach(() => {
          fieldStub.value = '20.00';
          fieldStub.displayThreshold.readonly = 90;
          fieldStub.displayThreshold.view = 50;
          fieldStub.confidence = 0.95;
          component.isSponsorUser = true;
          component.canDisplayPredictedValues = false;
          component.multipleDisplayThresholdsIsActive = false;
          component.formGroupInstance = formGroupInstanceStub;
          component.field = fieldStub;
          fixture.detectChanges();
        });

        it('should set meetsReadonlyThreshold to false', () =>
          expect(component.meetsReadonlyThreshold).toBeFalsy());
      });

      describe('when multipleDisplayThresholdsIsActive is true', () => {
        beforeEach(() => {
          component.multipleDisplayThresholdsIsActive = true;
        });

        describe('when value is not empty and above readonly threshold', () => {
          beforeEach(() => {
            fieldStub.value = '20.00';
            fieldStub.displayThreshold.readonly = 90;
            fieldStub.displayThreshold.view = 50;
            fieldStub.confidence = 0.95;
            component.formGroupInstance = formGroupInstanceStub;
            component.field = fieldStub;
            component.isSponsorUser = true;
            fixture.detectChanges();
          });

          it('should set meetsReadonlyThreshold to true', () =>
            expect(component.meetsReadonlyThreshold).toBeTruthy());
        });

        describe('when value is not empty and below readonly threshold', () => {
          beforeEach(() => {
            fieldStub.value = '20.00';
            fieldStub.displayThreshold.readonly = 90;
            fieldStub.displayThreshold.view = 50;
            fieldStub.confidence = 0.65;
            component.formGroupInstance = formGroupInstanceStub;
            component.field = fieldStub;
            fixture.detectChanges();
          });

          it('should set meetsReadonlyThreshold to false', () =>
            expect(component.meetsReadonlyThreshold).toBeFalsy());
        });

        describe('when value is not empty and confidence = 1', () => {
          beforeEach(() => {
            fieldStub.value = '20.00';
            fieldStub.displayThreshold.readonly = 90;
            fieldStub.displayThreshold.view = 50;
            fieldStub.confidence = 1;
            component.formGroupInstance = formGroupInstanceStub;
            component.field = fieldStub;
            fixture.detectChanges();
          });

          it('should set meetsReadonlyThreshold to false', () =>
            expect(component.meetsReadonlyThreshold).toBeFalsy());
        });

        describe('when value is empty', () => {
          beforeEach(() => {
            fieldStub.value = '';
            component.formGroupInstance = formGroupInstanceStub;
            component.field = fieldStub;
            fixture.detectChanges();
          });

          it('should set meetsReadonlyThreshold to false', () =>
            expect(component.meetsReadonlyThreshold).toBeFalsy());
        });
      });
    });
  });

  describe('ngOnChanges()', () => {
    describe('when confidence changes for a field', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        component.field.displayThreshold = {
          view: 100,
          readonly: 100,
        };
        fixture.detectChanges();
      });

      it('should retain false for meetsDisplayThreshold if below displayThreshold', () => {
        component.ngOnChanges({
          confidence: new SimpleChange(null, 0.5, true),
        });

        expect(component.meetsDisplayThreshold).toBeFalsy();
      });

      it('should set meetsDisplayThreshold to true if above displayThreshold', () => {
        component.ngOnChanges({
          confidence: new SimpleChange(null, 100, true),
        });

        expect(component.meetsDisplayThreshold).toBeTruthy();
      });

      it('should set meetsDisplayThreshold to true if equal displayThreshold', () => {
        component.ngOnChanges({
          confidence: new SimpleChange(null, 75, true),
        });

        expect(component.meetsDisplayThreshold).toBeTruthy();
      });
    });

    describe('when a change happens for highlightLabels & key does NOT match label', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        fixture.detectChanges();
        component.ngOnChanges({
          highlightLabels: new SimpleChange(
            null,
            [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate)],
            true
          ),
        });
      });

      it('should set turnOnHighlight to false', () =>
        expect(component.turnOnHighlight).toBeFalsy());
    });

    describe('when a change happens for highlightLabels & key does match label & confidence is above threshold', () => {
      beforeEach(() => {
        indexedLabelStub.label = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        component.field.displayThreshold = {
          view: 0,
          readonly: 0,
        };
        fixture.detectChanges();
        component.ngOnChanges({
          highlightLabels: new SimpleChange(
            null,
            [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount)],
            true
          ),
        });
      });

      afterEach(() => {
        indexedLabelStub.label = DocumentLabelKeys.lookupLabels.ShipToName;
      });

      it('should set turnOnHighlight to true', () =>
        expect(component.turnOnHighlight).toBeTruthy());
    });

    describe('when a change happens for highlightLabels & key does match label but confidence is below threshold', () => {
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      labelStub.value.confidence = 0.5;

      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        component.field.displayThreshold = {
          view: 100,
          readonly: 100,
        };
        fixture.detectChanges();
        component.ngOnChanges({
          highlightLabels: new SimpleChange(null, [labelStub], true),
        });
      });

      it('should set turnOnHighlight to false', () =>
        expect(component.turnOnHighlight).toBeFalsy());
    });

    describe('when a change happens for the tabbedToField & the field matches current field.key', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        jest.spyOn(component, 'edit').mockImplementation();
        component.field = fieldStub;

        component.ngOnChanges({
          tabbedToField: new SimpleChange(null, fieldStub, true),
        });
      });

      it('should call edit fn', () => expect(component.edit).toHaveBeenCalledTimes(1));
    });

    describe('when a change happens for the tabbedToField & the currentValue is null', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        jest.spyOn(component, 'edit').mockImplementation();
        component.field = fieldStub;

        component.ngOnChanges({
          tabbedToField: new SimpleChange(null, null, true),
        });
      });

      it('should NOT call edit fn', () => expect(component.edit).not.toHaveBeenCalled());
    });
  });

  describe('onblur()', () => {
    describe('when value is new', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'updateForm').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        component.onblur('new value');
      });

      it('should set editmode to false', () => expect(component.editMode).toBeFalsy());

      it('should set errorMessage to empty string', () => expect(component.errorMessage).toBe(''));

      it('should call updateForm fn', () =>
        expect(component['updateForm']).toHaveBeenNthCalledWith(1, 'new value'));
    });

    describe('when value is NOT new', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'updateForm').mockImplementation();
        component.errorMessage = 'Required';
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        component.field.value = 'same value';
        component.onblur('same value');
      });

      it('should set editmode to false', () => expect(component.editMode).toBeFalsy());

      it('should keep errorMessage the same', () =>
        expect(component.errorMessage).toBe('Required'));

      it('should NOT call updateForm fn', () =>
        expect(component['updateForm']).not.toHaveBeenCalled());
    });

    describe('when field type is currency & value is new', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      fieldStub.type = FieldTypes.Currency;
      fieldStub.value = '405.01';

      beforeEach(() => {
        jest.spyOn(component as any, 'updateForm').mockImplementation();
        component.errorMessage = 'Required';
        component.field = fieldStub;

        component.onblur('$405.00');
      });

      it('should set editmode to false', () => expect(component.editMode).toBeFalsy());

      it('should set errorMessage to empty string', () => expect(component.errorMessage).toBe(''));

      it('should call updateForm fn', () =>
        expect(component['updateForm']).toHaveBeenNthCalledWith(1, '$405.00'));
    });

    describe('when field type is currency & value is new and negative', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      fieldStub.type = FieldTypes.Currency;
      fieldStub.value = '405.01';

      beforeEach(() => {
        jest.spyOn(component as any, 'updateForm').mockImplementation();
        component.errorMessage = 'Required';
        component.field = fieldStub;

        component.onblur('-405.00');
      });

      it('should set editmode to false', () => expect(component.editMode).toBeFalsy());

      it('should set errorMessage to empty string', () => expect(component.errorMessage).toBe(''));

      it('should call updateForm fn', () =>
        expect(component['updateForm']).toHaveBeenNthCalledWith(1, '-405.00'));
    });

    describe('when field type is currency & current valaue is negative', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      fieldStub.type = FieldTypes.Currency;
      fieldStub.value = '-405.01';

      beforeEach(() => {
        jest.spyOn(component as any, 'updateForm').mockImplementation();
        component.errorMessage = 'Required';
        component.field = fieldStub;

        component.onblur('405.00');
      });

      it('should set editmode to false', () => expect(component.editMode).toBeFalsy());

      it('should set errorMessage to empty string', () => expect(component.errorMessage).toBe(''));

      it('should call updateForm fn', () =>
        expect(component['updateForm']).toHaveBeenNthCalledWith(1, '405.00'));
    });

    describe('when field type is currency & value is NOT new', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      fieldStub.type = FieldTypes.Currency;
      fieldStub.value = '405.00';

      beforeEach(() => {
        jest.spyOn(component as any, 'updateForm').mockImplementation();
        component.errorMessage = 'Required';
        component.field = fieldStub;

        component.onblur('$405.00');
      });

      it('should set editmode to false', () => expect(component.editMode).toBeFalsy());

      it('should keep errorMessage the same', () =>
        expect(component.errorMessage).toBe('Required'));

      it('should NOT call updateForm fn', () =>
        expect(component['updateForm']).not.toHaveBeenCalled());
    });
  });

  describe('onfocus()', () => {
    beforeEach(() => {
      component.onfocus('');
    });

    it('should set value to empty string', () => expect(component.value).toBe(''));
  });

  describe('handleOnKeyUp()', () => {
    beforeEach(() => {
      component.field = fieldBaseStub[0];
      component.field.key = 'WorkflowName';
      component.handleOnKeyUp('mockValue');
    });

    it('should set value to mockValue', () => expect(component.value).toBe('mockValue'));

    describe('When invoice number changes', () => {
      beforeEach(() => {
        component.field = fieldBaseStub[0];
        component.field.key = 'InvoiceNumber';
        component.handleOnKeyUp('123AbC().-_,!"#$%&');
      });
      it('should remove no allowed characters', () => {
        expect(component.value).toBe('123AbC().-_, ');
      });
    });
  });

  describe('isFormValid()', () => {
    beforeEach(() => {
      component.isFormValid(true);
    });

    it('should set isValid to true', () => expect(component.isValid).toBeTruthy());
  });

  describe('edit()', () => {
    beforeEach(() => {
      component.edit();
    });

    it('should set editMode to true', () => expect(component.editMode).toBeTruthy());

    it('should set isValid to true', () => expect(component.isValid).toBeTruthy());

    it('should set associatedErrorMessage to null', () =>
      expect(component.associatedErrorMessage).toBeNull());
  });

  describe('handleInputClick()', () => {
    describe('when selectedDocumentText is NOT NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        jest.spyOn(component, 'edit').mockImplementation();
        component.selectedDocumentText = getIndexedLabelStub(
          DocumentLabelKeys.nonLookupLabels.InvoiceNumber
        );
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

        component.handleInputClick();
      });

      it('should emit fieldSelectedForAssociation', () =>
        expect(component.fieldSelectedForAssociation.emit).toHaveBeenNthCalledWith(
          1,
          component.field
        ));

      it('should not call the edit fn', () => expect(component.edit).not.toHaveBeenCalled());
    });

    describe('when selectedDocumentText is NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        jest.spyOn(component, 'edit').mockImplementation();
        component.selectedDocumentText = null;

        component.handleInputClick();
      });

      it('should not emit fieldSelectedForAssociation', () =>
        expect(component.fieldSelectedForAssociation.emit).not.toHaveBeenCalled());

      it('should call the edit fn', () => expect(component.edit).toHaveBeenCalledTimes(1));
    });
  });

  describe('handleSingleClick()', () => {
    beforeEach(() => {
      jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
      component.field = fieldBaseStub[0];
      component.formGroupInstance = formGroupInstanceStub;
      component.formGroupInstance
        .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
        .enable();
    });

    it('should emit fieldSelectedForAssociation event', fakeAsync(() => {
      component.preventSingleClick = false;
      component.handleSingleClick();
      tick(5000);
      expect(component.fieldSelectedForAssociation.emit).toHaveBeenNthCalledWith(
        1,
        component.field
      );
    }));
  });

  describe('handleDblClick()', () => {
    beforeEach(() => {
      component.handleDblClick();
    });

    it('should set preventSingleClick to true', () =>
      expect(component.preventSingleClick).toBeTruthy());

    it('should set editMode to false', () => expect(component.editMode).toBeTruthy());
  });

  describe('private updateForm()', () => {
    const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

    beforeEach(() => {
      jest.spyOn(component.valueChanged, 'emit').mockImplementation();
      component.field = fieldStub;
      component['updateForm']('mock');
    });

    it('should set global var value to passed in value', () =>
      expect(component.value).toBe('mock'));

    it('should set field.value to passed in value', () =>
      expect(component.field.value).toBe('mock'));

    it('should emit the field that was changed', () =>
      expect(component.valueChanged.emit).toHaveBeenNthCalledWith(1, component.field));
  });
});
