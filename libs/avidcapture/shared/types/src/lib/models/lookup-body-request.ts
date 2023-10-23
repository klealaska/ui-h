export interface LookupBodyRequest {
  organizationId: number;
  userId?: number;
  searchTerm: string;
  accountingSystemId?: number;
  page: number;
  pageSize: number;
}
