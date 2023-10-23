export interface Environment {
  production: string;
  isBeta: string;
  apiBaseUri: string;
  bkwsBaseUri: string;
  lookupApiBaseUri: string;
  invoiceIngestionApiBaseUri: string;
  appInsights: AppInsights;
  avidInboxLink: string;
  avidInvoiceLink: string;
  clientGuidelinesLink: string;
  appConfigConnectionString: string;
  avidSuiteInvoiceUrl: string;
  maxUnindexedPages: string;
  avidAuthBaseUri: string;
  avidAuthLoginUrl: string;
}

interface AppInsights {
  instrumentationKey: string;
}
