import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getFieldBaseStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, InputDataTypes } from '@ui-coe/avidcapture/shared/types';
import { DocumentFieldLabelComponent } from '@ui-coe/avidcapture/shared/ui';
import { MockComponent } from 'ng-mocks';

import { ArchiveFieldsComponent } from './archive-fields.component';

describe('ArchiveFieldsComponent', () => {
  let component: ArchiveFieldsComponent;
  let fixture: ComponentFixture<ArchiveFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchiveFieldsComponent, MockComponent(DocumentFieldLabelComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveFieldsComponent);
    component = fixture.componentInstance;
    component.field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    describe('when a change happens for fieldToHighlight & labelDisplayName matches currentValue', () => {
      const labelDisplayName = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.Supplier
      ).labelDisplayName;
      beforeEach(() => {
        component.ngOnChanges({
          fieldToHighlight: new SimpleChange(null, labelDisplayName, true),
        });
      });

      it('should set turnOnHighlight to true', () =>
        expect(component.turnOnHighlight).toBeTruthy());
    });

    describe('when a change happens for fieldToHighlight & labelDisplayName does NOT match currentValue', () => {
      beforeEach(() => {
        component.ngOnChanges({
          fieldToHighlight: new SimpleChange(null, 'mock', true),
        });
      });

      it('should set turnOnHighlight to false', () =>
        expect(component.turnOnHighlight).toBeFalsy());
    });

    describe('when a change happens but NOT for fieldToHighlight', () => {
      beforeEach(() => {
        component.ngOnChanges({
          invoiceType: new SimpleChange(null, null, true),
        });
      });

      it('should set turnOnHighlight to should remain false', () =>
        expect(component.turnOnHighlight).toBeFalsy());
    });
  });

  describe('getLabelTextColor()', () => {
    describe('when label is NOT a currency field', () => {
      it('should return default as the label text color', () => {
        const field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
        expect(component.getLabelTextColor(field)).toBe('default');
      });
    });

    describe('when label is a currency field but NOT a negative number', () => {
      it('should return default as the label text color', () => {
        const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        field.type = InputDataTypes.Currency;
        field.value = '12.00';
        expect(component.getLabelTextColor(field)).toBe('default');
      });
    });

    describe('when label is a currency field and IS a negative number', () => {
      it('should return red as the label text color', () => {
        const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
        field.type = InputDataTypes.Currency;
        field.value = '-12.00';
        expect(component.getLabelTextColor(field)).toBe('red');
      });
    });
  });

  describe('displayField()', () => {
    describe('When is invoiceType is standard, field is utility and has confidence different than 1', () => {
      const label = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      beforeEach(() => {
        component.isUtilityField = true;
        component.invoiceType = 'standard';
        component.field = label;
      });

      it('should returns a empty value', () => {
        expect(component.displayField()).toBe('');
      });
    });

    describe('When is invoiceType is utility, field is utility and has confidence  1', () => {
      const label = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      label.value = 'utilityMock';
      beforeEach(() => {
        component.isUtilityField = true;
        component.invoiceType = 'utility';
        component.field = label;
        label.confidence = 1;
      });

      it('should returns the current value', () => {
        expect(component.displayField()).toBe('utilityMock');
      });
    });

    describe('When is a predicted value', () => {
      describe('When meet confidence check', () => {
        const label = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
        label.confidence = 0.95;
        label.displayThreshold.view = 93;
        label.value = 'predictedValueMock';
        beforeEach(() => {
          component.isUtilityField = false;
          component.invoiceType = 'standard';
          component.field = label;
          component.canDisplayPredictedValues = true;
          component.isSponsorUser = true;
        });

        it('should returns the current value', () => {
          expect(component.displayField()).toBe('predictedValueMock');
        });
      });

      describe('When does not meet confidence check', () => {
        const label = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
        label.confidence = 0.63;
        label.displayThreshold.view = 93;
        label.value = 'predictedValueMock';
        beforeEach(() => {
          component.isUtilityField = false;
          component.invoiceType = 'standard';
          component.field = label;
          component.canDisplayPredictedValues = false;
        });

        it('should returns a empty value', () => {
          expect(component.displayField()).toBe('');
        });
      });
    });
  });
});
