import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Matchers } from '@pact-foundation/pact';
import {
  customerAccountsStub,
  getPactConfig,
  orderedByStub,
  propertiesStub,
  suppliersStub,
  workflowStub,
} from '@ui-coe/avidcapture/shared/test';
import { Headers } from '@ui-coe/avidcapture/shared/types';
import { pactWith } from 'jest-pact';

import { LookupApiService } from './lookup-api.service';

const environmentStub = {
  lookupApiBaseUri: '',
} as any;

pactWith(getPactConfig('avidbillproxy-api'), provider => {
  describe('Lookup Api Service Pact', () => {
    let service: LookupApiService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          LookupApiService,
          {
            provide: 'environment',
            useValue: environmentStub,
          },
        ],
      });

      service = TestBed.inject(LookupApiService);
      environmentStub.lookupApiBaseUri = `${provider.mockService.baseUrl}/`;
    });

    describe('getSuppliers()', () => {
      const searchText = 'test';
      const buyerId = 25;
      const accountingsystemId = 1;

      const lookupSupplierResponseStub = {
        count: 50,
        records: suppliersStub,
      };

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET a list of suppliers',
          state: 'when getting a list of suppliers',
          withRequest: {
            method: 'GET',
            path: '/api/avidbill/getvendors',
            query: `limit=50&q=${encodeURIComponent(
              searchText
            )}&organizationId=${buyerId}&accountingsystemId=${accountingsystemId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(lookupSupplierResponseStub),
          },
        });
      });

      it('should get a list of suppliers', done => {
        service.getSuppliers(searchText, buyerId, accountingsystemId).subscribe(res => {
          expect(res).toEqual(lookupSupplierResponseStub);
          done();
        });
      });
    });

    describe('getProperties()', () => {
      const searchText = 'test';
      const buyerId = 25;
      const accountingsystemId = 1;

      const lookupPropertyResponseStub = {
        count: 50,
        records: propertiesStub,
      };

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET a list of properties',
          state: 'when getting a list of properties',
          withRequest: {
            method: 'GET',
            path: '/api/avidbill/getproperties',
            query: `limit=50&q=${encodeURIComponent(
              searchText
            )}&organizationId=${buyerId}&accountingsystemId=${accountingsystemId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(lookupPropertyResponseStub),
          },
        });
      });

      it('should get a list of properties', done => {
        service.getProperties(searchText, buyerId, accountingsystemId).subscribe(res => {
          expect(res).toEqual(lookupPropertyResponseStub);
          done();
        });
      });
    });

    describe('getCustomerAccounts()', () => {
      const searchText = 'test';
      const supplierId = 25;
      const exactMatch = false;

      const lookupCustomerAccountResponseStub = {
        count: 50,
        records: customerAccountsStub,
      };

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET a list of customer accounts',
          state: 'when getting a list of customer accounts',
          withRequest: {
            method: 'GET',
            path: '/api/avidbill/getvendoraccounts',
            query: `limit=50&q=${encodeURIComponent(
              searchText
            )}&vendorId=${supplierId}&exactMatch=${exactMatch}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(lookupCustomerAccountResponseStub),
          },
        });
      });

      it('should get a list of customer accounts', done => {
        service.getCustomerAccounts(searchText, supplierId, exactMatch).subscribe(res => {
          expect(res).toEqual(lookupCustomerAccountResponseStub);
          done();
        });
      });
    });

    describe('getUsers()', () => {
      const searchText = 'test';
      const buyerId = 25;

      const lookupOrderedByResponseStub = {
        count: 50,
        records: orderedByStub,
      };

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET a list of users',
          state: 'when getting a list of users',
          withRequest: {
            method: 'GET',
            path: '/api/avidbill/getUsers',
            query: `limit=50&q=${encodeURIComponent(searchText)}&organizationId=${buyerId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(lookupOrderedByResponseStub),
          },
        });
      });

      it('should get a list of users', done => {
        service.getUsers(searchText, buyerId).subscribe(res => {
          expect(res).toEqual(lookupOrderedByResponseStub);
          done();
        });
      });
    });

    describe('getWorkflow()', () => {
      const searchText = 'test';
      const buyerId = 25;

      const lookupWorkflowResponseStub = {
        count: 50,
        records: workflowStub,
      };

      beforeEach(async () => {
        await provider.addInteraction({
          uponReceiving: 'a request to GET a list of workflows',
          state: 'when getting a list of workflows',
          withRequest: {
            method: 'GET',
            path: '/api/avidbill/getWorkflows',
            query: `q=${encodeURIComponent(searchText)}&organizationId=${buyerId}`,
            headers: {
              [Headers.ContentType]: Headers.appJson,
            },
          },
          willRespondWith: {
            status: 200,
            body: Matchers.like(lookupWorkflowResponseStub),
          },
        });
      });

      it('should get a list of workflows', done => {
        service.getWorkflow(searchText, buyerId).subscribe(res => {
          expect(res).toEqual(lookupWorkflowResponseStub);
          done();
        });
      });
    });
  });
});
