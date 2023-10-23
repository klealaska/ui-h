export interface IListWrapper<T> {
  itemsRequested: number;
  itemsReturned: number;
  itemsTotal: number;
  offset: number;
  items: T[];
}
