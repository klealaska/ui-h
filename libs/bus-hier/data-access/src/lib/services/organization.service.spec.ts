import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IEditEntityBody, IOrganization } from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { OrganizationService } from './organization.service';

describe('OrganizationService', () => {
  let service: OrganizationService;
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
    service = TestBed.inject(OrganizationService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrganization', () => {
    it('should return an observable of type IOrganization', () => {
      const id = '2pdhsigrx3z9us8g2jji';
      const org: IOrganization = {
        organizationId: null,
        organizationName: 'foo',
        organizationCode: 'bar',
        isActive: true,
        createdTimestamp: '2023-04-12T21:08:17Z',
        createdByUserId: 'kr1rkw2ymzknri8kgo8m',
        lastModifiedTimestamp: '2023-04-12T21:08:17Z',
        lastModifiedByUserId: 'h2k49ykoue9jm733d4rj',
        erps: ['Sage Intacct'],
        organizationAddresses: [],
      };
      const expected = cold('(a|)', { a: org });
      jest.spyOn(httpClient, 'get').mockReturnValue(of(org));
      service.getOrganization(id);
      expect(service.getOrganization(id)).toBeObservable(expected);
    });
  });

  describe('editOrganization', () => {
    it('should return an observable of type IOrganization', () => {
      const id = '2pdhsigrx3z9us8g2jji';
      const editOrg: IEditEntityBody = {
        name: 'foo',
        code: 'bar',
      };
      const orgResponse: IOrganization = {
        organizationId: null,
        organizationName: 'foo',
        organizationCode: 'bar',
        isActive: true,
        createdTimestamp: '2023-04-12T21:08:17Z',
        createdByUserId: 'kr1rkw2ymzknri8kgo8m',
        lastModifiedTimestamp: '2023-04-12T21:08:17Z',
        lastModifiedByUserId: 'h2k49ykoue9jm733d4rj',
        erps: ['Sage Intacct'],
        organizationAddresses: [],
      };
      const expected = cold('(a|)', { a: orgResponse });
      jest.spyOn(httpClient, 'put').mockReturnValue(of(orgResponse));
      expect(service.editOrganization(id, editOrg)).toBeObservable(expected);
    });
  });

  describe('activate deactivate address', () => {
    it('should return an observable of type {} interface when deactivateOrganizationAddress is called', () => {
      const expected = cold('(a|)', { a: {} });
      jest.spyOn(httpClient, 'patch').mockReturnValue(of({}));
      expect(service.deactivateOrganizationAddress('', '')).toBeObservable(expected);
    });

    it('should return an observable of type {} interface when activateOrganizationAddress is called', () => {
      const expected = cold('(a|)', { a: {} });
      jest.spyOn(httpClient, 'patch').mockReturnValue(of({}));
      expect(service.activateOrganizationAddress('', '')).toBeObservable(expected);
    });
  });
});
