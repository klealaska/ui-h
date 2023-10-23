import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IERP } from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ErpService } from './erp-service.service';

describe('ErpServiceService', () => {
  let service: ErpService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockURL'),
          },
        },
      ],
    });
    service = TestBed.inject(ErpService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getErpById', () => {
    it('should return an observable of type ERP interface', () => {
      const id = '2pdhsigrx3z9us8g2jji';
      const erp: IERP = {
        organizationId: null,
        erpId: '2pdhsigrx3z9us8g2jji',
        erpName: 'Sage Intacct',
        erpCode: '123',
        companyDatabaseName: null,
        companyDatabaseId: null,
        isCrossCompanyCodingAllowed: null,
        isActive: true,
        purchaseOrderPrefix: null,
        startingPurchaseOrderNumber: null,
        createdTimestamp: '2023-04-12T21:08:17Z',
        createdByUserId: 'kr1rkw2ymzknri8kgo8m',
        lastModifiedTimestamp: '2023-04-12T21:08:17Z',
        lastModifiedByUserId: 'h2k49ykoue9jm733d4rj',
      };

      const expected = cold('(a|)', { a: erp });

      jest.spyOn(httpClient, 'get').mockReturnValue(of(erp));
      expect(service.getErpById(id)).toBeObservable(expected);
    });
  });
});
