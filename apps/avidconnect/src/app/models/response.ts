export interface AvidConnectDataSource<T> {
  items: Array<T>;
  paging: Paging;
}
export interface Paging {
  pageItems: number;
  pageNumber: number;
  pageSize: number;
  pages: number;
  queryTimeStamp: string;
  totalItems: number;
}

export interface AvidException {
  avidMessageId: string;
  detail: string;
  reason: string;
  source: string;
}
