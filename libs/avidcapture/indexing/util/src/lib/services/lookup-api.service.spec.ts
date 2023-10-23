import {
  LookupBodyRequest,
  LookupCustomerAccountResponse,
  LookupOrderedByResponse,
  LookupPropertyResponse,
  LookupSupplierResponse,
  LookupWorkflowResponse,
} from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { LookupApiService } from './lookup-api.service';

const environmentStub = {
  lookupApiBaseUri: 'http://localhost:3000/',
} as any;

describe('LookupService', () => {
  let httpClientSpy: {
    get: jest.SpyInstance;
    post: jest.SpyInstance;
  };
  let lookupService: LookupApiService;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
    };
    lookupService = new LookupApiService(httpClientSpy as any, environmentStub);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedSuppliers: LookupSupplierResponse = {
    count: 1,
    records: [
      {
        vendorID: 7678846,
        vendorName: 'Earth, Wind, & Tire Automotive',
        vendorExternalSystemID: 'V00101',
        line1: '1531 Johnny Lane',
        line2: '123 Happy Jane Lane',
        city: 'Milwaukee',
        state: 'WI',
        postalCode: '53202',
        accountingSystemID: 4811,
        allowRetainage: false,
        vendorRegistrationCode: 'test',
        aliases: 'test',
      },
    ],
  };

  const mockedProperties: LookupPropertyResponse = {
    count: 1,
    records: [
      {
        propertyAddressID: 545600,
        propertyId: 50834279,
        propertyName: '102 Franklin',
        propertyAddressCount: 1,
        alias: '102',
        line1: '102 Franklin St',
        line2: 'Apt B',
        city: 'Charlotte',
        state: 'NC',
        postalCode: '28214',
        propertyCode: '102F',
        accountingSystemID: 5947,
        addressIsActive: true,
        propertyIsActive: true,
      },
    ],
  };

  const mockedCustomerAccounts: LookupCustomerAccountResponse = {
    count: 1,
    records: [
      {
        vendorAccountId: 12033990,
        accountNo: 'none',
        propertyId: 36423868,
        propertyName: 'Pipe Test',
        termTypeId: 1,
        allowRetainage: true,
        isActive: true,
        propertyAddress: {
          propertyId: 36423868,
          propertyName: 'Pipe Test',
          propertyAddressID: 545600,
          propertyAddressCount: 1,
          alias: '102',
          line1: '102 Franklin St',
          line2: 'Apt B',
          city: 'Charlotte',
          state: 'NC',
          postalCode: '28214',
          propertyCode: '102F',
          accountingSystemID: 5947,
          propertyIsActive: true,
          addressIsActive: true,
        },
      },
    ],
  };

  const mockedUsers: LookupOrderedByResponse = {
    count: 1,
    records: [{ id: '', firstName: '', lastName: '', email: '' }],
  };

  const mockedWorkflow: LookupWorkflowResponse = {
    count: 1,
    records: [{ id: '', name: '' }],
  };

  describe('getSuppliers()', () => {
    const supplierBodyRequest: LookupBodyRequest = {
      organizationId: '1' as any,
      accountingSystemId: null,
      searchTerm: 'mockSupplier',
      page: 1,
      pageSize: 50,
    };

    describe('when avidBillProxyV2SupplierIsActive is TRUE', () => {
      it('should return suppliers from service', done => {
        httpClientSpy.post.mockReturnValue(of(mockedSuppliers));

        lookupService
          .getSuppliers(of(true), supplierBodyRequest, 'test', 1, 1)
          .subscribe(response => {
            expect(response).toEqual(mockedSuppliers);
            done();
          });

        expect(httpClientSpy.post.mock.calls.length).toBe(1);
      });
    });

    describe('when accountingSystemID is passed in', () => {
      it('should return suppliers from service', done => {
        httpClientSpy.get.mockReturnValue(of(mockedSuppliers));

        lookupService
          .getSuppliers(of(false), supplierBodyRequest, 'test', 1, 1)
          .subscribe(response => {
            expect(response).toEqual(mockedSuppliers);
            done();
          });

        expect(httpClientSpy.get.mock.calls.length).toBe(1);
      });
    });

    describe('when accountingSystemID is NOT passed in', () => {
      it('should return suppliers from service', done => {
        httpClientSpy.get.mockReturnValue(of(mockedSuppliers));

        lookupService
          .getSuppliers(of(false), supplierBodyRequest, 'test', 1)
          .subscribe(response => {
            expect(response).toEqual(mockedSuppliers);
            done();
          });

        expect(httpClientSpy.get.mock.calls.length).toBe(1);
      });
    });
  });

  describe('getProperties()', () => {
    const propertyBodyRequest: LookupBodyRequest = {
      organizationId: '1' as any,
      accountingSystemId: null,
      searchTerm: 'mockShipTo',
      page: 1,
      pageSize: 50,
    };

    describe('when avidBillProxyV2PropertyIsActive is TRUE', () => {
      it('should return properties from service', done => {
        httpClientSpy.post.mockReturnValue(of(mockedSuppliers));

        lookupService
          .getProperties(of(true), propertyBodyRequest, 'test', 1, 1)
          .subscribe(response => {
            expect(response).toEqual(mockedSuppliers);
            done();
          });

        expect(httpClientSpy.post.mock.calls.length).toBe(1);
      });
    });

    describe('when accountingSystemID is passed in', () => {
      it('should return properties from service', done => {
        httpClientSpy.get.mockReturnValue(of(mockedProperties));

        lookupService
          .getProperties(of(false), propertyBodyRequest, 'test', 1, 1)
          .subscribe(response => {
            expect(response).toEqual(mockedProperties);
            done();
          });

        expect(httpClientSpy.get.mock.calls.length).toBe(1);
      });
    });

    describe('when accountingSystemID is NOT passed in', () => {
      it('should return properties from service', done => {
        httpClientSpy.get.mockReturnValue(of(mockedProperties));

        lookupService
          .getProperties(of(false), propertyBodyRequest, 'test', 1)
          .subscribe(response => {
            expect(response).toEqual(mockedProperties);
            done();
          });

        expect(httpClientSpy.get.mock.calls.length).toBe(1);
      });
    });
  });

  it('should return customer accounts from service', done => {
    httpClientSpy.get.mockReturnValue(of(mockedCustomerAccounts));

    lookupService.getCustomerAccounts('test', 1).subscribe(response => {
      expect(response).toEqual(mockedCustomerAccounts);
      done();
    });

    expect(httpClientSpy.get.mock.calls.length).toBe(1);
  });

  it('should return orderedBy accounts from service', done => {
    httpClientSpy.get.mockReturnValue(of(mockedUsers));
    lookupService.getUsers('test', 1).subscribe(response => {
      expect(response).toEqual(mockedUsers);
      done();
    });
    expect(httpClientSpy.get.mock.calls.length).toBe(1);
  });

  it('should return workflow accounts from service', done => {
    httpClientSpy.get.mockReturnValue(of(mockedWorkflow));
    lookupService.getWorkflow('test', 1).subscribe(response => {
      expect(response).toEqual(mockedWorkflow);
      done();
    });
    expect(httpClientSpy.get.mock.calls.length).toBe(1);
  });

  it('should return payment terms from service', done => {
    const mockedPaymentTerms = [
      {
        termTypeId: 1,
        termTypeName: 'test',
        numberDaysUntilDue: 1,
        isEndOfMonth: false,
      },
    ];
    httpClientSpy.get.mockReturnValue(of(mockedPaymentTerms));
    lookupService.getPaymentTerms().subscribe(response => {
      expect(response).toEqual(mockedPaymentTerms);
      done();
    });
    expect(httpClientSpy.get.mock.calls.length).toBe(1);
  });

  describe('getMaxInvoiceNumberLength()', () => {
    describe('when accountingSystemID is passed in', () => {
      it('should return maxInvoiceNumberLength', done => {
        httpClientSpy.get.mockReturnValue(of(50));

        lookupService.getMaxInvoiceNumberLength('1').subscribe(response => {
          expect(response).toEqual(50);
          done();
        });

        expect(httpClientSpy.get.mock.calls.length).toBe(1);
      });
    });
  });

  describe('getSupplier()', () => {
    describe('when registrationCode is passed in', () => {
      it('should return a supplier', done => {
        httpClientSpy.get.mockReturnValue(of(mockedSuppliers.records[0]));

        lookupService.getSupplier('SD44SDF').subscribe(response => {
          expect(response.vendorID).toEqual(mockedSuppliers.records[0].vendorID);
          done();
        });

        expect(httpClientSpy.get.mock.calls.length).toBe(1);
      });
    });
  });
});
