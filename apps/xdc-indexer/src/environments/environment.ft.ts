// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --dev` replaces `environment.ts` with `environment.dev.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  isBeta: 'true',
  apiBaseUri: 'https://api-ft01.devavidxcloud.com/v1/avidcaptureapi/',
  bkwsBaseUri: 'https://api-ft01.devavidxcloud.com/v1/buyerkeywordservice/',
  lookupApiBaseUri: 'https://api-ft01.devavidxcloud.com/v1/avidbillproxy/',
  invoiceIngestionApiBaseUri: 'https://api-ft01.devavidxcloud.com/v1/',
  appInsights: {
    instrumentationKey: '8d5c519e-0686-40f5-b7aa-8a64349fc933',
  },
  avidInboxLink: 'https://avidinbox.asqa01avidxchange.net/InvoiceProcessor',
  avidInvoiceLink:
    'https://api-ft01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/sso/initiate?to_app=AvidSuite&amp;to_url=https://one.asqa01avidxchange.net',
  clientGuidelinesLink: 'https://help.avidxchange.com/s/article/AvidInvoice-Indexing-Guidelines',
  appConfigConnectionString:
    'Endpoint=https://ax-ae1-ft-idc-invrecog-appconfig.azconfig.io;Id=O24Y-l0-s0:iJplIgmpiv6lE57MCKV9;Secret=4g9rzs1R3RhBGxmEV2EIE4lvjJQKbYNQCSedwUsuktw=',
  avidSuiteInvoiceUrl: 'https://one.asqa01avidxchange.net/#/invoices/',
  maxUnindexedPages: '10',
  avidAuthBaseUri: 'https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/',
  avidAuthLoginUrl: 'https://login.qa.avidsuite.com',
  titleImage: {
    bofa: 'https://login.qa.avidsuite.com/img/bofa_logo.png',
    comdata: 'https://login.qa.avidsuite.com/img/comdata_logo.png',
    key: 'https://login.qa.avidsuite.com/img/keybank.png',
    fifth: 'https://login.qa.avidsuite.com/img/fifththird_logo.png',
  },
  fullStory: {
    orgId: 'o-1HWKV2-na1',
  },
  macroEnvGroup: 'dev',
  cmsProductId: '6',
  cmsFeatureFlag: 'cms-data',
  featureFlagUrl: 'https://getfeatureflags-qa-dkgyd2ane0abc4g8.z01.azurefd.net/api/getfeatureflags',
  cmsUrl: 'https://cms-bff-dv-ajfye7brd7dcdccv.z01.azurefd.net/api/',
};
