// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUri: 'https://api-dv01.devavidxcloud.com/v1',
  avidAuthBaseUri: 'https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/',
  avidAuthLoginUrl: 'https://login.qa.avidsuite.com',
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
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
