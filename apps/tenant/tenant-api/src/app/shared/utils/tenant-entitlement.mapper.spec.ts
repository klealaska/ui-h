import { TenantEntitlement, TenantEntitlementMapped } from '../../controllers';
import { tenantEntitlementMapper } from './tenant-entitlement.mapper';

describe('tenantEntitlementMapper', () => {
  it('should properly map a TenantEntitlement', () => {
    const entitlement: TenantEntitlement = {
      tenantId: 'string',
      productEntitlementId: 'string',
      productEntitlementName: 'string',
      tenantEntitlementStatus: 'Active',
      assignmentDate: 'string',
      amount: 0,
      assignmentSource: 'string',
      sourceSystem: 'string',
      createdDate: 'string',
      lastModifiedDate: 'string',
      createdByUserId: 'string',
      lastModifiedByUserId: 'string',
    };

    const mappedEntitlement: TenantEntitlementMapped = {
      tenantId: 'string',
      productEntitlementId: 'string',
      productEntitlementName: 'string',
      tenantEntitlementStatus: 'Active',
    };

    expect(tenantEntitlementMapper(entitlement)).toEqual(mappedEntitlement);
  });
});
