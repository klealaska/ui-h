import { ApiProperty } from '@nestjs/swagger';
import { Address, IAddress, ListWrapper } from '../shared';

export interface IEntityFull {
  entityName: string;
  entityCode: string;
  entityId: string;
  erpId: string;
  parentEntityId: string;
  businessLevel: number;
  entityAddresses: IEntityAddress[];
  isActive: boolean;
  createdTimestamp: string;
  createdByUserId: string;
  lastModifiedTimestamp: string;
  lastModifiedByUserId: string;
}

export class EntityFull implements IEntityFull {
  @ApiProperty()
  entityName: string;
  @ApiProperty()
  entityCode: string;
  @ApiProperty()
  entityId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  parentEntityId: string;
  @ApiProperty()
  businessLevel: number;
  @ApiProperty()
  entityAddresses: IEntityAddress[];
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdTimestamp: string;
  @ApiProperty()
  createdByUserId: string;
  @ApiProperty()
  lastModifiedTimestamp: string;
  @ApiProperty()
  lastModifiedByUserId: string;
}

export class EntityFullList implements ListWrapper<EntityFull> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [EntityFull] })
  items: EntityFull[];
}

export type IEntityMapped = Omit<
  IEntityFull,
  'createdTimestamp' | 'createdByUserId' | 'lastModifiedTimestamp' | 'lastModifiedByUserId'
>;

export class EntityMapped implements IEntityMapped {
  @ApiProperty()
  entityName: string;
  @ApiProperty()
  entityCode: string;
  @ApiProperty()
  entityId: string;
  @ApiProperty()
  erpId: string;
  @ApiProperty()
  parentEntityId: string;
  @ApiProperty()
  businessLevel: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  entityAddresses: IEntityAddress[];
}

export class EntityList implements ListWrapper<EntityMapped> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty({ type: [EntityMapped] })
  items: EntityMapped[];
}

export interface IEntityAddress extends IAddress {
  entityId: string;
}

export class EntityAddress extends Address implements IEntityAddress {
  @ApiProperty()
  entityId: string;
}
