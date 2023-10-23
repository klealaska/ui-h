// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isBeta: 'false',
  apiBaseUri: 'http://idcapi.avidxchange.com/',
  bkwsBaseUri: 'https://api.devavidxcloud.com/v1/buyerkeywordservice/',
  lookupApiBaseUri: 'http://localhost:3000/',
  invoiceIngestionApiBaseUri: 'http://localhost:3000/',
  appInsights: {
    instrumentationKey: '4eea2c12-19b2-4114-85a1-5e5d45b6ee86',
  },
  avidInboxLink: 'https://avidinbox.asqa01avidxchange.net/InvoiceProcessor',
  avidInvoiceLink:
    'https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/sso/initiate?to_app=AvidSuite&amp;to_url=https://one.asqa01avidxchange.net',
  clientGuidelinesLink: 'https://help.avidxchange.com/s/article/AvidInvoice-Indexing-Guidelines',
  appConfigConnectionString:
    'Endpoint=https://ax-ae1-dv-idc-invrecog-appconfig.azconfig.io;Id=g8t6-l0-s0:7zBABhL1HAklYGb/dldx;Secret=VB4iBpIcKn5Ff4Sw8J4xkk4xhnnQHadgwpKKtNYZ6gM=',
  avidSuiteInvoiceUrl: 'https://one.qaavidxchange.net/#/invoices/',
  maxUnindexedPages: '10',
  avidAuthBaseUri: 'https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/',
  avidAuthLoginUrl: 'https://login.qa.avidsuite.com',
  titleImage: {
    bofa: 'https://login.qa.avidsuite.com/img/bofa_logo.png',
    comdata: 'https://login.qa.avidsuite.com/img/comdata_logo.png',
    key: 'https://login.qa.avidsuite.com/img/key_logo.png',
    fifth: 'https://login.qa.avidsuite.com/img/fifth_logo.png',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
