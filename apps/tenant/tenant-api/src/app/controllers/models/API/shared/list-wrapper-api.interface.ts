export interface IListWrapperAPI<T> {
  items_requested: number;
  items_returned: number;
  items_total: number;
  offset: number;
  items: T[];
}
