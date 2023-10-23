import { ElementRef, EventEmitter, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import {
  customerAccountsStub,
  fieldBaseStub,
  formGroupInstanceStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  indexedLabelStub,
  orderedByStub,
  propertiesStub,
  suppliersStub,
  workflowStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  DocumentLabelKeys,
  LookupProperty,
  LookupSupplier,
  LookupValue,
} from '@ui-coe/avidcapture/shared/types';
import {
  DocumentFieldLabelComponent,
  LoadingSpinnerComponent,
} from '@ui-coe/avidcapture/shared/ui';
import { AxLabelComponent } from '@ui-coe/shared/ui';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { LookupFieldsComponent } from './lookup-fields.component';

const customerAccountNoField = {
  key: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
  value: 'value',
  confidence: 99.99,
  displayThreshold: {
    view: 75,
    readonly: 75,
  },
  confidenceThreshold: {
    high: {
      min: 95,
    },
    medium: {
      min: 90,
    },
    low: {
      min: 0,
    },
  },
  controlType: 'textbox',
  type: 'text',
  required: true,
  regEx: null,
  labelDisplayName: 'Customer Account Number',
  headerBackgroundColor: 'none',
  headerTextColor: 'default',
  order: 1,
};

describe('LookupFieldsComponent', () => {
  let component: LookupFieldsComponent;
  let fixture: ComponentFixture<LookupFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LookupFieldsComponent,
        MockComponent(AxLabelComponent),
        MockComponent(LoadingSpinnerComponent),
        MockComponent(DocumentFieldLabelComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupFieldsComponent);
    component = fixture.componentInstance;
    component.customerAccounts = [];
    component.suppliers = [];
    component.properties = [];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    component.input = new ElementRef({ focus(): void {}, select(): void {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when field is not customer account number or suppler is not empty', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        component.customerAccountFieldValue = '';
        fixture.detectChanges();
      });

      it('should set isValid to true', () => expect(component.isValid).toBeTruthy());

      it('should set value to empty string', () => expect(component.value).toBe(''));

      it('should set hasPointer to true', () => expect(component.hasPointer).toBeTruthy());
    });

    describe('when field is customer account number', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        fixture.detectChanges();
      });

      it('should set fieldCharacterLimit to 50', () => {
        expect(component.fieldCharacterLimit).toBe(50);
      });
    });

    describe('when field is customer account number & supplier is empty', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance.get(DocumentLabelKeys.lookupLabels.Supplier).setValue('');
        fixture.detectChanges();
      });

      it('should set fieldEnabled to false', () => {
        expect(component.fieldEnabled).toBeFalsy();
      });
    });

    describe('checking readonly threshold', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      describe('when supplierPredictionIsActive is false', () => {
        beforeEach(() => {
          component.supplierPredictionIsActive = false;
          component.formGroupInstance = formGroupInstanceStub;
          component.field = fieldStub;
          fixture.detectChanges();
        });

        it('should set meetsReadonlyThreshold to false', () =>
          expect(component.meetsReadonlyThreshold).toBeFalsy());
      });

      describe('when supplierPredictionIsActive is true', () => {
        beforeEach(() => {
          component.supplierPredictionIsActive = true;
        });

        describe('when value is not empty and above readonly threshold', () => {
          beforeEach(() => {
            fieldStub.value = 'supplier mock';
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
            fieldStub.value = 'supplier mock';
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
            fieldStub.value = 'supplier mock';
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
    describe('when editModeField is null', () => {
      beforeEach(() => {
        component.field = fieldBaseStub[0];
        component.ngOnChanges({
          editModeField: null,
        });
      });

      it('should keep editMode as false', () => expect(component.editMode).toBeFalsy());
    });

    describe('when editModeField does not equal field.key', () => {
      const editModeFieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      beforeEach(() => {
        component.field = fieldBaseStub[0];
        component.ngOnChanges({
          editModeField: new SimpleChange(null, editModeFieldStub, true),
        });
      });

      it('should set editMode as false', () => expect(component.editMode).toBeFalsy());
    });

    describe('when null is sent through for fields', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        component.customerAccountFieldValue = '';
        fixture.detectChanges();
        component.ngOnChanges({
          lastLabelUpdated: new SimpleChange(null, null, true),
        });
      });

      it('should keep value as empty string', () => expect(component.value).toEqual(''));

      it('should keep isValid as true since field is CAN & form control has a value', () =>
        expect(component.isValid).toBeTruthy());
    });

    describe('when confidence changes for a field', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        component.field.displayThreshold.view = 100;
        fixture.detectChanges();
      });

      it('should remain false for meetsDisplayThreshold if below displayThreshold', () => {
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
        component.field.displayThreshold.view = 75;

        component.ngOnChanges({
          confidence: new SimpleChange(null, 0.75, true),
        });

        expect(component.meetsDisplayThreshold).toBeTruthy();
      });
    });

    describe('when a change occurs for fields', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        component.customerAccountFieldValue = '70644';
        fixture.detectChanges();
        component.input = new ElementRef({
          focus(): void {
            return;
          },
        });
        component.formGroupInstance.get(component.field.key).setValue('70644');
        component.ngOnChanges({
          lastLabelUpdated: new SimpleChange(
            null,
            DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            true
          ),
        });
      });

      it('should set value to customer account number', () =>
        expect(component.value).toEqual('70644'));
    });

    describe('when a change happens with latestFieldAssociation', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        jest.spyOn(component.removeLatestFieldAssociation, 'emit').mockImplementation();
        jest.spyOn(component.resetLookUpFieldsEditMode, 'emit').mockImplementation();
        fixture.detectChanges();
        component.ngOnChanges({
          latestFieldAssociation: new SimpleChange(
            null,
            { field: component.field.key, value: 'mock' },
            true
          ),
        });
      });

      it('should emit searchText', () =>
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: 'mock',
          field: component.field.key,
        }));

      it('should emit searchText', () =>
        expect(component.removeLatestFieldAssociation.emit).toHaveBeenCalled());

      it('should set editMode to true', () => expect(component.editMode).toBeTruthy());

      it('should emit resetLookUpFieldsEditMode with field key value', () => {
        expect(component.resetLookUpFieldsEditMode.emit).toHaveBeenCalledWith(component.field.key);
      });
    });

    describe('when a change happens for highlightLabels & key does NOT match label', () => {
      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        fixture.detectChanges();
        component.ngOnChanges({
          highlightLabels: new SimpleChange(null, [indexedLabelStub], true),
        });
      });

      it('should set turnOnHighlight to false', () =>
        expect(component.turnOnHighlight).toBeFalsy());
    });

    describe('when a change happens for highlightLabels & key does match label & confidence is above threshold', () => {
      beforeEach(() => {
        indexedLabelStub.label = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        component.field.displayThreshold.view = 0;
        fixture.detectChanges();
        component.ngOnChanges({
          highlightLabels: new SimpleChange(null, [indexedLabelStub], true),
        });
      });

      afterEach(() => {
        indexedLabelStub.label = DocumentLabelKeys.lookupLabels.ShipToName;
      });

      it('should set turnOnHighlight to true', () =>
        expect(component.turnOnHighlight).toBeTruthy());
    });

    describe('when a change happens for highlightLabels & key does match label but confidence is below threshold', () => {
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      labelStub.value.confidence = 0.5;

      beforeEach(() => {
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.field.displayThreshold.view = 100;
        fixture.detectChanges();
        component.ngOnChanges({
          highlightLabels: new SimpleChange(null, [labelStub], true),
        });
      });

      it('should set turnOnHighlight to false', () =>
        expect(component.turnOnHighlight).toBeFalsy());
    });

    describe('when customerAccountFieldValue has been updated but lastLabelUpdated is null', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setFieldValue');
        component.lastLabelUpdated = null;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccountFieldValue = '';
        fixture.detectChanges();
        component.ngOnChanges({
          customerAccountFieldValue: new SimpleChange(null, 'mock', true),
        });
      });

      it('should call setFieldValue fn', () =>
        expect(component['setFieldValue']).toHaveBeenCalledTimes(2));

      it('should set value to whatever customerAccountFieldValue is', () =>
        expect(component.value).toBe(component.customerAccountFieldValue));
    });

    describe('when supplierFieldValue has been updated but lastLabelUpdated is null', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setFieldValue');
        component.lastLabelUpdated = null;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component.supplierFieldValue = {} as any;
        fixture.detectChanges();
        component.ngOnChanges({
          supplierFieldValue: new SimpleChange(null, suppliersStub[0], true),
        });
      });

      it('should call setFieldValue fn', () =>
        expect(component['setFieldValue']).toHaveBeenCalledTimes(2));

      it('should set value to whatever supplierFieldValue is', () =>
        expect(component.value).toEqual(component.supplierFieldValue));
    });

    describe('when shipToFieldValue has been updated but lastLabelUpdated is null', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setFieldValue');
        component.lastLabelUpdated = null;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.shipToFieldValue = {} as any;
        fixture.detectChanges();
        component.ngOnChanges({
          shipToFieldValue: new SimpleChange(null, propertiesStub[0], true),
        });
      });

      it('should call setFieldValue fn', () =>
        expect(component['setFieldValue']).toHaveBeenCalledTimes(2));

      it('should set value to whatever shipToFieldValue is', () =>
        expect(component.value).toEqual(component.shipToFieldValue));
    });

    describe('when orderedByFieldValue has been updated but lastLabelUpdated is null', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setFieldValue');
        component.lastLabelUpdated = null;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedByFieldValue = {} as any;
        fixture.detectChanges();

        component.ngOnChanges({
          orderedByFieldValue: new SimpleChange(null, orderedByStub[0], true),
        });
      });

      it('should call setFieldValue fn', () =>
        expect(component['setFieldValue']).toHaveBeenCalledTimes(2));

      it('should set value to whatever orderedByFieldValue is', () =>
        expect(component.value).toEqual(component.orderedByFieldValue));
    });

    describe('when workflowFieldValue has been updated but lastLabelUpdated is null', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setFieldValue');
        component.lastLabelUpdated = null;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflowFieldValue = {} as any;
        fixture.detectChanges();

        component.ngOnChanges({
          workflowFieldValue: new SimpleChange(null, workflowStub[0], true),
        });
      });

      it('should call setFieldValue fn', () =>
        expect(component['setFieldValue']).toHaveBeenCalledTimes(2));

      it('should set value to whatever workflowFieldValue is', () =>
        expect(component.value).toEqual(component.workflowFieldValue));
    });

    describe('when shipToFieldValue has been updated but lastLabelUpdated is NOT null', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'setFieldValue');
        component.lastLabelUpdated = DocumentLabelKeys.lookupLabels.ShipToName;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        fixture.detectChanges();
        component.ngOnChanges({
          shipToFieldValue: new SimpleChange(null, 'mock', true),
        });
      });

      it('should NOT call setFieldValue fn', () =>
        expect(component['setFieldValue']).not.toHaveBeenCalledTimes(2));
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
  });

  describe('edit()', () => {
    beforeEach(() => {
      component.formGroupInstance = formGroupInstanceStub;
      component.field = fieldBaseStub[0];
      component.field.value = 'mockTest';
      jest.spyOn(component.resetLookUpFieldsEditMode, 'emit').mockImplementation();
      jest.spyOn(component.searchText, 'emit').mockImplementation();
      jest.spyOn(component as any, 'loadLookup').mockImplementation();
      component.edit();
    });

    it('should set editMode to true', () => {
      expect(component.editMode).toBeTruthy();
    });

    it('should emit resetLookUpFieldsEditMode with field key value', () => {
      expect(component.resetLookUpFieldsEditMode.emit).toHaveBeenCalledWith(component.field.key);
    });
  });

  describe('handleInputClick()', () => {
    describe('when fieldEnabled is FALSE', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        jest.spyOn(component, 'edit').mockImplementation();
        component.fieldEnabled = false;
        component.selectedDocumentText = getIndexedLabelStub(
          DocumentLabelKeys.nonLookupLabels.InvoiceNumber
        );
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

        component.handleInputClick();
      });

      it('should not emit fieldSelectedForAssociation', () =>
        expect(component.fieldSelectedForAssociation.emit).not.toHaveBeenCalled());

      it('should not call the edit fn', () => expect(component.edit).not.toHaveBeenCalled());
    });

    describe('when isLookupLoading is TRUE', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        jest.spyOn(component, 'edit').mockImplementation();
        component.fieldEnabled = true;
        component.isLookupLoading = true;
        component.selectedDocumentText = getIndexedLabelStub(
          DocumentLabelKeys.nonLookupLabels.InvoiceNumber
        );
        component.field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
        component.handleInputClick();
      });
      it('should not emit fieldSelectedForAssociation', () =>
        expect(component.fieldSelectedForAssociation.emit).not.toHaveBeenCalled());
      it('should not call the edit fn', () => expect(component.edit).not.toHaveBeenCalled());
    });

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
    describe('when NO fields are disabled', () => {
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

    describe('when customer account number field is disabled', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        component.field = fieldBaseStub[0];
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
          .disable();
      });

      it('should NOT emit fieldSelectedForAssociation event', fakeAsync(() => {
        component.preventSingleClick = false;
        component.handleSingleClick();
        tick(5000);
        expect(component.fieldSelectedForAssociation.emit).not.toHaveBeenNthCalledWith(
          1,
          component.field
        );
      }));
    });

    describe('when fieldEnabled is FALSE', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        component.field = fieldBaseStub[0];
        component.formGroupInstance = formGroupInstanceStub;
        component.fieldEnabled = false;
      });

      it('should NOT emit fieldSelectedForAssociation event', fakeAsync(() => {
        component.preventSingleClick = false;
        component.handleSingleClick();
        tick(5000);
        expect(component.fieldSelectedForAssociation.emit).not.toHaveBeenCalled();
      }));
    });

    describe('when fieldEnabled is TRUE but lookupLoading is TRUE', () => {
      beforeEach(() => {
        jest.spyOn(component.fieldSelectedForAssociation, 'emit').mockImplementation();
        component.field = fieldBaseStub[0];
        component.formGroupInstance = formGroupInstanceStub;
        component.fieldEnabled = true;
        component.isLookupLoading = true;
      });

      it('should NOT emit fieldSelectedForAssociation event', fakeAsync(() => {
        component.preventSingleClick = false;
        component.handleSingleClick();
        tick(5000);
        expect(component.fieldSelectedForAssociation.emit).not.toHaveBeenCalled();
      }));
    });
  });

  describe('handleDblClick()', () => {
    describe('when fieldEnabled is TRUE && isLookupLoading is FALSE', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit');
        component.fieldEnabled = true;
        component.isLookupLoading = false;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.formGroupInstance = formGroupInstanceStub;
        component.handleDblClick();
      });

      it('should set preventSingleClick to true', () =>
        expect(component.preventSingleClick).toBeTruthy());

      it('should set editMode to true', () => expect(component.editMode).toBeTruthy());
    });

    describe('when fieldEnabled is FALSE', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit');
        component.fieldEnabled = false;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.formGroupInstance = formGroupInstanceStub;
        component.handleDblClick();
      });

      it('should set preventSingleClick to false', () =>
        expect(component.preventSingleClick).toBeFalsy());

      it('should set editMode to false', () => expect(component.editMode).toBeFalsy());
    });

    describe('when fieldEnabled is TRUE but isLookupLoading is TRUE', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit');
        component.fieldEnabled = false;
        component.isLookupLoading = true;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.formGroupInstance = formGroupInstanceStub;
        component.handleDblClick();
      });

      it('should set preventSingleClick to false', () =>
        expect(component.preventSingleClick).toBeFalsy());

      it('should set editMode to false', () => expect(component.editMode).toBeFalsy());
    });
  });

  describe('loadLookup()', () => {
    describe('when field is customer account number and has no data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccounts = null;
        component.loadLookup(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      });

      it('should emit searchText', () =>
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: component.field.value,
          field: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
        }));
    });

    describe('when field is customer account number and has data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccounts = customerAccountsStub;
        component.loadLookup(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      });

      it('should not emit searchText', () =>
        expect(component.searchText.emit).not.toHaveBeenCalled());
    });

    describe('when field is supplier and has no data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component.suppliers = null;
        component.loadLookup(DocumentLabelKeys.lookupLabels.Supplier);
      });

      it('should emit searchText', () =>
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: component.field.value,
          field: DocumentLabelKeys.lookupLabels.Supplier,
        }));
    });

    describe('when field is supplier and has data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.suppliers = suppliersStub;
        component.loadLookup(DocumentLabelKeys.lookupLabels.Supplier);
      });

      it('should not emit searchText', () =>
        expect(component.searchText.emit).not.toHaveBeenCalled());
    });

    describe('when field is ship to name and has no data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.properties = null;
        component.loadLookup(DocumentLabelKeys.lookupLabels.ShipToName);
      });

      it('should emit searchText', () =>
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: component.field.value,
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        }));
    });

    describe('when field is ship to name and has data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.properties = propertiesStub;
        component.loadLookup(DocumentLabelKeys.lookupLabels.ShipToName);
      });

      it('should not emit searchText', () =>
        expect(component.searchText.emit).not.toHaveBeenCalled());
    });

    describe('when field is orderedBy and has no data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedBy = null;
        component.loadLookup(DocumentLabelKeys.lookupLabels.OrderedBy);
      });

      it('should emit searchText', () =>
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: component.field.value,
          field: DocumentLabelKeys.lookupLabels.OrderedBy,
        }));
    });

    describe('when field is orderedBy and has data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedBy = orderedByStub;
        component.loadLookup(DocumentLabelKeys.lookupLabels.OrderedBy);
      });

      it('should not emit searchText', () =>
        expect(component.searchText.emit).not.toHaveBeenCalled());
    });

    describe('when field is workflow and has no data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflow = null;
        component.loadLookup(DocumentLabelKeys.lookupLabels.Workflow);
      });

      it('should emit searchText', () =>
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: component.field.value,
          field: DocumentLabelKeys.lookupLabels.Workflow,
        }));
    });

    describe('when field is workflow and has data', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflow = workflowStub;
        component.loadLookup(DocumentLabelKeys.lookupLabels.Workflow);
      });

      it('should not emit searchText', () =>
        expect(component.searchText.emit).not.toHaveBeenCalled());
    });
  });

  describe('focusOut()', () => {
    describe('when field is cleared out & dropdown does not open', () => {
      const triggerStub = {
        autocomplete: { isOpen: false },
      } as any;

      beforeEach(() => {
        jest.spyOn(component.handleNoSelection, 'emit').mockImplementation();
        jest.spyOn(component.resetLookupDropdownData, 'emit').mockImplementation();
        jest.spyOn(component as any, 'cleanUpData').mockReturnValue(false);
        component.formGroupInstance = formGroupInstanceStub;
        component.field = customerAccountNoField;
        component.autocompleteTrigger = triggerStub;
        component.formGroupInstance.get(component.field.key).setValue('');
        component.focusOut();
      });

      it('should emit for handleNoSelection', () => {
        expect(component.handleNoSelection.emit).toHaveBeenCalledTimes(1);
      });

      it('should emit for resetLookupDropdownData', () => {
        expect(component.resetLookupDropdownData.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('when field is NOT cleared out & dropdown does not open & cleanUpdata returns false', () => {
      const triggerStub = {
        autocomplete: { isOpen: false },
      } as any;

      beforeEach(() => {
        jest.spyOn(component.handleNoSelection, 'emit').mockImplementation();
        jest.spyOn(component.resetLookupDropdownData, 'emit').mockImplementation();
        jest.spyOn(component as any, 'cleanUpData').mockReturnValue(false);
        component.formGroupInstance = formGroupInstanceStub;
        component.field = customerAccountNoField;
        component.value = '70644';
        component.autocompleteTrigger = triggerStub;
        component.formGroupInstance.get(component.field.key).setValue('70644');
        component.autocompleteTrigger = triggerStub;
        component.focusOut();
      });

      it('should emit for handleNoSelection', () => {
        expect(component.handleNoSelection.emit).toHaveBeenCalledTimes(1);
      });

      it('should emit for resetLookupDropdownData', () => {
        expect(component.resetLookupDropdownData.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('when field is NOT cleared out & dropdown does not open and cleanUp data returns true', () => {
      const triggerStub = {
        autocomplete: { isOpen: false },
      } as any;

      beforeEach(() => {
        jest.spyOn(component.handleNoSelection, 'emit').mockImplementation();
        jest.spyOn(component.resetLookupDropdownData, 'emit').mockImplementation();
        jest.spyOn(component as any, 'cleanUpData').mockReturnValue(true);
        jest.spyOn(component.updateLookupValue as any, 'emit').mockImplementation();
        component.formGroupInstance = formGroupInstanceStub;
        component.field = customerAccountNoField;
        component.value = '70644';
        component.autocompleteTrigger = triggerStub;
        component.formGroupInstance.get(component.field.key).setValue('70644');
        component.autocompleteTrigger = triggerStub;
        component.focusOut();
      });

      it('should be called clearFormValue', () =>
        expect(component.updateLookupValue.emit).toHaveBeenCalled());
    });

    describe('when dropdown opens', () => {
      const triggerStub = {
        autocomplete: { isOpen: true },
      } as any;

      beforeEach(() => {
        jest.spyOn(component.handleNoSelection, 'emit').mockImplementation();
        jest.spyOn(component.resetLookupDropdownData, 'emit').mockImplementation();
        component.autocompleteTrigger = triggerStub;
        component.focusOut();
      });

      it('should mark editMode as true', () => expect(component.editMode).toBeTruthy());

      it('should NOT emit for handleNoSelection', () => {
        expect(component.handleNoSelection.emit).not.toHaveBeenCalled();
      });

      it('should NOT emit for resetLookupDropdownData', () => {
        expect(component.resetLookupDropdownData.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('autocompleteOpened()', () => {
    describe('when firstChild from anchorNode exists', () => {
      const triggerStub = {
        autocomplete: { closed: new EventEmitter() },
        panelClosingActions: of(null),
      } as any;

      beforeEach(() => {
        jest.spyOn(component.handleNoSelection, 'emit').mockImplementation();
        jest.spyOn(component as any, 'cleanUpData').mockReturnValue(false);
        window.getSelection = (): any =>
          ({
            anchorNode: {
              firstChild: {
                nodeName: 'DIV',
              },
            },
          } as any);
        component.autocompleteTrigger = triggerStub;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = customerAccountNoField;
        component.autocompleteOpened();
      });

      it('should emit for handleNoSelection', () =>
        expect(component.handleNoSelection.emit).toHaveBeenCalled());
    });

    describe('when firstChild from anchorNode is NULL', () => {
      const triggerStub = {
        autocomplete: { closed: new EventEmitter() },
        panelClosingActions: of(''),
      } as any;

      beforeEach(() => {
        window.getSelection = (): any =>
          ({
            anchorNode: {
              firstChild: null,
            },
          } as any);
        component.editMode = true;
        component.autocompleteTrigger = triggerStub;
        component.formGroupInstance = formGroupInstanceStub;
        component.field = customerAccountNoField;
        component.autocompleteOpened();
      });

      it('should not mark editMode as false', done => {
        component.autocompleteTrigger.panelClosingActions.subscribe(() => {
          expect(component.editMode).toBeTruthy();
          done();
        });
      });
    });
  });

  describe('autocompleteClosed()', () => {
    describe('when defaultShipToIsLoading is FALSE', () => {
      beforeEach(() => {
        jest.spyOn(component.resetLookupDropdownData, 'emit').mockImplementation();
        component.autocompleteClosed();
      });

      it('should emit resetLookupDropdownData', () =>
        expect(component.resetLookupDropdownData.emit).toHaveBeenCalled());
    });

    describe('when defaultShipToIsLoading is TRUE', () => {
      beforeEach(() => {
        component.isDefaultShipToLoading = true;
        jest.spyOn(component.resetLookupDropdownData, 'emit').mockImplementation();
        component.autocompleteClosed();
      });

      it('should NOT emit resetLookupDropdownData', () =>
        expect(component.resetLookupDropdownData.emit).not.toHaveBeenCalled());
    });
  });

  describe('optionSelected', () => {
    beforeEach(() => {
      jest.spyOn(component.updateLookupValue, 'emit').mockImplementation();
      component.field = fieldBaseStub[0];
      component.optionSelected(customerAccountsStub[0] as LookupValue);
    });

    it('should set editMode to false', () => {
      expect(component.editMode).toBeFalsy();
    });

    it('should emit updated lookup value', () => {
      expect(component.updateLookupValue.emit).toHaveBeenNthCalledWith(1, {
        lookupValue: customerAccountsStub[0] as LookupValue,
        field: component.field.key,
      });
    });
  });

  describe('openCreateAccountModal', () => {
    describe('when field is CustomerAccountNumber', () => {
      beforeEach(() => {
        jest.spyOn(component.openAccountNumberModal, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.field.value = 'mock';
        component['latestSearchText'] = '';
        component.openCreateAccountModal();
      });

      it('should set latestSearchText to field.value', () => {
        expect(component['latestSearchText']).toBe(component.field.value);
      });

      it('should emit updated lookup value', () => {
        expect(component.openAccountNumberModal.emit).toHaveBeenNthCalledWith(
          1,
          component['latestSearchText']
        );
      });
    });

    describe('when field is NOT CustomerAccountNumber', () => {
      beforeEach(() => {
        jest.spyOn(component.openAccountNumberModal, 'emit').mockImplementation();
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component['latestSearchText'] = 'origValue';
        component.openCreateAccountModal();
      });

      it('should NOT set latestSearchText to field.value', () => {
        expect(component['latestSearchText']).toBe('origValue');
      });
    });
  });

  describe('displayValue()', () => {
    const formValue = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

    it('should return the formValues value', () => {
      expect(component.displayValue(formValue)).toBe(formValue.value);
    });
  });

  describe('private listenToFormChanges()', () => {
    describe('when field is Customer Account Number', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.formGroupInstance = formGroupInstanceStub;
        component.field = customerAccountNoField;
        fixture.detectChanges();
      });

      it('should emit 1234 for searchText emitter', fakeAsync(() => {
        component.formGroupInstance.get(component.field.key).setValue('1');
        tick(500);
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: '1',
          field: component.field.key,
        });
      }));

      it('should emit 1234 for searchText emitter with leading and trailing spaces', fakeAsync(() => {
        component.formGroupInstance.get(component.field.key).setValue(' 1 ');
        tick(500);
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: '1',
          field: component.field.key,
        });
      }));

      it('should not emit for searchText emitter when value is empty', fakeAsync(() => {
        component.value = '';
        component.formGroupInstance.get(component.field.key).setValue('');
        tick(500);
        expect(component.searchText.emit).not.toHaveBeenCalled();
      }));
    });

    describe('when field is not Customer Account Number', () => {
      const genericField = {
        key: DocumentLabelKeys.lookupLabels.ShipToAddress,
        value: '',
        confidence: 50,
        displayThreshold: {
          view: 75,
          readonly: 75,
        },
        confidenceThreshold: {
          high: {
            min: 95,
          },
          medium: {
            min: 90,
          },
          low: {
            min: 0,
          },
        },
        controlType: 'textbox',
        type: 'text',
        required: true,
        regEx: null,
        labelDisplayName: 'Ship To Address',
        headerBackgroundColor: 'none',
        headerTextColor: 'default',
        order: 1,
      };

      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.formGroupInstance = formGroupInstanceStub;
        component.field = genericField;
        fixture.detectChanges();
      });

      it('should emit 1234 for searchText emitter', fakeAsync(() => {
        component.formGroupInstance.get(component.field.key).setValue('12');
        tick(500);
        expect(component.searchText.emit).toHaveBeenNthCalledWith(1, {
          value: '12',
          field: component.field.key,
        });
      }));

      it('should not emit for searchText emitter when value is empty', fakeAsync(() => {
        component.value = '';
        component.formGroupInstance.get(component.field.key).setValue('');
        tick(500);
        expect(component.searchText.emit).not.toHaveBeenCalled();
      }));

      it('should NOT emit anything for searchText emitter', fakeAsync(() => {
        component.formGroupInstance.get(component.field.key).setValue('1');
        tick(500);
        expect(component.searchText.emit).not.toHaveBeenCalled();
      }));
    });

    describe('when formgroup value equals component.value', () => {
      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.formGroupInstance = formGroupInstanceStub;
        component.field = fieldBaseStub[0];
        fixture.detectChanges();
      });

      it('should emit 1234 for searchText emitter', fakeAsync(() => {
        component.value = '12';
        component.formGroupInstance.get(component.field.key).setValue('12');
        tick(500);
        expect(component.searchText.emit).not.toHaveBeenNthCalledWith(1, {
          value: '12',
          field: component.field.key,
        });
      }));

      it('should not emit for searchText emitter when value is empty', fakeAsync(() => {
        component.value = '';
        component.formGroupInstance.get(component.field.key).setValue('');
        tick(500);
        expect(component.searchText.emit).not.toHaveBeenCalled();
      }));
    });

    describe('when value is NOT a string', () => {
      const genericField = {
        key: DocumentLabelKeys.lookupLabels.ShipToAddress,
        value: '',
        confidence: 50,
        displayThreshold: {
          view: 75,
          readonly: 75,
        },
        confidenceThreshold: {
          high: {
            min: 95,
          },
          medium: {
            min: 90,
          },
          low: {
            min: 0,
          },
        },
        controlType: 'textbox',
        type: 'text',
        required: true,
        regEx: null,
        labelDisplayName: 'Ship To Address',
        headerBackgroundColor: 'none',
        headerTextColor: 'default',
        order: 1,
      };

      beforeEach(() => {
        jest.spyOn(component.searchText, 'emit').mockImplementation();
        component.formGroupInstance = formGroupInstanceStub;
        component.field = genericField;
        fixture.detectChanges();
      });

      it('should not emit anything', fakeAsync(() => {
        component.formGroupInstance
          .get(component.field.key)
          .setValue({ value: '1234', field: DocumentLabelKeys.lookupLabels.Supplier });
        tick(500);
        expect(component.searchText.emit).not.toHaveBeenCalled();
      }));
    });
  });

  describe('private enableNextField()', () => {
    const genericField = {
      key: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
      value: '',
      confidence: 50,
      displayThreshold: {
        view: 75,
        readonly: 75,
      },
      confidenceThreshold: {
        high: {
          min: 95,
        },
        medium: {
          min: 90,
        },
        low: {
          min: 0,
        },
      },
      controlType: 'textbox',
      type: 'text',
      required: true,
      regEx: null,
      labelDisplayName: 'Customer Account Number',
      headerBackgroundColor: 'none',
      headerTextColor: 'default',
      order: 1,
    };

    describe('when lastUpdatedField is CustomerAccountNumber', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit').mockImplementation();
        genericField.key = DocumentLabelKeys.lookupLabels.ShipToName;
        component.field = genericField;
        component.confidence = 50;
        component['enableNextField'](DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      });

      it('should call the edit function', () => expect(component.edit).toHaveBeenCalled());
    });

    describe('when lastUpdatedField is Supplier', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit').mockImplementation();
        genericField.key = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;
        component.latestFieldAssociation = null;
        component.field = genericField;
        component.formGroupInstance = formGroupInstanceStub;
        component['enableNextField'](DocumentLabelKeys.lookupLabels.Supplier);
      });

      it('should call the edit function', () => expect(component.edit).toHaveBeenCalled());

      it('should set value to NULL', () => {
        expect(component.value).toBeNull();
        expect(component.formGroupInstance.get(component.field.key).value).toBe('');
      });
    });

    describe('when lastUpdatedField is SupplierAddress', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit').mockImplementation();
        genericField.key = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;
        component.field = genericField;
        component.formGroupInstance = formGroupInstanceStub;
        component['enableNextField'](DocumentLabelKeys.lookupLabels.SupplierAddress);
      });

      it('should call the edit function', () => expect(component.edit).toHaveBeenCalled());

      it('should set value to NULL', () => {
        expect(component.value).toBeNull();
        expect(component.formGroupInstance.get(component.field.key).value).toBe('');
      });
    });

    describe('when lastUpdatedField is ShipToName', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit').mockImplementation();
        genericField.key = DocumentLabelKeys.lookupLabels.Supplier;
        component.field = genericField;
        component.confidence = 50;
        component['enableNextField'](DocumentLabelKeys.lookupLabels.ShipToName);
      });

      it('should call the edit function', () => expect(component.edit).toHaveBeenCalled());
    });

    describe('when lastUpdatedField is ShipToAddress', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'edit').mockImplementation();
        genericField.key = DocumentLabelKeys.lookupLabels.Supplier;
        component.field = genericField;
        component.confidence = 50;
        component['enableNextField'](DocumentLabelKeys.lookupLabels.ShipToAddress);
      });

      it('should call the edit function', () => expect(component.edit).toHaveBeenCalled());
    });
  });

  describe('getResultsCountLabel()', () => {
    it('should render autocomplete results count label', () => {
      const result = component.getResultsCountLabel(10);

      expect(result).toBe('Showing 10 results');
    });
  });

  describe('clearFormValue()', () => {
    beforeEach(() => {
      jest.spyOn(component.updateLookupValue, 'emit').mockImplementation();
      component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      component.formGroupInstance = formGroupInstanceStub;
      component.clearFormValue();
    });

    it('should emit null for updateLookupValue', () =>
      expect(component.updateLookupValue.emit).toHaveBeenNthCalledWith(1, {
        lookupValue: null,
        field: component.field.key,
      }));
  });

  describe('private setFieldValue()', () => {
    beforeEach(() => {
      component.value = '';
      component.customerAccountFieldValue = 'mock1';
      component.supplierFieldValue = { vendorName: 'mock2' } as any;
      component.shipToFieldValue = { propertyName: 'mock3' } as any;
    });

    describe('when field.key is CustomerAccountNumber && customerAccountFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccountFieldValue = 'mock';
        component['setFieldValue']();
      });

      it('should set value to customerAccountFieldValue', () =>
        expect(component.value).toBe(component.customerAccountFieldValue));
    });

    describe('when field.key is CustomerAccountNumber && customerAccountFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccountFieldValue = '';
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when field.key is Supplier && supplierFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component.supplierFieldValue = suppliersStub[0];
        component['setFieldValue']();
      });

      it('should set value to supplierFieldValue', () =>
        expect(component.value).toBe(component.supplierFieldValue));
    });

    describe('when field.key is Supplier && supplierFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component.supplierFieldValue = null;
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when field.key is ShipToName && shipToFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.shipToFieldValue = propertiesStub[0];
        component['setFieldValue']();
      });

      it('should set value to shipToFieldValue', () =>
        expect(component.value).toBe(component.shipToFieldValue));
    });

    describe('when field.key is ShipToName && shipToFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.shipToFieldValue = null;
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when field.key is ShipToAddress && shipToFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress);
        component.shipToFieldValue = propertiesStub[0];
        component['setFieldValue']();
      });

      it('should set value to shipToFieldValue', () =>
        expect(component.value).toBe(component.shipToFieldValue));
    });

    describe('when field.key is ShipToAddress && shipToFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress);
        component.shipToFieldValue = null;
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when field.key is SupplierAddress && supplierFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress);
        component.supplierFieldValue = suppliersStub[0];
        component['setFieldValue']();
      });

      it('should set value to supplierFieldValue', () =>
        expect(component.value).toBe(component.supplierFieldValue));
    });

    describe('when field.key is SupplierAddress && supplierFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress);
        component.supplierFieldValue = null;
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when field.key is OrderedBy && orderedByFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedByFieldValue = orderedByStub[0];
        component['setFieldValue']();
      });

      it('should set value to orderedByFieldValue', () =>
        expect(component.value).toBe(component.orderedByFieldValue));
    });

    describe('when field.key is OrderedBy && orderedByFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedByFieldValue = null;
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });

    describe('when field.key is workflow && workflowFieldValue is defined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflowFieldValue = workflowStub[0];
        component['setFieldValue']();
      });

      it('should set value to workflowFieldValue', () =>
        expect(component.value).toBe(component.workflowFieldValue));
    });

    describe('when field.key is workflow && workflowFieldValue is undefined', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflowFieldValue = null;
        component['setFieldValue']();
      });

      it('should set value to field.value', () =>
        expect(component.value).toBe(component.field.value));
    });
  });

  describe('private setFormFieldValue()', () => {
    beforeEach(() => {
      component.formGroupInstance = formGroupInstanceStub;
    });

    describe('when field.key is CustomerAccountNumber', () => {
      beforeEach(() => {
        component.value = 'mock1';
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component['setFormFieldValue']();
      });

      it('should set formField value to global var value', () =>
        expect(component.formGroupInstance.get(component.field.key).value).toBe(component.value));
    });

    describe('when field.key is Supplier', () => {
      beforeEach(() => {
        component.value = { vendorName: 'mock2' } as any;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component['setFormFieldValue']();
      });

      it('should set formField value to global var value', () =>
        expect(component.formGroupInstance.get(component.field.key).value).toBe(
          (component.value as LookupSupplier).vendorName
        ));
    });

    describe('when field.key is ShipToName', () => {
      beforeEach(() => {
        component.value = { propertyName: 'mock3' } as any;
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component['setFormFieldValue']();
      });

      it('should set formField value to global var value', () =>
        expect(component.formGroupInstance.get(component.field.key).value).toBe(
          (component.value as LookupProperty).propertyName
        ));
    });

    describe('when field.key is orderedBy', () => {
      beforeEach(() => {
        component.value = 'mock11';
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component['setFormFieldValue']();
      });

      it('should set formField value to global var value', () =>
        expect(component.formGroupInstance.get(component.field.key).value).toBe(component.value));
    });

    describe('when field.key is workflow', () => {
      beforeEach(() => {
        component.value = 'mock11';
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component['setFormFieldValue']();
      });

      it('should set formField value to global var value', () =>
        expect(component.formGroupInstance.get(component.field.key).value).toBe(component.value));
    });
  });

  describe('private checkLookupState()', () => {
    beforeEach(() => {
      component.lookupLoadingState = {
        customerAccountLoading: false,
        supplierLoading: true,
        shipToLoading: false,
        orderedByLoading: false,
        workflowLoading: false,
      };
    });

    describe('when field.key is CustomerAccountNumber', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      });

      it('should return value for customer account loading state', () =>
        expect(component['checkLookupState']()).toBeFalsy());
    });

    describe('when field.key is Supplier', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      });

      it('should return value for supplier loading state', () =>
        expect(component['checkLookupState']()).toBeTruthy());
    });

    describe('when field.key is ShipToName', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      });

      it('should return value for ship to loading state', () =>
        expect(component['checkLookupState']()).toBeFalsy());
    });

    describe('when field.key is orderedBy', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      });

      it('should return value for ordered by loading state', () =>
        expect(component['checkLookupState']()).toBeFalsy());
    });

    describe('when field.key is workflow', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
      });

      it('should return value for workflow loading state', () =>
        expect(component['checkLookupState']()).toBeFalsy());
    });
  });

  describe('autoAdjustFontSize', () => {
    describe('if length text exceeds of 16 characters', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.field.value = '0123456789012346';
        component['autoAdjustFontSize']();
      });
      it('should calculate font size when field.key is CustomerAccountNumber', () => {
        expect(component.input.nativeElement.style).toBe('font-size:0.84em');
      });
    });

    describe('if length exceeds of 20 characters', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.field.value = '01234567890123467891';
        component['autoAdjustFontSize']();
      });
      it('should calculate font size when field.key is CustomerAccountNumber', () => {
        expect(component.input.nativeElement.style).toBe('font-size:0.8em');
      });
    });

    describe('if font-size is less than 06em', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.field.value = '01234567890123467891234567890123456789';
        component['autoAdjustFontSize']();
      });
      it('should set by default 0.6em', () => {
        expect(component.input.nativeElement.style).toBe('font-size:0.6em');
      });
    });
  });

  describe('cleanUpData()', () => {
    describe('When supplier current data is equal to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component.supplierFieldValue = {} as any;
        component.supplierFieldValue.vendorName = 'VendorName';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.Supplier)
          .setValue('VendorName');
      });

      it('If supplier has the same data as formValue shuld return false', () => {
        expect(component.cleanUpData()).toBeFalsy();
      });
    });

    describe('When supplier current data is different to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        component.supplierFieldValue = {} as any;
        component.supplierFieldValue.vendorName = 'Vendor';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.Supplier)
          .setValue('VendorName');
      });

      it('If supplier has the same data as formValue should return false', () => {
        expect(component.cleanUpData()).toBeTruthy();
      });
    });

    describe('When CustomerAccountNumber current data is equal to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccountFieldValue = {} as any;
        component.customerAccountFieldValue = 'CustomerNumber';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
          .setValue('CustomerNumber');
      });

      it('If CustomerAccountNumber has the same data as formValue shuld return false', () => {
        expect(component.cleanUpData()).toBeFalsy();
      });
    });

    describe('When CustomerAccountNumber current data is different to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
        component.customerAccountFieldValue = {} as any;
        component.customerAccountFieldValue = 'Customer';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
          .setValue('CustomerNumber');
      });

      it('If CustomerAccountNumber has the same data as formValue should return false', () => {
        expect(component.cleanUpData()).toBeTruthy();
      });
    });

    describe('When ShipToName current data is equal to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.shipToFieldValue = {} as any;
        component.shipToFieldValue.propertyName = 'ShipToMock';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.ShipToName)
          .setValue('ShipToMock');
      });

      it('If ShipToName has the same data as formValue shuld return false', () => {
        expect(component.cleanUpData()).toBeFalsy();
      });
    });

    describe('When ShipToName current data is different to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
        component.shipToFieldValue = {} as any;
        component.shipToFieldValue.propertyName = 'ShipTo';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.ShipToName)
          .setValue('ShipToMock');
      });

      it('If ShipToName has the same data as formValue should return false', () => {
        expect(component.cleanUpData()).toBeTruthy();
      });
    });

    describe('When OrderedBy current data is equal to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedByFieldValue = {} as any;
        component.orderedByFieldValue.firstName = 'OrderedByMock';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.OrderedBy)
          .setValue('OrderedByMock');
      });

      it('If OrderedBy has the same data as formValue shuld return false', () => {
        expect(component.cleanUpData()).toBeFalsy();
      });
    });

    describe('When OrderedBy current data is different to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
        component.orderedByFieldValue = {} as any;
        component.orderedByFieldValue.firstName = 'OrderedByMock';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.OrderedBy)
          .setValue('OrderedBy');
      });

      it('If OrderedBy has the same data as formValue should return false', () => {
        expect(component.cleanUpData()).toBeTruthy();
      });
    });

    describe('When Workflow current data is equal to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflowFieldValue = {} as any;
        component.workflowFieldValue.name = 'WorkflowMock';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.Workflow)
          .setValue('WorkflowMock');
      });

      it('If Workflow has the same data as formValue shuld return false', () => {
        expect(component.cleanUpData()).toBeFalsy();
      });
    });

    describe('When Workflow current data is different to field', () => {
      beforeEach(() => {
        component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
        component.workflowFieldValue = {} as any;
        component.workflowFieldValue.name = 'WorkflowMock';
        component.formGroupInstance = formGroupInstanceStub;
        component.formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.Workflow)
          .setValue('Workflow');
      });

      it('If Workflow has the same data as formValue should return false', () => {
        expect(component.cleanUpData()).toBeTruthy();
      });
    });
  });
});
