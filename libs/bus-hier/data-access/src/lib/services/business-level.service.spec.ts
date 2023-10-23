import { HttpClient } from '@angular/common/http';
import { BusinessLevelService } from './business-level.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { ConfigService } from '@ui-coe/shared/util/services';
import { IBusinessLevelDetails, IEditBusinessLevelName } from '@ui-coe/bus-hier/shared/types';

describe('BusinessLevelService', () => {
  let service: BusinessLevelService;
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
    service = TestBed.inject(BusinessLevelService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateBusinessLevelName', () => {
    it('should return an observable of type IBusinessLevelDetails', () => {
      const id = '2pdhsigrx3z9us8g2jji';
      const editBusinessLevelName: IEditBusinessLevelName = {
        businessLevelId: id,
        body: {
          businessLevelNameSingular: 'foo',
          businessLevelNamePlural: 'bar',
        },
      };

      const businessLevelResponse: IBusinessLevelDetails = {
        businessLevelId: id,
        businessLevelNameSingular: 'foo',
        businessLevelNamePlural: 'bar',
        level: 1,
        isActive: true,
        createdTimestamp: '2023-04-12T21:08:17Z',
        createdByUserId: 'kr1rkw2ymzknri8kgo8m',
        lastModifiedTimestamp: '2023-04-12T21:08:17Z',
        lastModifiedByUserId: 'h2k49ykoue9jm733d4rj',
        erpId: '2pdhsigrx3z9us8g2jji',
      };
      const expected = cold('(a|)', { a: businessLevelResponse });

      jest.spyOn(httpClient, 'put').mockReturnValue(of(businessLevelResponse));

      service.updateBusinessLevelName(editBusinessLevelName);
      expect(service.updateBusinessLevelName(editBusinessLevelName)).toBeObservable(expected);
    });
  });
});
