import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ManageTenantPage from '../../pages/manageTenant';

Given(/^that (I have a valid tenant ID AND )?I am on the Manage Tenant Page$/, () => {
  ManageTenantPage.visit();
});

When(/^the Site Name is edited$/, () => {
  ManageTenantPage.editSiteName('foo');
});

When(/^the Site Name is edited and the Submit Button is clicked$/, () => {
  ManageTenantPage.submitEditedCustomerDetails();
});

When(/^I select the Submit button And editing a Tenant was successful$/, () => {
  ManageTenantPage.submitEditedCustomerDetails(200, 'foo');
});

When(/^I select the Submit button And editing a Tenant was unsuccessful$/, () => {
  ManageTenantPage.submitEditedCustomerDetails(400, 'foo2');
});

// When(/^I enter a unique site name into the Site Name input field$/, () => {
//   // this is handled by its corresponding `Then` block.
// });

// When(/^I enter an invalid site name into the Site Name input field$/, () => {
//   // this is handled by its corresponding `Then` block.
// });

When(/^I select one or more entitlements$/, () => {
  ManageTenantPage.clickProductEntitlement();
});

When(/^a product entitlement is assigned to a Tenant$/, () => {
  ManageTenantPage.clickProductEntitlement();
});

Then(/^the header Customer Details must be displayed.$/, () => {
  ManageTenantPage.getCustomerDetailsCard().contains('Customer Details');
});

Then(/^the Section Label "\*Site Name" must be displayed above the first input field.$/, () => {
  ManageTenantPage.getSiteNameLabel().contains('Site Name');
});

Then(/^the Site Name must be displayed in the Site Name input field$/, () => {
  ManageTenantPage.getSiteNameInput().should('have.value', ManageTenantPage.getSiteName());
});

Then(/^the Site Name input field must be enabled$/, () => {
  ManageTenantPage.getSiteNameInput().should('be.enabled');
});

Then(/^the Section Label "\*CMP ID" must be displayed above the second input field.$/, () => {
  ManageTenantPage.getCmpIdLabel().contains('CMP ID');
});

Then(/^the CMP ID must be displayed in the CMP ID field.$/, () => {
  ManageTenantPage.getCmpIdInput().should('have.value', ManageTenantPage.getCmpId());
});

Then(
  /^the Text Label "20 case-sensitive characters" must be displayed under the second input field.$/,
  () => {
    ManageTenantPage.getCmpIdHelperText().contains('20 case-sensitive characters');
  }
);

Then(/^the Section Label "Site ID" must be displayed on the right side of the Card.$/, () => {
  ManageTenantPage.getSiteIdLabel().contains('Site ID');
});

Then(/^the Site ID must be displayed on the right side of the Card.$/, () => {
  ManageTenantPage.getSiteIdText().contains(ManageTenantPage.getSiteId());
});

Then(/^the Submit Button must be displayed$/, () => {
  ManageTenantPage.getSubmitButton().contains('Submit');
});

Then(/^the Submit Button must be disabled$/, () => {
  ManageTenantPage.getSubmitButton().should('be.disabled');
});

Then(/^the Submit Button must be enabled$/, () => {
  ManageTenantPage.getSubmitButton().should('be.enabled');
});

Then(/^the Page Title must be updated to the new Site Name$/, () => {
  ManageTenantPage.getPageTitle().contains('NonexistentSiteName');
});

Then(/^the successful toaster message "Customer Details Updated" must be displayed.$/, () => {
  ManageTenantPage.getToastMessage().contains('Customer Details Updated');
});

Then(/^the toaster message error "Customer Details Update Failed" must be displayed.$/, () => {
  ManageTenantPage.getToastMessage().contains('Customer Details Update Failed');
});

Then(/^the background color should be 'Surface-50'$/, () => {
  cy.get('[data-cy=backgroundCard]').should('have.class', 'bg-surface-50');
});

Then(/^the font-family for the "Customer Details" link must be 'inter Regular'$/, () => {
  ManageTenantPage.getCustomerDetailsAnchor().should('have.css', 'font-family', 'inter-regular');
});

Then(/^the font-weight for the "Customer Details" link must be '400'$/, () => {
  ManageTenantPage.getCustomerDetailsAnchor().should('have.css', 'font-weight', '400');
});

Then(/^the font-size for the "Customer Details" link must be '14px'$/, () => {
  ManageTenantPage.getCustomerDetailsAnchor().should('have.css', 'font-size', '14px');
});

Then(/^the text-color for the "Customer Details" link must be 'grey-800'$/, () => {
  ManageTenantPage.getCustomerDetailsAnchor().should('have.class', 'text-grey-800');
});

Then(/^the system must check if the updated Site Name is a unique entry.$/, () => {
  ManageTenantPage.validateUniqueSiteName();
});

Then(
  /^the system must check if the updated Site Name is not a unique entry and the error input field must be red.$/,
  () => {
    ManageTenantPage.validateNonUniqueSiteName();
  }
);

Then(/^values for Product Entitlements must be displayed.$/, () => {
  ManageTenantPage.getProductEntitlementsData();
});

Then(/^the system must assign those entitlements to the tenant$/, () => {
  ManageTenantPage.selectFirstEntitlementCheckbox().should('have.attr', 'disabled');
});

Then(/^that entitlement must be unable to be selected in the UI$/, () => {
  ManageTenantPage.selectFirstEntitlementCheckbox().should('be.disabled');
});
