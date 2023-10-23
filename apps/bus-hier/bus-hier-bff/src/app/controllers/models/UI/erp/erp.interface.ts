import { ApiProperty } from '@nestjs/swagger';
import { ListWrapper } from '../shared';

export interface IErp {
  organizationId: string;
  erpId: string;
  erpName: string;
  erpCode: string;
  companyDatabaseName: string;
  companyDatabaseId: number;
  isCrossCompanyCodingAllowed: boolean;
  isActive: boolean;
  purchaseOrderPrefix: string;
  startingPurchaseOrderNumber: number;
  createdTimestamp: string;
  createdByUserId: string;
  lastModifiedTimestamp: string;
  lastModifiedByUserId: string;
}

export interface IErpMapped {
  organizationId: string;
  erpId: string;
  erpName: string;
  erpCode: string;
  isActive: boolean;
}

export class ErpMapped implements IErpMapped {
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  erpName: string;
  @ApiProperty()
  erpCode: string;
  @ApiProperty()
  isActive: boolean;
}

export class ErpList implements ListWrapper<ErpMapped> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [ErpMapped] })
  items: ErpMapped[];
}

export class Erp implements IErp {
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  erpName: string;
  @ApiProperty()
  erpCode: string;
  @ApiProperty()
  companyDatabaseName: string;
  @ApiProperty()
  companyDatabaseId: number;
  @ApiProperty()
  isCrossCompanyCodingAllowed: boolean;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  purchaseOrderPrefix: string;
  @ApiProperty()
  startingPurchaseOrderNumber: number;
  @ApiProperty()
  createdTimestamp: string;
  @ApiProperty()
  createdByUserId: string;
  @ApiProperty()
  lastModifiedTimestamp: string;
  @ApiProperty()
  lastModifiedByUserId: string;
}
