import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { EntityMapped } from '../../controllers';
import { entityMapper } from './entity.mapper';
import entity from '../../../assets/mock/json/get-entity-by-entity-id-cadlbfshs605o7i35wl3.json';

describe('entityMapper', () => {
  it('should return only the needed properties', () => {
    const result: EntityMapped = {
      entityName: 'Company C',
      entityCode: 'COMPC',
      entityId: 'cadlbfshs605o7i35wl3',
      erpId: '9ng7ljo918qvqunwworx',
      parentEntityId: null,
      businessLevel: 1,
      isActive: true,
      entityAddresses: [
        {
          addressId: 'o2cdjj82ehir5j7duwcz',
          entityId: '76mldl9dq5ozxtnodces',
          addressCode: 'Address Code',
          addressLine1: 'Address Line 1',
          addressLine2: null,
          addressLine3: null,
          addressLine4: null,
          locality: 'Locality',
          region: 'Alabama',
          country: 'USA',
          postalCode: '123456789',
          isPrimary: true,
          isActive: true,
          addressType: 'ShipTo',
          createdTimestamp: '2023-07-25T08:01:46Z',
          createdByUserId: 'bbhnnsw97z37im2fn11m',
          lastModifiedTimestamp: '2023-07-25T08:01:46Z',
          lastModifiedByUserId: '5lt72nsse0ofy0jlgzvo',
        },
      ],
    };

    expect(entityMapper(camelCaseObjectKeys(entity))).toEqual(result);
  });
});
