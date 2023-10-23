/**
 * because we will be including these in a string value for the sort_by query param
 * e.g. GET /tenant?sort_by=asc:site_name
 * the case mappers we have in the BFF will not map these, so we need to use the names
 * expected by platform here.
 */
export enum SortLabels {
  SITE_NAME = 'site_name',
  DATE_CREATED = 'created_date',
  TENANT_STATUS = 'tenant_status',
}

export enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}
