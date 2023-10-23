import {
  clearConfigCache,
  cmsUrl,
  getNavHeader,
  getNavHomeButton,
  getNavMenuButton,
  manifestUrl,
  navigateToMfeById,
} from '../support/mfe-integrations';

// describe('MFE Integrations Test', () => {
//   beforeEach(() => {
//     clearConfigCache();
//     cy.intercept(cmsUrl, { fixture: 'cms.json' }).as('getContent');
//     cy.intercept(manifestUrl, { fixture: 'mfe-manifest.local.json' });

//     cy.visit('/dashboard');
//     cy.wait('@getContent');
//   });

// it('should have correct header', () => {
//   getNavHeader().contains('Shell Navigation');
// });

// it('should navigate between multiple MFEs', () => {
//   navigateToMfeById('0');
//   getNavMenuButton().click();
//   getNavHomeButton().click();
//   navigateToMfeById('1');
//   navigateToMfeById('2');
//   navigateToMfeById('3');
//   navigateToMfeById('0');
// });

// it('should route to Tenant Spa', () => {
//   navigateToMfeById('0');
//   cy.url().should('include', '/tenant-spa');
// });

// it('should route to BAM Spa', () => {
//   navigateToMfeById('1');
//   cy.url().should('include', '/bank-account-mgmt-spa');
// });

// it('should route to Pay Transformation Spa', () => {
//   navigateToMfeById('2');
//   cy.url().should('include', '/pay-transformation-spa');
// });

// it('should route to Bus Hier Spa', () => {
//   navigateToMfeById('3');
//   cy.url().should('include', '/bus-hier-spa');
// });
// });
