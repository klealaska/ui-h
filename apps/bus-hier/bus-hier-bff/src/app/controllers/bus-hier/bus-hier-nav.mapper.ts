import { generalObjectMapper } from '@ui-coe/shared/bff/util';
import {
  BusinessHierarchyBusinessLevel,
  BusinessHierarchyCount,
  BusinessHierarchyNav,
  BusinessLevelMapped,
  BusinessLevelMappedWithCount,
  BusinessLevelSelectedEntity,
  EntitiesByBusinessLevel,
  EntityMapped,
  Erp,
  Organization,
} from '../models';

/**
 * @function businessLevelMapper
 * @param businessLevels BusinessLevelMapped[]
 * @param count EntitiesByBusinessLevel[]
 * @returns `BusinessHierarchyBusinessLevel[]`
 */
export function businessLevelMapper(
  businessLevels: BusinessLevelMapped[],
  count: EntitiesByBusinessLevel[] = []
): BusinessHierarchyBusinessLevel[] {
  return businessLevels.map((item: BusinessLevelMapped) => {
    const newObj: BusinessLevelMappedWithCount = {
      ...item,
      count: null,
    };

    if (count.length) {
      const numEntBusLev: EntitiesByBusinessLevel = count.find(
        (ent: EntitiesByBusinessLevel) => ent.businessLevel === item.level
      );
      newObj.count = numEntBusLev?.numberOfEntities;
    }

    const mappedBusinessLevel: BusinessHierarchyBusinessLevel = generalObjectMapper<
      BusinessLevelMappedWithCount,
      BusinessHierarchyBusinessLevel
    >(newObj, {
      level: 'level',
      id: 'businessLevelId',
      count: 'count',
      'name.singular': 'businessLevelNameSingular',
      'name.plural': 'businessLevelNamePlural',
    });

    mappedBusinessLevel.selectedEntity = null;

    return mappedBusinessLevel;
  });
}

/**
 * @function responseObjectMapper
 * @param obj `{
 *   count: BusinessHierarchyCount;
 *   orgs: Organization;
 *   erps: Erp;
 * }`
 * @returns `BusinessHierarchyNav`
 */
export function responseObjectMapper(obj: {
  count: BusinessHierarchyCount;
  org: Organization;
  erp: Erp;
}): BusinessHierarchyNav {
  return generalObjectMapper(obj, {
    'organization.count': 'count.numberOfOrganizations',
    'organization.id': 'org.organizationId',
    'organization.name': 'org.organizationName',
    'organization.code': 'org.organizationCode',
    'organization.isActive': 'org.isActive',
    'erp.count': 'count.numberOfErps',
    'erp.id': 'erp.erpId',
    'erp.name': 'erp.erpName',
    'erp.code': 'erp.erpCode',
    'erp.isActive': 'erp.isActive',
    'businessLevel.depth': 'count.maximumDepthOfBusinessLevels',
  });
}

/**
 * @function navEntityMapper
 * @param entity EntityMapped
 * @returns `BusinessLevelSelectedEntity`
 */
export function navEntityMapper(entity: EntityMapped): BusinessLevelSelectedEntity {
  return generalObjectMapper(entity, {
    name: 'entityName',
    id: 'entityId',
    code: 'entityCode',
    isActive: 'isActive',
    parentEntityId: 'parentEntityId',
  });
}
