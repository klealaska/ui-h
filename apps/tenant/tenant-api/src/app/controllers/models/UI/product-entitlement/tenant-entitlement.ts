import { ApiProperty } from '@nestjs/swagger';

export interface ITenantEntitlement {
  tenantId: string;
  productEntitlementId: string;
  productEntitlementName: string;
  tenantEntitlementStatus: 'Active' | 'Deactivated';
  assignmentDate: string;
  amount: number;
  assignmentSource: string;
  sourceSystem: string;
  createdDate: string;
  lastModifiedDate: string;
  createdByUserId: string;
  lastModifiedByUserId: string;
}

export interface ITenantEntitlementMapped {
  tenantId: string;
  productEntitlementId: string;
  productEntitlementName: string;
  tenantEntitlementStatus: 'Active' | 'Deactivated';
}

export class TenantEntitlementMapped implements ITenantEntitlementMapped {
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  productEntitlementId: string;
  @ApiProperty()
  productEntitlementName: string;
  @ApiProperty()
  tenantEntitlementStatus: 'Active' | 'Deactivated';
}

export class TenantEntitlement implements ITenantEntitlement {
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  productEntitlementId: string;
  @ApiProperty()
  productEntitlementName: string;
  @ApiProperty()
  tenantEntitlementStatus: 'Active' | 'Deactivated';
  @ApiProperty()
  assignmentDate: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  assignmentSource: string;
  @ApiProperty()
  sourceSystem: string;
  @ApiProperty()
  createdDate: string;
  @ApiProperty()
  lastModifiedDate: string;
  @ApiProperty()
  createdByUserId: string;
  @ApiProperty()
  lastModifiedByUserId: string;
}
