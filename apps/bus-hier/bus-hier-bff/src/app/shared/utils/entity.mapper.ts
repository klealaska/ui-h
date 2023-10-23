import { generalObjectMapper } from '@ui-coe/shared/bff/util';
import { EntityMapped, IEntityFull } from '../../controllers';

export function entityMapper(entity: IEntityFull) {
  return generalObjectMapper<IEntityFull, EntityMapped>(entity, {
    entityName: 'entityName',
    entityCode: 'entityCode',
    entityId: 'entityId',
    erpId: 'erpId',
    parentEntityId: 'parentEntityId',
    businessLevel: 'businessLevel',
    isActive: 'isActive',
    entityAddresses: 'entityAddresses',
  });
}
