export enum XdcApiUrls {
  // Archive
  GET_ARCHIVED_DOCUMENT = 'api/invoice/invoice/readonly/{documentId}',

  // Indexed
  PUT_INDEXED = 'api/indexed',
  PUT_INDEXED_SUBMIT = 'api/indexed/submit',
  POST_INDEXED_MASS_ESCALATION = 'api/indexed/massescalation',

  // Lock
  LOCK = 'api/lock/{documentId}',

  // Escalation
  PUT_ESCALATION = 'api/indexed/escalation',

  // IndexingUnit
  POST_INDEXINGUNIT = 'api/indexingunit',

  // Unindexed
  GET_UNINDEXED_DOCUMENT = 'api/invoice/invoice/{documentId}/user/{userId}',
  GET_NEXT_DOCUMENT = 'api/search/document/next/{userId}',
  GET_SKIP_DOCUMENT = 'api/search/document/skip/{username}/{currentDocumentId}/{skipDirection}',

  // Search
  POST_AGGREGATE = 'api/search/aggregate',
  POST_BULK_AGGREGATE = 'api/search/bulkaggregate',
  POST_SEARCH = 'api/search',
  POST_ARCHIVE = 'api/search/archive',

  //ADMIN
  GET_ADMIN_USERS = 'api/admin/users',

  // FILE
  GET_FILE = 'api/file/{documentId}',
  POST_FILE = 'api/file',

  //Pending upload
  GET_ALLPENDINGUPLOADS = 'api/pendingupload/getall',
  POST_PENDINGUPLOAD = 'api/pendingupload/create',
}

export enum BuyerKeywordServiceApiUrls {
  POST_REJECT_TO_SENDER_TEMPLATES = 'rejecttosender/templates/{buyerId}',
  POST_REJECT_TO_SENDER = 'rejecttosender/reject',
  POST_REJECT_TO_SENDER_CREATE = 'rejecttosender/create',
  POST_REJECT_TO_SENDER_EDIT = 'rejecttosender/edit',
  POST_REJECT_TO_SENDER_DELETE = 'rejecttosender/delete/{templateId}',
  POST_AGGREGATE = 'aggregate',
  POST_SEARCH = 'search',
}

export enum LookupApiUrls {
  GET_SUPPLIERS_V2 = 'api/avidbill/getsuppliers',
  GET_PROPERTIES_V2 = 'api/avidbill/getproperties',
  GET_SUPPLIERS = 'api/avidbill/getvendors?limit=50&q={searchText}&organizationId={buyerId}&accountingsystemId={accountingSystemID}',
  GET_PROPERTIES = 'api/avidbill/getproperties?limit=50&q={searchText}&organizationId={buyerId}&accountingsystemId={accountingSystemID}',
  GET_CUSTOMERACCOUNTS = 'api/avidbill/getvendoraccounts?limit=50&q={searchText}&vendorId={supplierId}&exactMatch={exactMatch}',
  GET_ORDEREDBY = 'api/avidbill/getUsers?limit=50&q={searchText}&organizationId={buyerId}',
  GET_WORKFLOW = 'api/avidbill/getWorkflows?q={searchText}&organizationId={buyerId}',
  GET_PAYMENTTERMS = 'api/avidbill/getPaymentTerms',
  GET_MAX_INVOICE_NUMBER_LENGTH = 'api/avidbill/getMaxInvoiceLength?supplierId={supplierId}&api-version=2.0',
  GET_SUPPLIER = 'api/avidbill/getsupplier?registrationCode={registrationCode}',
}

export enum InvoiceIngestionUrls {
  POST_FILE = 'indexing-ui-manual-upload/file',
}
