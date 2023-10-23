import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AddTenantPage from '../../pages/addTenant';

Given(/^that I am on the (add tenant|Create Tenant) page$/, () => {
  AddTenantPage.visit();
});

When(/^I view the title$/, () => {
  AddTenantPage.titleIsPresent();
});

When(/^I view the add page and click "Back Arrow" button$/, () => {
  AddTenantPage.clickOnBackArrowBtn();
});

When(/^I select the Submit button And creating a Tenant was successful$/, () => {
  AddTenantPage.submitCustomerDetails();
});

When(/^I select the Submit button and creating a Tenant was unsuccessful$/, () => {
  AddTenantPage.submitFailingCustomerDetails();
});

When(/^a user clicks another part of the screen$/, () => {
  AddTenantPage.visit();
  AddTenantPage.submitCustomerDetails();
  AddTenantPage.clickOnBackArrowBtn();
});

When(/^a user clicks outside of the toaster message$/, () => {
  AddTenantPage.submitFailingCustomerDetails();
  AddTenantPage.clickOnBackArrowBtn();
});

When(/^a user successfully creates a new tenant$/, () => {
  AddTenantPage.submitCustomerDetails();
});

When(/^creation of a new tenant fails$/, () => {
  AddTenantPage.submitFailingCustomerDetails();
});

When(/^I enter a unique site name into the Site Name input field$/, () => {
  // this is handled by its corresponding `Then` block.
});

When(/^I enter an invalid site name into the Site Name input field$/, () => {
  // this is handled by its corresponding `Then` block.
});

Then(/^the title "Customer Site Details" must be displayed$/, () => {
  AddTenantPage.titleDiv().contains('Customer Site Details');
});

Then(/^the title of "Customer Site" must have a font-weight of 600$/, () => {
  AddTenantPage.titleDiv().find('span').should('have.class', 'font-["inter-semibold"]');
});

Then(/^the "Back Arrow" button must be displayed$/, () => {
  AddTenantPage.backArrowButton().should('be.enabled');
});

Then('I should be routed to Tenant List page', () => {
  AddTenantPage.verifyTenantListUrl();
});

Then(/^the toaster message must be displayed.$/, () => {
  AddTenantPage.getToastMessage().should('exist');
});

Then(/^the toaster message title is: "New Site ID Created"$/, () => {
  AddTenantPage.getToastMessage().contains('New Site ID Created');
});
Then(/^the toaster message title is: "Site ID Creation Failed"$/, () => {
  AddTenantPage.getToastMessage().contains('Site ID Creation Failed');
});

Then(/^the user is able to dismiss the toast by clicking the "x".$/, () => {
  AddTenantPage.getToastDismissIcon().should('exist');
  AddTenantPage.clickToastDismissIcon();
  AddTenantPage.getToastMessage().should('not.exist');
});

Then(/^the toaster message must persist for at least 3 seconds$/, () => {
  AddTenantPage.visit();
  AddTenantPage.submitCustomerDetails();
  cy.clock(Date.now());
  cy.tick(3000);
  AddTenantPage.getToastMessage().should('exist');
  cy.clock().invoke('restore');
  AddTenantPage.getToastMessage().should('not.exist');
});

Then(/^the toaster error message must persist for at least 3 seconds$/, () => {
  AddTenantPage.submitFailingCustomerDetails();
  cy.clock(Date.now());
  cy.tick(3000);
  AddTenantPage.getToastMessage().should('exist');
  cy.clock().invoke('restore');
  AddTenantPage.getToastMessage().should('not.exist');
});

Then(/^the toaster message will remain for the 3 seconds or until the user dismisses.$/, () => {
  AddTenantPage.getToastMessage().should('exist');
});

Then(/^the background color must be 'Surface-50'$/, () => {
  cy.get('[data-cy=backgroundCard]').should('have.class', 'bg-surface-50');
});

Then(/^the application must redirect the user to that tenant's Manage page.$/, () => {
  cy.url().should('have.string', 'pckkszp90pyne181qk6t');
});

Then(/^a successful toaster message must be displayed.$/, () => {
  AddTenantPage.getToastMessage().should('exist');
  AddTenantPage.getToastMessage().contains('New Site ID Created');
});

Then(/^the user must remain on the Create Tenant page$/, () => {
  cy.url().should('have.string', 'add');
});

Then(/^an unsuccessful toaster message must be displayed$/, () => {
  AddTenantPage.getToastMessage().should('exist');
  AddTenantPage.getToastMessage().contains('Site ID Creation Failed');
});

Then(/^the font-family for the "Customer Details" anchor link must be 'inter Regular'$/, () => {
  AddTenantPage.getCustomerDetailsAnchor().should('have.css', 'font-family', 'inter-regular');
});

Then(/^the font-weight for the "Customer Details" anchor link must be '400'$/, () => {
  AddTenantPage.getCustomerDetailsAnchor().should('have.css', 'font-weight', '400');
});

Then(/^the font-size for the "Customer Details" anchor link must be '14px'$/, () => {
  AddTenantPage.getCustomerDetailsAnchor().should('have.css', 'font-size', '14px');
});

Then(/^the text-color for the "Customer Details" anchor link must be 'grey-800'$/, () => {
  AddTenantPage.getCustomerDetailsAnchor().should('have.class', 'text-grey-800');
});

Then(/^the system must check if the Site Name is a unique entry.$/, () => {
  AddTenantPage.validateUniqueSiteName();
});

Then(
  /^the system must check if the Site Name is not a unique entry and the error input field must be red.$/,
  () => {
    AddTenantPage.validateNonUniqueSiteName();
  }
);
