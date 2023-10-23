export interface IGetTenant<T> {
  itemsRequested: number;
  itemsReturned: number;
  itemsTotal: number;
  offset: number;
  items: T[];
}
