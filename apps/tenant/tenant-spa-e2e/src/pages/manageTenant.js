import * as currentTenant from '../fixtures/get-tenant-by-id.json';
const customerDetailsCard = '[data-cy=customer-details-card]';
const siteName = '[data-cy=site-name]';
const siteNameId = '[id=site-name-id]';
const cmpId = '[data-cy=cmp-id]';
const siteIdCard = '[data-cy=site-id-card]';
const siteIdLabel = '[data-cy=site-id-label]';
const siteIdText = '[data-cy=site-id-text]';
const submitCustomerDetailsBtn = '[data-cy=customer-details-submit-button]';
const pageTitle = '[data-cy=page-title]';
const customerDetailsAnchor = '[data-cy=customer-details]';
const getProductEntitlementCheckbox = '[data-cy=product-entitlement-data]';

const productEntitlementUrl = {
  url: '/api/product-entitlement*',
  query: { limit: '100' },
  method: 'GET',
};

export default class ManageTenantPage {
  static visit() {
    cy.intercept(productEntitlementUrl, { fixture: 'get-product-entitlements-mapped.json' }).as(
      'getPE'
    );
    cy.intercept('GET', `/api/product-entitlement/tenants/${this.getSiteId()}`, {
      fixture: 'get-product-entitlements-by-tenant-id.json',
    }).as('getTPE');
    cy.intercept(`/api/tenants/${this.getSiteId()}`, {
      fixture: 'get-tenant-by-id.json',
    });
    cy.intercept(
      'https://getfeatureflags-qa-dkgyd2ane0abc4g8.z01.azurefd.net/api/getfeatureflags?flagname=cms-data',
      { fixture: 'en.json' }
    );
    cy.visit(this.getSiteId());
    cy.wait('@getTPE');
    cy.wait('@getPE');
  }

  static getCustomerDetailsCard() {
    return cy.get(customerDetailsCard);
  }

  static getSiteNameElement() {
    return cy.get(siteName);
  }

  static getSiteNameLabel() {
    return cy.get(siteName).children();
  }

  static getSiteNameInput() {
    return cy.get('#site-name-id');
  }

  static getCmpIdElement() {
    return cy.get(cmpId);
  }

  static getCmpIdLabel() {
    return this.getCmpIdElement().children();
  }

  static getCmpIdInput() {
    return cy.get('#cmp-id');
  }

  static getCmpIdHelperText() {
    return this.getCmpIdElement().children();
  }

  static getSiteIdCard() {
    return cy.get(siteIdCard);
  }

  static getSiteIdLabel() {
    return cy.get(siteIdLabel);
  }

  static getSiteIdText() {
    return cy.get(siteIdText);
  }

  static getSiteName() {
    return currentTenant.siteName;
  }

  static getCmpId() {
    return currentTenant.cmpId;
  }

  static getSiteId() {
    return currentTenant.tenantId;
  }

  static getSubmitButton() {
    return cy.get(submitCustomerDetailsBtn);
  }

  static clearSiteName() {
    return cy.get(siteName).find('input').clear();
  }

  static editSiteName(newSiteName, items = []) {
    cy.intercept('GET', '/api/tenants?*', {
      items,
    }).as('validation');

    this.clearSiteName();
    cy.get(siteName).type(newSiteName);

    // clicking this to blur the input field so the submit button becomes enabled
    this.getCustomerDetailsAnchor().click({ multiple: true });
    return cy.wait('@validation');
  }

  static getPageTitle() {
    return cy.get(pageTitle);
  }

  static getToastMessage() {
    return cy.get('ax-toast');
  }

  static getToastDismissIcon() {
    return this.getToastMessage().get('#close');
  }

  static clickToastDismissIcon() {
    return this.getToastDismissIcon().click();
  }

  static clickSubmitButton() {
    this.getSubmitButton().click();
  }

  static submitEditedCustomerDetails(status = 200, newSiteName = 'NonexistentSiteName') {
    cy.intercept('PUT', `/api/tenants/${currentTenant.tenantId}`, {
      statusCode: status,
      body: { siteName: 'NonexistentSiteName', tenantId: currentTenant.tenantId },
    });
    this.clearSiteName();
    this.editSiteName(newSiteName);
    this.clickSubmitButton();
  }

  static validateUniqueSiteName() {
    this.editSiteName('foo').its('response.body.items').should('be.empty');
    cy.get(siteNameId).should('have.class', 'ng-valid');
  }

  static validateNonUniqueSiteName() {
    this.editSiteName('foo', [{ siteName: 'foo' }])
      .its('response.body.items')
      .should('deep.equal', [{ siteName: 'foo' }]);

    cy.get(siteNameId).should('have.class', 'ng-invalid');
  }

  static getCustomerDetailsAnchor() {
    return cy.get(customerDetailsAnchor);
  }

  static getProductEntitlementsData() {
    return cy.get(getProductEntitlementCheckbox);
  }

  static selectFirstEntitlementCheckbox() {
    return this.getProductEntitlementsData().eq(0).find('input');
  }

  static clickProductEntitlement() {
    cy.intercept(
      'POST',
      '/api/product-entitlement/u2foihaa61tql4k6ydii/tenants/upcd981lg8z84tozng3w',
      {
        fixture: 'post-product-entitlement-by-tenant-id.json',
      }
    );

    return this.selectFirstEntitlementCheckbox().click();
  }
}
