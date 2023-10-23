import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { ValidatorService } from '@ui-coe/avidcapture/core/util';
import { getFieldBaseStub } from '@ui-coe/avidcapture/shared/test';
import { ControlTypes, DocumentLabelKeys, FieldTypes } from '@ui-coe/avidcapture/shared/types';

import { FieldControlService } from './field-control.service';

const validatorServiceStub = {
  required: jest.fn(),
  formDateValidator: jest.fn(),
};

describe('FieldControlService', () => {
  let service: FieldControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ValidatorService,
          useValue: validatorServiceStub,
        },
      ],
    });
    service = TestBed.inject(FieldControlService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toFormGroup()', () => {
    describe('when required field is true', () => {
      const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);

      it('should add the required validator to the formcontrol', () => {
        expect(
          service
            .toFormGroup([fieldBaseStub])
            .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
            .hasValidator(Validators.required)
        ).toBeTruthy();
      });

      it('should return a defined field group', () =>
        expect(service.toFormGroup([fieldBaseStub])).toBeDefined());
    });

    describe('when required field is true && control type is AutoComplete', () => {
      const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      fieldBaseStub.controlType = ControlTypes.AutoComplete;

      it('should add the required validator from the Validator Service to the formcontrol', () => {
        validatorServiceStub.required.mockReturnValue(() => null);
        expect(
          service
            .toFormGroup([fieldBaseStub])
            .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
            .hasValidator(validatorServiceStub.required())
        ).toBeTruthy();
      });

      it('should return a defined field group', () =>
        expect(service.toFormGroup([fieldBaseStub])).toBeDefined());
    });

    describe('when required field is false', () => {
      const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      fieldBaseStub.required = false;

      it('should NOT add the required validator to the formcontrol', () => {
        expect(
          service
            .toFormGroup([fieldBaseStub])
            .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
            .hasValidator(Validators.required)
        ).toBeFalsy();
      });

      it('should return a defined field group', () =>
        expect(service.toFormGroup([fieldBaseStub])).toBeDefined());
    });

    describe('when field type is currency', () => {
      const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      fieldBaseStub.type = FieldTypes.Currency;

      it('should add the max int validator to the formcontrol', () => {
        expect(
          service
            .toFormGroup([fieldBaseStub])
            .get('CustomerAccountNumber')
            .hasValidator(service.maxValidator)
        ).toBeTruthy();
      });

      it('should return a defined field group', () =>
        expect(service.toFormGroup([fieldBaseStub])).toBeDefined());
    });

    describe('when field type is date', () => {
      const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
      fieldBaseStub.type = FieldTypes.Date;

      it('should add the max int validator to the formcontrol', () => {
        expect(
          service
            .toFormGroup([fieldBaseStub])
            .get(DocumentLabelKeys.nonLookupLabels.InvoiceDate)
            .hasValidator(validatorServiceStub.formDateValidator)
        ).toBeTruthy();
      });

      it('should return a defined field group', () =>
        expect(service.toFormGroup([fieldBaseStub])).toBeDefined());
    });
  });
});
