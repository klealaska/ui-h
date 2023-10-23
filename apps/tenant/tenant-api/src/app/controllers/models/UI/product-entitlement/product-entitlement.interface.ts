import { ApiProperty } from '@nestjs/swagger';
import { IListWrapper } from '../shared';

export interface IProductEntitlement {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
  unitOfMeasure: string;
  sourceSystem: string;
}
export interface IProductEntitlementMapped {
  id: string;
  name: string;
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
}
export class ProductEntitlement implements IProductEntitlement {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
  @ApiProperty()
  unitOfMeasure: string;
  @ApiProperty()
  sourceSystem: string;
}

export class ProductEntitlementsList implements IListWrapper<IProductEntitlement> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ isArray: true })
  items: IProductEntitlement[];
}

export class ProductEntitlementMapped implements IProductEntitlementMapped {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
}
