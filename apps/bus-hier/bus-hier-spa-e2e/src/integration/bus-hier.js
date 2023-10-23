import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import BusHierDetailsPage from '../pages/bus-hier-details';

Given('that I have an organization', () => {
  BusHierDetailsPage.visit();
});

Given('that I am on the Organization Details page', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitOrgDetailsPage();
});

Given('that the user navigated from a previous page', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.visitErpDetailsPage();
});

Given('that my Tenant has multiple Organizations or ERPs', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
});

When('I navigate to the Manage page', () => {
  BusHierDetailsPage.visit();
});

When('the user selects the back button', () => {
  BusHierDetailsPage.clickBackBtn();
});

Then('the application must display a tree', () => {
  BusHierDetailsPage.getHierTree();
});

Then('the back button must be displayed in the application', () => {
  BusHierDetailsPage.backBtnPresent();
});

Then('the application must navigate the user to the previous page', () => {
  BusHierDetailsPage.getOrganizationName();
});

Then('the application must display the list of Organizations associated with my Tenant', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
  BusHierDetailsPage.getOrgsList();
});

Then('display the list of ERPs associated with my Tenant', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
  BusHierDetailsPage.getErpsList();
});

Then('the View hierarchy button must be deactivated', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
  BusHierDetailsPage.viewHierBtnDisabled();
});

When('I select the Edit button', () => {
  BusHierDetailsPage.clickOnEditButton();
});

Then('the page must display the Edit components for that Organization', () => {
  BusHierDetailsPage.getEditComponent().should('be.visible');
});

When('I click the deactivate button', () => {
  BusHierDetailsPage.clickOnDeactivateButton();
});

Then('the page must display deactivate dialog', () => {
  BusHierDetailsPage.getDialog().should('be.visible');
});

When('I confirm the deactivate on the dialog', () => {
  BusHierDetailsPage.getDialog();
  BusHierDetailsPage.confirmDeactivateOnDialog();
});

Then('the page must display a deactivate successful toast', () => {
  BusHierDetailsPage.getToastMessage().should('be.visible');
});

When('I confirm the deactivate on the dialog and there is network error', () => {
  BusHierDetailsPage.getDialog();
  BusHierDetailsPage.confirmDeactivateOnDialogError();
});

Then('the page must display a deactivate failure toast', () => {
  BusHierDetailsPage.getToastMessage().should('be.visible');
});

Given('that I am on the Organization Details - Edit page', () => {
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.clickOnEditButton();
});

When('I enter valid data into the Organization Name and Organization Code', () => {
  BusHierDetailsPage.fillEditForm('New Name', 'New Code');
});

When('I select the Save Org button', () => {
  BusHierDetailsPage.clickOnSaveButton('org');
});

When('I select the Save Erp button', () => {
  BusHierDetailsPage.clickOnSaveButton('erp');
});

When('I select the Save Entity button', () => {
  BusHierDetailsPage.clickOnSaveButton('entity');
});

Then('the application must update the details of that Organization', () => {
  BusHierDetailsPage.getOrganizationName().should('contain', 'New Name');
  BusHierDetailsPage.getOrganizationCode().should('contain', 'New Code');
});

Then('a successful toaster message must be displayed', () => {
  BusHierDetailsPage.getToastMessage().should('be.visible');
});

When('I click the Save Org button and there is a Network Error', () => {
  BusHierDetailsPage.clickOnSaveButtonError('org');
});

When('I click the Save Erp button and there is a Network Error', () => {
  BusHierDetailsPage.clickOnSaveButtonError('erp');
});

When('I click the Save Entity button and there is a Network Error', () => {
  BusHierDetailsPage.clickOnSaveButtonError('entity');
});

Then('the application must display an unsuccessful toaster message', () => {
  BusHierDetailsPage.getToastMessageError().should('be.visible');
});

Given('that I have successfully updated the Organization Name', () => {
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.clickOnEditButton();
  BusHierDetailsPage.fillEditForm('New Name', 'New Code');
  BusHierDetailsPage.clickOnSaveButton('org');
});

Then('the Business Hierarchy Tree must display the new Organization Name', () => {
  BusHierDetailsPage.getHierTreeNode().should('contain', 'New Name');
});

When('I enter null data into the Organization Name and or Organization Code', () => {
  BusHierDetailsPage.clearEditForm();
});

Then('the Save button must be disabled', () => {
  BusHierDetailsPage.getSaveButton().find('button').should('be.disabled');
});

When('I click on edit button', () => {
  BusHierDetailsPage.clickEditDetails();
});

Then('I edit name', () => {
  BusHierDetailsPage.getEditDetailsPage();
});

Then('Save button enabled', () => {
  BusHierDetailsPage.saveButtonEnabled();
});

When('that I am on the ERP Details - Edit page', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitErpDetailsPageAndWait();
});

When('I enter valid data into the ERP Name and ERP Code', () => {
  BusHierDetailsPage.fillEditForm('New Name', 'New Code');
});

When('I enter valid data into the Entity Name and Entity Code', () => {
  BusHierDetailsPage.fillEditForm('My new Entity Name', '123Code');
});

Then('the application must update the details of that ERP', () => {
  BusHierDetailsPage.getOrganizationName().should('contain', 'My new ERP Name');
  BusHierDetailsPage.getOrganizationCode().should('contain', '123Code');
});

Given('that I am on the Entity Details - Edit page', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.visitEntityDetailsEditPageAndWait();
});

When('the application must update the details of that Entity', () => {
  BusHierDetailsPage.getOrganizationName().should('contain', 'My new Entity Name');
  BusHierDetailsPage.getOrganizationCode().should('contain', '123Code');
});

Then('I should see the "Addresses" header displayed', () => {
  BusHierDetailsPage.addressSectionTitlePresent();
});

Then('I should see a horizontal divider separating the addresses', () => {
  BusHierDetailsPage.addressSectionDividerPresent();
});

When('I view the address details for each address associated with the Organization', () => {
  BusHierDetailsPage.allAddressShouldBeVisible();
});

Then('I should see the following all applicable address fields', () => {
  BusHierDetailsPage.validateAddressFields();
});

Then('I should see BillTo Header and ShipTo Header', () => {
  BusHierDetailsPage.billToHeaderPresent();
  BusHierDetailsPage.shipToHeaderPresent();
});

Given('that I am on the Entity Details page', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.visitEntityDetailsPageAndWait();
});

When('I view the address details for each address associated with the Entity', () => {
  BusHierDetailsPage.allEntityAddressShouldBeVisible();
});

Then('I should see the following all applicable entity address fields', () => {
  BusHierDetailsPage.validateEntityAddressFields();
});

Given('that I am on the Entity list page', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
});

Then('I should see the edit name button', () => {
  BusHierDetailsPage.editNameButtonShouldBeVisible();
});

When('I click edit name button', () => {
  BusHierDetailsPage.clickEditName();
});

Then('the side sheet must be visible', () => {
  BusHierDetailsPage.sideSheetShouldBeVisible();
});

Given('That I am on entity edit name side sheet', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.clickEditName();
});

When('I select the side sheet Save button', () => {
  BusHierDetailsPage.clickEditNameSaveButton();
});

Then('the page must display the Deactivate button for that Entity Address', () => {
  BusHierDetailsPage.validateEntityAddressContainDeactivateButton();
});

Then('the label must be displayed as Active', () => {
  BusHierDetailsPage.validateEntityAddressesContainActiveLabel();
});

When('I select the Deactivate button', () => {
  BusHierDetailsPage.clickFirstShipToAddressDeactivateButton();
});

When('I select the Reactivate button', () => {
  BusHierDetailsPage.clickFirstAddressReactivateButton('shipTo');
});

Then('the page must display the Deactivate Modal Dialog for that Entity Address', () => {
  BusHierDetailsPage.getDialog();
});

Given('that the Deactivate Modal Dialog is displayed for an Entity Address', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.visitEntityDetailsPageAndWait();
  BusHierDetailsPage.clickFirstShipToAddressDeactivateButton();
});

When('I select the Cancel button', () => {
  BusHierDetailsPage.dismissDeactivateAddressModal();
});

Then('the application must close the Modal Dialog', () => {
  BusHierDetailsPage.getDialog().should('not.exist');
});

When('I select the X button', () => {
  BusHierDetailsPage.dismissDeactivateAddressModal('x');
});

Then(
  'the system must deactivate that Entity Address and a successful toaster message must be displayed',
  () => {
    BusHierDetailsPage.getToastMessage().should('be.visible');
  }
);

When('I select the Deactivate Entity Address button from Modal', () => {
  BusHierDetailsPage.deactivateAddress('cadlbfshs605o7i35wl3', 'o2cdjj82ehir5j7duwcz', 'entity');
});

When('I select the Reactivate button from Modal', () => {
  BusHierDetailsPage.reactivateAddress('cadlbfshs605o7i35wl3', 'o2cdjj82ehir5j7duwcz', 'entity');
});

When('I select the Reactivate entity address button from Modal with failure', () => {
  BusHierDetailsPage.reactivateAddressWithError(
    'cadlbfshs605o7i35wl3',
    'o2cdjj82ehir5j7duwcz',
    'entity'
  );
});

Then(
  'the system must activate that Entity Address and a failure toaster message must be displayed',
  () => {
    BusHierDetailsPage.getToastMessageError('Address activation failed');
  }
);

Then('the badge must be displayed as Inactive', () => {
  BusHierDetailsPage.firstShipToAddressInactiveCheck();
});

Then('the badge must be displayed as Activate', () => {
  BusHierDetailsPage.firstBillToAddressActiveCheck();
});

Then('the Reactivate button must be displayed', () => {
  BusHierDetailsPage.firstShipToAddressReactiveButtonCheck();
});

Given('that I am on the Entity Details page with Inactive Addresses', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.visitEntityDetailsPageWithInactiveAddressesAndWait();
});

Then('the page must display the Reactivate button for that Entity Address', () => {
  BusHierDetailsPage.validateEntityAddressContainReactivateButton();
});

Then('the label must be displayed as Inactive', () => {
  BusHierDetailsPage.validateEntityAddressesContainInactiveLabel();
});

Then('the page must display the Reactivate Modal Dialog for that Entity Address', () => {
  BusHierDetailsPage.getDialog();
});

Given('that the Reactivate Modal Dialog is displayed for an Entity Address', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.visitEntityDetailsPageWithInactiveAddressesAndWait();
  BusHierDetailsPage.clickFirstAddressReactivateButton('shipTo');
});

Then(
  'the system must activate that Entity Address and a successful toaster message must be displayed',
  () => {
    BusHierDetailsPage.getToastMessage().should('be.visible');
  }
);

// Business Hierarchy Tree e2e

Given('that my tenant has a business hierarchy for a single organization and single ERP', () => {
  BusHierDetailsPage.visit();
});

When('I navigate to the Business Hierarchy page', () => {
  BusHierDetailsPage.visit();
});

Then('the page must display the Business Hierarchy tree', () => {
  BusHierDetailsPage.getHierTree();
});

Given('that my Business Hierarchy contains Organizations, ERPs, and Entities', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.getHierTree();
});

Then(
  'the Business Hierarchy Tree must display the total count of objects at each level of the Tree',
  () => {
    BusHierDetailsPage.getTotalCount();
  }
);

Then('the Organization button on the Tree must display the name of the Organization', () => {
  BusHierDetailsPage.getOrgName();
});

Then('the ERP button on the Tree must display the name of the ERP', () => {
  BusHierDetailsPage.getErpName();
});

Given('that there is a business hierarchy tree', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.getHierTree();
});

When('the user selects the Organization Tree object', () => {
  BusHierDetailsPage.visitOrgDetailsPage();
});

Then('the application must display the details of that Organization', () => {
  BusHierDetailsPage.getOrgDetails('ACME Insurance', 'AI-123');
});

When('the user selects the ERP Tree object', () => {
  BusHierDetailsPage.visitErpDetailsPage();
});

Then('the application must display the details of that ERP', () => {
  BusHierDetailsPage.getErpDetails();
});

Given('that there is a business hierarchy tree and no Entity has been selected', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.getHierTree();
});

When('the user selects the Entity Tree object', () => {
  BusHierDetailsPage.visitEntitiesListPage();
});

Then('the application should display the list of entities at that Business Level', () => {
  BusHierDetailsPage.getEntityList();
});

Given('that there is a business hierarchy tree and the user has selected an Entity', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.getHierTree();
});

When('the user selects the Entity Tree node', () => {
  BusHierDetailsPage.getEntityDetails();
});

Then('the application must display the details of that Entity', () => {
  BusHierDetailsPage.getEntityDetails();
  BusHierDetailsPage.getEntityDetailsNameandCode();
});

Given('that I have selected a single entity on the list of entities', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.getEntityDetails();
});

Then('the count of that Business Level equals "1"', () => {
  BusHierDetailsPage.checkCount(3, '1');
});

When('the user navigates back to the list of entities', () => {
  BusHierDetailsPage.backToList();
});

Then(
  'the Business Hierarchy tree must display the count of the total number of entities for that parent',
  () => {
    BusHierDetailsPage.checkCount(3, '60');
  }
);

Given('that the user is on the Multiple Org ERP List Page', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
});

When('the user selects one Organization AND one ERP', () => {
  BusHierDetailsPage.clickOrgAndErp();
});

Then('the View hierarchy must be enabled', () => {
  BusHierDetailsPage.viewHierBtnEnabled();
});

Given('that the user has selected one Organization AND one ERP', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
  BusHierDetailsPage.clickOrgAndErp();
});

When('the user selects the View hierarchy button', () => {
  BusHierDetailsPage.clickViewHierBtn();
});

Then('the application must navigate to the Business Hierarchy Landing Page', () => {
  BusHierDetailsPage.visit();
});

Then('generate the Business Hierarchy Tree with the selected Organization and ERP', () => {
  BusHierDetailsPage.getHierTree();
});

Given('that a Tenant has multiple ERPs', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
});

When('the user selects an Organization', () => {
  BusHierDetailsPage.clickOrg();
});

Then('the ERP components that are not associated with that Organization must be disabled', () => {
  BusHierDetailsPage.checkDisabledErps();
});

Given('that a Tenant has multiple Organizations', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
});

When('the user selects an ERP', () => {
  BusHierDetailsPage.clickErp();
});

Then('the Organization components that are not associated with that ERP must be disabled', () => {
  BusHierDetailsPage.checkDisabledOrgs();
});

Given('that an Organization is selected', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
  BusHierDetailsPage.clickOrg();
});

Given('the ERP components that are not associated with that Organization are disabled', () => {
  BusHierDetailsPage.checkDisabledErps();
});

When('the user selects the selected Organization', () => {
  BusHierDetailsPage.clickOrg();
});

Then('the disabled ERPs must be enabled', () => {
  BusHierDetailsPage.checkEnabledErps();
});

Given('that an ERP is selected', () => {
  BusHierDetailsPage.visitMultipleOrgsErps();
  BusHierDetailsPage.clickErp();
});

Given('the Organization components that are not associated with that ERP are disabled', () => {
  BusHierDetailsPage.checkDisabledOrgs();
});

When('the user selects the selected ERP', () => {
  BusHierDetailsPage.clickErp();
});

Then('the disabled Organizations must be enabled', () => {
  BusHierDetailsPage.checkEnabledOrgs();
});

//edit-address e2e

When('I select the pencil icon for a specific Organization Address', () => {
  BusHierDetailsPage.editAddressClick('ggsgegsewfy042a4sn24');
});

Then('the page must display the Edit side sheet for that Organization', () => {
  BusHierDetailsPage.getSideSheet();
});

Given('that I am on the Organization Details - Address Edit side sheet', () => {
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.editAddressClick('ggsgegsewfy042a4sn24');
});

When(
  'I enter valid data into the Address, City, State, Postal Code, and Address type fields and I select the Save button',
  () => {
    BusHierDetailsPage.editAddressFormFill(
      '1234',
      {
        id: 'ggsgegsewfy042a4sn24',
        line1: '123 AvidXchange Street',
        city: 'New York City',
        state: 'NY',
        zipCode: '28227',
      },
      'organization',
      'update-org-address'
    );
  }
);

Then('the side sheet must close', () => {
  BusHierDetailsPage.isGone();
});
Then('the application must update the details of that Organization Address', () => {
  BusHierDetailsPage.getAddressDetails('123 AvidXChange Street', 'New York City', 'NY', '28227');
});

When('I select the "Cancel" button', () => {
  cy.get('button').contains('Cancel').click();
});

Then('the application must return to the Organization Details page', () => {
  BusHierDetailsPage.getOrgDetails('ACME Insurance', 'AI-123');
  BusHierDetailsPage.isGone();
});

Then('the system must not make an update to the Address', () => {
  BusHierDetailsPage.getAddressDetails('1210 AvidXchange Lane', 'Charlotte', 'NC', '28206');
});

Given('that I have successfully updated any value for the Organizations Address', () => {
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.editAddressClick('ggsgegsewfy042a4sn24');
  BusHierDetailsPage.editAddressFormFill(
    '1234',
    {
      id: 'ggsgegsewfy042a4sn24',
      line1: '123 AvidXchange Street',
      city: 'New York City',
      zipCode: '28227',
      state: 'NY',
    },
    'organization',
    'update-org-address'
  );
});

When('I return to the Organization Detail page', () => {
  BusHierDetailsPage.getOrgDetails('ACME Insurance', 'AI-123');
  BusHierDetailsPage.isGone();
});

Then('the Organization Details page must display the updated Address', () => {
  BusHierDetailsPage.getAddressDetails('123 AvidXChange Street', 'New York City', 'NY', '28227');
});

Then('the page must display the Edit side sheet for that Entity', () => {
  BusHierDetailsPage.getSideSheet();
});

When('I select the pencil icon for a specific Entity Address', () => {
  BusHierDetailsPage.editAddressClick('o2cdjj82ehir5j7duwcz');
});

Given('that I am on the Entity Details - Address Edit side sheet', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitEntityListPageAndWait();
  BusHierDetailsPage.visitEntityDetailsPageAndWait();
  BusHierDetailsPage.editAddressClick('o2cdjj82ehir5j7duwcz');
});

When(
  'I enter valid data into the Entity Address, City, State, Postal Code, and Address type fields and I select the Save button',
  () => {
    BusHierDetailsPage.editAddressFormFill(
      'cadlbfshs605o7i35wl3',
      {
        id: 'o2cdjj82ehir5j7duwcz',
        line1: 'Address Line 2',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70544',
      },
      'entity',
      'update-entity-address'
    );
  }
);

Then('the application must update the details of that Entity Address', () => {
  BusHierDetailsPage.getAddressDetails('Address Line 2', 'New Orleans', 'LA', '70544');
});

Then('the application must return to the Entity Details page', () => {
  BusHierDetailsPage.isGone();
});

Then('the system must not make an update to the Entity Address', () => {
  BusHierDetailsPage.getAddressDetails('Address Line 1', 'Locality', 'Alabama', '123456789');
});

When(
  'I enter valid data into the Entity Address, City, State, Postal Code, and Address type fields and I select the Save button and Failure',
  () => {
    BusHierDetailsPage.editAddressFormFill(
      'cadlbfshs605o7i35wl3',
      {
        id: 'o2cdjj82ehir5j7duwcz',
        line1: 'Address Line 2',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70544',
      },
      'entity',
      'error',
      true
    );
  }
);

Then('edit Entity Address failure toaster message must be displayed', () => {
  BusHierDetailsPage.getToastMessageError('Address edit failed.');
});

Given(
  'that I am on the Organization Details - Address Edit side sheet and there is a Network Error',
  () => {
    BusHierDetailsPage.visitOrgDetailsPage();
    BusHierDetailsPage.editAddressClick('ggsgegsewfy042a4sn24');
  }
);

When(
  'I enter valid data into the Address, City, State, Postal Code, and Address type fields and I select the Save button and failure',
  () => {
    BusHierDetailsPage.editAddressFormFill(
      '1234',
      {
        id: 'ggsgegsewfy042a4sn24',
        line1: 'Address Line 2',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70544',
      },
      'organization',
      'update-org-address',
      true
    );
  }
);

Then(
  'the application must display an unsuccessful toaster message for address edit failure',
  () => {
    BusHierDetailsPage.getToastMessageError('Address edit failed.').should('be.visible');
  }
);

When('I enter null data into any field', () => {
  BusHierDetailsPage.editAddressNull();
});

Then('the field must display an error message', () => {
  BusHierDetailsPage.checkErrorMsgInputs(
    'Enter street number and name',
    'Enter city name',
    'Enter state name',
    'Enter postal code'
  );
});
Given('that the Deactivate Modal Dialog is displayed for an Organization Address', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.clickFirstShipToAddressDeactivateButton();
});

Given('that the Deactivate Modal Dialog is displayed for an Organization Address Bill to', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitOrgDetailsPage();
  BusHierDetailsPage.clickFirstBillToAddressReactivateButton();
});

When('I select the Deactivate Organization Address button from Modal', () => {
  BusHierDetailsPage.deactivateAddress('1234', 'ggsgegsewfy042a4sn24', 'organization');
});

Then(
  'the system must deactivate that Organization Address and a successful toaster message must be displayed',
  () => {
    BusHierDetailsPage.getToastMessage('Address has been deactivated.').should('be.visible');
  }
);

Given('that I am on the Organization Details page with an Inactive Address', () => {
  BusHierDetailsPage.visit();
  BusHierDetailsPage.visitOrgDetailsPage();
});

When('I select the reactivate button for a deactivated organization address', () => {
  BusHierDetailsPage.clickFirstAddressReactivateButton('billTo');
});

Then('the page must display the Reactivate Modal Dialog for that Organization Address', () => {
  BusHierDetailsPage.getDialog();
});

When('I select the Reactivate organization address button from Modal with failure', () => {
  BusHierDetailsPage.reactivateAddressWithError('1234', 'ggsgegsewfy042a4sn25', 'organization');
});

When('I select the Reactivate org address button from Modal', () => {
  BusHierDetailsPage.reactivateAddress('1234', 'ggsgegsewfy042a4sn25', 'organization');
});

Then(
  'the system must activate that organization Address and a successful toaster message must be displayed',
  () => {
    BusHierDetailsPage.getToastMessage('Address has been activated.').should('be.visible');
  }
);

When('I select the reactivate button for a deactivated organization address billTo', () => {
  BusHierDetailsPage.clickFirstAddressReactivateButton('billTo');
});

When('I select the Reactivate Organization Address button from Modal', () => {
  BusHierDetailsPage.reactivateAddress('1234', 'ggsgegsewfy042a4sn25', 'organization');
});

When('I select the Reactivate org address button from Modal with failure', () => {
  BusHierDetailsPage.reactivateAddressWithError('1234', 'ggsgegsewfy042a4sn25', 'organization');
});

Then(
  'the system must activate that organization Address and a failure toaster message must be displayed',
  () => {
    BusHierDetailsPage.getToastMessageError('Address activation failed');
  }
);

Then('the Save button must be disabled.', () => {
  BusHierDetailsPage.saveBtnStatus();
});

Then('the Address field must limit the character input to 100 characters.', () => {
  BusHierDetailsPage.maxLengthChecker(
    '[data-cy=address-input]',
    'input#address-input',
    'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was bo',
    100
  );
});
Then('the City field must limit the character input to 40 characters.', () => {
  BusHierDetailsPage.maxLengthChecker(
    '[data-cy=city-input]',
    'input#city-input',
    'Lorem ipsum dolor sit amet, consectetuer',
    40
  );
});
Then('the State field must limit the character input to 2 characters.', () => {
  BusHierDetailsPage.maxLengthChecker('[data-cy=state-input]', 'input#state-input', 'NC', 2);
});
Then('the Postal Code field must limit the character input to 10 characters.', () => {
  BusHierDetailsPage.maxLengthChecker(
    '[data-cy=postal-code-input]',
    'input#postal-code-input',
    'Lorem ipsu',
    10
  );
});
Then('the Address Code field must limit the character input to 32 characters.', () => {
  BusHierDetailsPage.maxLengthChecker(
    '[data-cy=address-code-input]',
    'input#address-code-input',
    'Lorem ipsum dolor sit amet, cons',
    32
  );
});

When(
  'I enter valid data into the Entity Details - Address, City, State, Postal Code, and Address type fields and I select the Save button',
  () => {
    BusHierDetailsPage.editAddressFormFill(
      'cadlbfshs605o7i35wl3',
      {
        id: 'o2cdjj82ehir5j7duwcz',
        line1: '123 AvidXchange Street',
        city: 'New York City',
        state: 'NY',
        zipCode: '28227',
      },
      'entity',
      'update-entity-address'
    );
  }
);

Given(
  'that I am on the Entity Details - Address Edit side sheet and there is a Network Error',
  () => {
    BusHierDetailsPage.visit();
    BusHierDetailsPage.visitEntityListPageAndWait();
    BusHierDetailsPage.visitEntityDetailsPageAndWait();
    BusHierDetailsPage.editAddressClick('o2cdjj82ehir5j7duwcz');
  }
);

Then(/^the application must update the details of that Entity's Address$/, () => {
  BusHierDetailsPage.getAddressDetails('Address Line 2', 'New Orleans', 'LA', '70544');
});

When(
  'I enter valid data into the Entity Address, City, State, Postal Code, and Address type fields and I select the Save button and failure',
  () => {
    BusHierDetailsPage.editAddressFormFill(
      'cadlbfshs605o7i35wl3',
      {
        id: 'o2cdjj82ehir5j7duwcz',
        line1: 'Address Line 2',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70544',
      },
      'entity',
      'update-entity-address',
      true
    );
  }
);
