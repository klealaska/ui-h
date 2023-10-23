import { generalObjectMapper } from '@ui-coe/shared/bff/util';
import { BusinessLevelMapped, IBusinessLevel } from '../../controllers';

export function businessLevelMapper(businessLevel: IBusinessLevel) {
  return generalObjectMapper<IBusinessLevel, BusinessLevelMapped>(businessLevel, {
    businessLevelId: 'businessLevelId',
    level: 'level',
    erpId: 'erpId',
    businessLevelNamePlural: 'businessLevelNamePlural',
    businessLevelNameSingular: 'businessLevelNameSingular',
    isActive: 'isActive',
  });
}
