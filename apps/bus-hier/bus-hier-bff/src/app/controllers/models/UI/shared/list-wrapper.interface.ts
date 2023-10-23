import { ApiProperty } from '@nestjs/swagger';

export interface IListWrapper<T> {
  itemsRequested: number;
  itemsReturned: number;
  itemsTotal: number;
  offset: number;
  items: T[];
}

export class ListWrapper<T> implements IListWrapper<T> {
  @ApiProperty()
  itemsRequested: number;
  @ApiProperty()
  itemsReturned: number;
  @ApiProperty()
  itemsTotal: number;
  @ApiProperty()
  offset: number;
  @ApiProperty()
  items: T[];
}
