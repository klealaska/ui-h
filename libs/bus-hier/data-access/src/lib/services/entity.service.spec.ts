import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { IMappedEntitiesResponse, IMappedEntity } from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { EntityService } from './entity.service';

describe('EntityService', () => {
  let service: EntityService;
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
    service = TestBed.inject(EntityService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of type IMappedEntitiesResponse interface', () => {
    const erpdId = '123';
    const level = 1;
    const mappedEntities: IMappedEntitiesResponse = {
      items: [
        {
          businessLevel: 1,
          entityCode: 'COMPC',
          entityId: 'cadlbfshs605o7i35wl3',
          entityName: 'Company C',
          erpId: '9ng7ljo918qvqunwworx',
          isActive: true,
          parentEntityId: null,
          entityAddresses: [],
        },
      ],
    };

    const expected = cold('(a|)', { a: mappedEntities });

    jest.spyOn(httpClient, 'get').mockReturnValue(of(mappedEntities));
    expect(service.getEntities(erpdId, level, null)).toBeObservable(expected);
  });

  it('should return an observable of type IMappedEntity interface when getEntityById is called', () => {
    const mappedEntity: IMappedEntity = {
      businessLevel: 1,
      entityCode: 'COMPC',
      entityId: 'cadlbfshs605o7i35wl3',
      entityName: 'Company C',
      erpId: '9ng7ljo918qvqunwworx',
      isActive: true,
      parentEntityId: null,
      entityAddresses: [],
    };

    const expected = cold('(a|)', { a: mappedEntity });

    jest.spyOn(httpClient, 'get').mockReturnValue(of(mappedEntity));
    expect(service.getEntityById('cadlbfshs605o7i35wl3')).toBeObservable(expected);
  });
  it('should return an observable of type {} interface when deactiveEntityAddress is called', () => {
    const expected = cold('(a|)', { a: {} });
    jest.spyOn(httpClient, 'patch').mockReturnValue(of({}));
    expect(service.deactiveEntityAddress('', '')).toBeObservable(expected);
  });

  it('should return an observable of type {} interface when activateEntityAddress is called', () => {
    const expected = cold('(a|)', { a: {} });
    jest.spyOn(httpClient, 'patch').mockReturnValue(of({}));
    expect(service.activeEntityAddress('', '')).toBeObservable(expected);
  });

  it('should return an observable of type IMappedEntityAdddress interface when editEntityAddress is called', () => {
    const address = {
      addressId: '1',
      addressCode: '222',
      addressLine1: '123 Elm Street',
      locality: 'sandiego',
      region: 'CA',
      postalCode: '12344',
      isActive: true,
      addressType: 'BillTo',
      country: 'USA',
      isPrimary: true,
    };
    const expected = cold('(a|)', { a: address });
    jest.spyOn(httpClient, 'put').mockReturnValue(of(address));
    expect(service.editEntityAddress('123', address)).toBeObservable(expected);
  });
});
