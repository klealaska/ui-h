import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/xdc-indexer-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/xdc-indexer-e2e/screenshots',
  chromeWebSecurity: false,
  viewportWidth: 1500,
  viewportHeight: 1200,
  retries: {
    runMode: 2,
    openMode: 2,
  },
  scrollBehavior: 'nearest',
  env: {
    API_SERVER: 'https://ax-ae1-ft-idc-invindx-indexingapi01-int-api.dv-ase-avidxchange.com/',
    MAILSLURP_API_KEY: '5657a7de0def5ae7faf298920ac72077541140272ba0a13f8ee79843df8f5a64',
    okta_domain: 'avidxchange.oktapreview.com',
    okta_clientId: '0oanm9lsv9j7dNJYU1d6',
    redirectUri: 'http://localhost:4200/sso/callback',
    suUsername: 'e03ef969ce4bab1dc03eb88bfcdfa1c4-PERF',
    customerUsername: '9fd8db9c06e2d66d0e34df4cc1670ee9-PERF',
    password: 'Perf01Password',
    avidbillproxyurl: 'https://api-ft01.devavidxcloud.com/v1/avidbillproxy/api/avidbill',
    scanUrl: 'https://sftp.avidxchange.com/',
    scanHttpTriggerUrl:
      'https://avidx-ft-invoiceingest-scan01-int-fun.qa-ase-avidxchange.com/api/ScanHttpTrigger',
    envAlias: 'Ft',
  },

  e2e: {
    ...nxE2EPreset(__dirname),
    specPattern: './src/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
    excludeSpecPattern: [
      '**/examples/*.spec.js',
      '**/before.ts',
      '**/helpers.ts',
      '**/selectors.ts',
    ],
    baseUrl: 'http://localhost:4200',
  },
});
