/* eslint-disable prettier/prettier */
export class Utility {
  getBaseUrl() {
    const envi = Cypress.env('ENV'); //Get the value of evnironment variable i.e ENV
    if (envi == 'production')
      //Check the value
      return 'https://www.production-website.com';
    //return desired url
    else if (envi == 'staging') return 'https://staging-website.com';
    else if (envi == 'qa')
      return 'https://bank-account-mgmt-spa-qa-gxdecgcfejakhrd6.z01.azurefd.net/';
    else return '';
  }
}
