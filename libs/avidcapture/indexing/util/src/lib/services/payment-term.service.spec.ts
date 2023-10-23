import { TestBed } from '@angular/core/testing';

import { PaymentTermService } from './payment-term.service';
import { getFieldBaseStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';

describe('paymentTerm', () => {
  let service: PaymentTermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentTermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDueDate', () => {
    describe('When getPaymentTerm returns null value', () => {
      beforeEach(() => {
        jest.spyOn(service, 'getPaymentTerm').mockReturnValue(null);
      });

      it('should return null value', () => {
        expect(
          service.getDueDate(
            getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
            '05/13/2022',
            {
              termTypeId: 1,
              termTypeName: null,
              numberDaysUntilDue: 0,
              isEndOfMonth: false,
            }
          )
        ).toEqual(null);
      });
    });

    describe('When getPaymentTerm returns a payment term and isEndOfMonth false', () => {
      beforeEach(() => {
        jest.spyOn(service, 'getPaymentTerm').mockReturnValue({
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 10,
          isEndOfMonth: false,
        });
      });

      it('should return 05/23/22', () => {
        expect(
          service.getDueDate(
            getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
            '05/13/2022',
            {
              termTypeId: 1,
              termTypeName: null,
              numberDaysUntilDue: 0,
              isEndOfMonth: false,
            }
          )
        ).toEqual('05/23/22');
      });
    });

    describe('When getPaymentTerm returns a payment term and isEndOfMonth true', () => {
      beforeEach(() => {
        jest.spyOn(service, 'getPaymentTerm').mockReturnValue({
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 10,
          isEndOfMonth: true,
        });
      });

      it('should return 06/10/22', () => {
        expect(
          service.getDueDate(
            getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
            '05/13/2022',
            {
              termTypeId: 1,
              termTypeName: null,
              numberDaysUntilDue: 0,
              isEndOfMonth: false,
            }
          )
        ).toEqual('06/10/22');
      });
    });

    describe('When getPaymentTerm returns a payment term and isEndOfMonth true', () => {
      beforeEach(() => {
        jest.spyOn(service, 'getPaymentTerm').mockReturnValue({
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 20,
          isEndOfMonth: true,
        });
      });

      it('should return 06/20/22', () => {
        expect(
          service.getDueDate(
            getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
            '05/31/2022',
            {
              termTypeId: 1,
              termTypeName: null,
              numberDaysUntilDue: 0,
              isEndOfMonth: false,
            }
          )
        ).toEqual('06/20/22');
      });
    });
  });

  describe('getPaymentTerm', () => {
    beforeAll(() => {
      jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation();
    });
    describe('When finds a payment term by id', () => {
      it('return payment term', () => {
        window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() =>
          JSON.stringify([
            {
              termTypeId: 1,
              termTypeName: 'test',
              numberDaysUntilDue: 1,
              isEndOfMonth: false,
            },
          ])
        );
        expect(
          service.getPaymentTerm({
            termTypeId: 1,
            termTypeName: null,
            numberDaysUntilDue: 0,
            isEndOfMonth: false,
          })
        ).toEqual({
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 1,
          isEndOfMonth: false,
        });
      });
    });

    describe('When finds a payment term by name', () => {
      it('return payment term', () => {
        window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() =>
          JSON.stringify([
            {
              termTypeId: 1,
              termTypeName: 'test',
              numberDaysUntilDue: 1,
              isEndOfMonth: false,
            },
          ])
        );
        expect(
          service.getPaymentTerm({
            termTypeId: 0,
            termTypeName: 'test',
            numberDaysUntilDue: 0,
            isEndOfMonth: false,
          })
        ).toEqual({
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 1,
          isEndOfMonth: false,
        });
      });
    });

    describe('When does not find a payment term by id', () => {
      it('return null', () => {
        window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() =>
          JSON.stringify([
            {
              termTypeId: 1,
              termTypeName: 'test',
              numberDaysUntilDue: 1,
              isEndOfMonth: false,
            },
          ])
        );
        expect(
          service.getPaymentTerm({
            termTypeId: 2,
            termTypeName: null,
            numberDaysUntilDue: 0,
            isEndOfMonth: false,
          })
        ).toEqual(null);
      });
    });

    describe('When there is no payment term data on localstorage', () => {
      it('return null', () => {
        expect(
          service.getPaymentTerm({
            termTypeId: 2,
            termTypeName: null,
            numberDaysUntilDue: 0,
            isEndOfMonth: false,
          })
        ).toEqual(null);
      });
    });
  });
});
