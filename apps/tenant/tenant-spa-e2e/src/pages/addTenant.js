const titleDiv = '[data-cy=title-div]';
const headerDivAddPage = '[data-cy=main-header-add-edit-page-div]';
const backArrowBtn = '[data-cy=back-btn]';
const cmpIdHelperTextSpan = '[data-cy=customer-details-submit-button]';
const submitCustomerDetailsBtn = '[data-cy=customer-details-submit-button]';
const siteName = '[data-cy=site-name]';
const siteNameId = '[id=site-name-id]';
const customerDetailsAnchor = '[data-cy=customer-details]';

class AddTenantPage {
  static visit() {
    cy.intercept(
      'https://getfeatureflags-qa-dkgyd2ane0abc4g8.z01.azurefd.net/api/getfeatureflags?flagname=cms-data',
      { fixture: 'en.json' }
    );
    cy.visit('/add');
  }

  static clickOnBackArrowBtn() {
    cy.intercept('GET', '/api/tenants?limit=100', { fixture: 'get-tenant.json' });
    cy.get(backArrowBtn).first().click();
  }

  static titleDiv() {
    return cy.get(titleDiv);
  }

  static titleIsPresent() {
    return cy.get(titleDiv).should('be.visible');
  }

  static headerDivAddPage() {
    return cy.get(headerDivAddPage);
  }

  static backArrowButton() {
    return cy.get(backArrowBtn);
  }

  static verifyTenantListUrl() {
    let url = Cypress.config().baseUrl;
    cy.url().should('eq', `${url}list`);
  }

  static cmpIdHelperTextSpan() {
    return cy.get(cmpIdHelperTextSpan);
  }

  static enterCustomerDetails(items = []) {
    cy.intercept('GET', '/api/tenants?*', {
      items,
    }).as('validation');

    cy.get(siteName).type('foo');

    // clicking this to blur the input field so the submit button becomes enabled
    this.getCustomerDetailsAnchor().click({ multiple: true });
    return cy.wait('@validation');
  }

  static customerDetailsSubmitButton() {
    return cy.get(submitCustomerDetailsBtn);
  }

  static clickCustomerDetailsSubmitButton() {
    cy.intercept('POST', '/api/tenants', { fixture: 'post-tenant.json' });
    cy.intercept('GET', 'api/tenants/pckkszp90pyne181qk6t', { fixture: 'get-tenant-by-id.json' });
    this.customerDetailsSubmitButton().click();
  }

  static clickCustomerDetailsSubmitButtonFailure() {
    cy.intercept('POST', '/api/tenants', { statusCode: 400 });
    this.customerDetailsSubmitButton().click();
  }

  static submitCustomerDetails() {
    this.enterCustomerDetails();
    this.clickCustomerDetailsSubmitButton();
  }

  static submitFailingCustomerDetails() {
    this.enterCustomerDetails();
    this.clickCustomerDetailsSubmitButtonFailure();
  }

  static validateUniqueSiteName() {
    this.enterCustomerDetails().its('response.body.items').should('be.empty');
    cy.get(siteNameId).should('have.class', 'ng-valid');
  }

  static validateNonUniqueSiteName() {
    this.enterCustomerDetails([{ siteName: 'foo' }])
      .its('response.body.items')
      .should('deep.equal', [{ siteName: 'foo' }]);

    cy.get(siteNameId).should('have.class', 'ng-invalid');
  }

  static getToastMessage() {
    return cy.get('ax-toast');
  }

  static getToastDismissIcon() {
    return this.getToastMessage().get('#close');
  }

  static clickToastDismissIcon() {
    return this.getToastDismissIcon().click({ force: true });
  }

  static getCustomerDetailsAnchor() {
    return cy.get(customerDetailsAnchor);
  }
}

export default AddTenantPage;
