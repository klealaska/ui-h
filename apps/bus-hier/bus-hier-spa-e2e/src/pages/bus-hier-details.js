const entityName = '[data-cy=name]';
const backBtn = '[data-cy=back-btn]';
const entityCode = '[data-cy=code]';
const tree = '[data-cy=hier-tree]';
const treeNode = '[data-cy=tree-node]';
const editNameButton = '[data-cy=edit-name-btn]';
const editButton = '[data-cy=edit-details-btn]';
const editComponent = '[data-cy=edit-details-form]';
const activateOrDeactivateBtn = '[data-cy=activate-deactivate-btn]';
const saveButton = '[data-cy=save-details-btn]';
const editCode = '[data-cy=edit-code]';
const editName = '[data-cy=edit-name]';
const assets = '/assets/i18n/en.json';
const addressSectionTitle = '[data-cy=address-section-title]';
const addressSectionDivider = '[data-cy=divider]';
const shipToAddresses = '[data-cy=ShipTo-org-address]';
const billToAddresses = '[data-cy=BillTo-org-address]';
const orgShipToAddressHeader = '[data-cy=address-section-ship-to]';
const orgBillToAddressHeader = '[data-cy=address-section-bill-to]';
const organizationsList = '[data-cy=organizations-list]';
const erpsList = '[data-cy=erps-list]';
const viewHierBtn = '[data-cy=view-hier-btn]';
const viewEntityList = '[data-cy=entity-list]';
const toggleCard = '[data-cy=toggle-card]';
const sideSheet = '[data-cy=side-sheet]';
const addressInput = '[data-cy=address-input]';
const cityInput = '[data-cy=city-input]';
const stateInput = '[data-cy=state-input]';
const postalCodeInput = '[data-cy=postal-code-input]';
const address1 = '[data-cy=address-line-1]';
const addressLocality = '[data-cy=address-locality]';
const addressRegion = '[data-cy=address-region]';
const addressPostalCode = '[data-cy=address-postal-code]';

const listUrl = {
  url: '/api/business-hierarchy/list',
};

const getTreeURL = {
  url: '/api/business-hierarchy/navigation*',
};

const getErpById = {
  url: '/api/erp/233',
};

function getOrgByIdUrl(id) {
  return `/api/organization/${id}`;
}

function getEditAddressBtn(addressId) {
  return `[data-cy=${addressId}-edit-btn`;
}

function getErpByIdUrl(id) {
  return `/api/erp/${id}`;
}

function getEntities(erpId, level) {
  return `/api/entity/erp/${erpId}/business-level/${level}?limit=100`;
}

function getEntityByIdUrl(id) {
  return `/api/entity/${id}`;
}
function deactivateOrg(id) {
  return `/api/organization/${id}/deactivate`;
}

function updateBusinessLevelName(id) {
  return `api/business-level/${id}`;
}

function deactivateAddress(id, addressId, type) {
  return `/api/${type}/${id}/address/${addressId}/deactivate`;
}

function reactivateAddress(id, addressId, type) {
  return `/api/${type}/${id}/address/${addressId}/activate`;
}

function editTypeAddressUrl(id, addressId, type) {
  return `api/${type}/${id}/address/${addressId} `;
}

class BusHierDetailsPage {
  static visit() {
    cy.intercept(listUrl, { fixture: 'get-orgs-erps.json' }).as('getList');
    cy.intercept(getTreeURL, { fixture: 'get-tree.json' }).as('getTree');
    cy.intercept(assets).as('getAssets');
    cy.visit('/');
    cy.wait('@getList');
    cy.wait('@getTree');
    cy.wait('@getAssets');
  }

  static visitMultipleOrgsErps() {
    cy.intercept(listUrl, { fixture: 'get-multiple-orgs-erps.json' }).as('getSecondList');
    cy.intercept(assets).as('getAssets');
    cy.visit('/');
    cy.wait('@getSecondList');
    cy.wait('@getAssets');
  }

  static getHierTree() {
    cy.get(tree);
  }

  static getHierTreeNode() {
    return cy.get(treeNode);
  }

  static visitOrgDetailsPage() {
    this.visit();
    cy.intercept(getOrgByIdUrl('1234'), { fixture: 'get-org-by-id.json' }).as('getOrgById');
    cy.get(treeNode).first().click();
    cy.wait('@getOrgById');
  }

  static fillEditForm(name, code) {
    this.clearEditForm();
    cy.get(editName).type(name);
    cy.get(editCode).type(code);
  }

  static clearEditForm() {
    cy.get(editName).find('input').clear();
    cy.get(editCode).find('input').clear();
  }

  static getEditComponent() {
    return cy.get(editComponent);
  }

  static clickOnEditButton() {
    cy.get(editButton).click();
  }

  static clickEditName() {
    cy.get(editNameButton).click();
  }

  static clickOnDeactivateButton() {
    cy.get(activateOrDeactivateBtn).click();
  }

  static getSaveButton() {
    return cy.get(saveButton);
  }

  static clickOnSaveButton(type) {
    if (type === 'org') {
      cy.intercept('PUT', getOrgByIdUrl('1234'), {
        fixture: 'update-org.json',
      }).as('editOrg');
    } else if (type === 'erp') {
      cy.intercept('PUT', getErpByIdUrl('9ng7ljo918qvqunwworx'), {
        fixture: 'update-erp.json',
      }).as('editErp');
    } else if (type === 'entity') {
      cy.intercept('PUT', getEntityByIdUrl('cadlbfshs605o7i35wl3'), {
        fixture: 'update-entity.json',
      }).as('editEntity');
    }
    cy.intercept(getTreeURL, { fixture: 'get-new-tree.json' });
    this.getSaveButton().click();
  }

  static clickOnSaveButtonError(type) {
    if (type === 'org') {
      cy.intercept('PUT', getOrgByIdUrl('1234'), {
        statusCode: 500,
      }).as('editOrgError');
    } else if (type === 'erp') {
      cy.intercept('PUT', getErpByIdUrl('9ng7ljo918qvqunwworx'), {
        statusCode: 500,
      }).as('editErpError');
    } else if (type === 'entity') {
      cy.intercept('PUT', getEntityByIdUrl('cadlbfshs605o7i35wl3'), {
        statusCode: 500,
      }).as('editEntityError');
    }
    this.getSaveButton().click();
  }

  static getToastMessage(message) {
    return message ? cy.get('ax-toast').contains(message) : cy.get('ax-toast');
  }

  static getToastMessageError(message) {
    return cy.get('ax-toast').contains(message ? message : 'Error! Changes Not Saved');
  }

  static getDialog() {
    return cy.get('mat-dialog-container');
  }

  static confirmDeactivateOnDialog() {
    cy.intercept('PATCH', deactivateOrg('1234'), {
      body: {},
    }).as('deactivateOrg');

    this.getDialog().children().find('button').contains('Deactivate').click();
    cy.wait('@deactivateOrg');
  }

  static confirmDeactivateOnDialogError() {
    cy.intercept('PATCH', deactivateOrg('1234'), {
      statusCode: 500,
    }).as('deactivateOrgError');

    this.getDialog().children().find('button').contains('Deactivate').click();
    cy.wait('@deactivateOrgError');
  }

  static getOrganizationName() {
    return cy.get(entityName);
  }

  static getOrganizationCode() {
    return cy.get(entityCode);
  }

  static clickEditDetails() {
    cy.get('[data-cy=edit-details-btn]').first().click();
  }
  static getEditDetailsPage() {
    cy.get('[data-cy=edit-details-form]').first();
  }

  static clearInputValidationError() {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[type="text"]')
      .first()
      .clear()
      .then(() => {
        cy.get('mat-error').get('.ax-input-error');
      });
  }

  static editInput(inputName, text) {
    cy.get(`[data-cy="${inputName}"]`).type(text);
  }

  static saveButtonEnabled() {
    cy.get('[data-cy=save-details-btn]').first().should('not.be.disabled');
  }

  static saveButtonDisabled() {
    cy.get('[data-cy=save-details-btn]').first().should('be.disabled');
  }
  static visitErpDetailsPage() {
    cy.intercept(getErpById, { fixture: 'get-erp-by-id.json' }).as('getErpById');
    cy.get('[data-cy=tree-node]').eq(1).click();
  }

  static visitEntityDetailsPage(fixture) {
    cy.intercept(getEntityByIdUrl('cadlbfshs605o7i35wl3'), { fixture }).as('getEntityById');
    cy.get('[data-cy=cadlbfshs605o7i35wl3]').click();
  }

  static visitEntitiesListPage() {
    cy.intercept(getEntities('233', '1'), { fixture: 'get-entity-list.json' }).as('getEntities');
    cy.get('[data-cy=tree-node]').eq(2).click();
  }

  static visitErpDetailsPageAndWait() {
    this.visitErpDetailsPage();
    cy.wait('@getErpById');
    this.clickOnEditButton();
  }

  static visitEntityListPageAndWait() {
    this.visitEntitiesListPage();
    cy.wait('@getEntities');
  }

  static editNameButtonShouldBeVisible() {
    cy.get(editNameButton).should('be.visible');
  }

  static sideSheetShouldBeVisible() {
    cy.get('ax-side-sheet').should('be.visible');
  }

  static validateEditNameSideSheetData() {
    cy.get('ax-side-sheet').children().find('form');
  }

  static clickEditNameSaveButton() {
    cy.get('ax-side-sheet').children().find('button').contains('save').click();
  }

  static saveEntityName() {
    cy.intercept('PUT', updateBusinessLevelName('fooId'), {
      body: {},
    }).as('editEntityName');

    cy.wait('@editEntityName');
  }

  static visitEntityDetailsEditPageAndWait() {
    this.visitEntityDetailsPage('get-entity-by-id.json');
    cy.wait('@getEntityById');
    this.clickOnEditButton();
  }

  static visitEntityDetailsPageAndWait() {
    this.visitEntityDetailsPage('get-entity-by-id.json');
    cy.wait('@getEntityById');
  }

  static clickBackBtn() {
    cy.get(backBtn).click();
  }

  static backBtnPresent() {
    this.visitOrgDetailsPage();
    this.visitErpDetailsPage();
    cy.get(backBtn).should('be.visible');
  }

  static addressSectionTitlePresent() {
    cy.get(addressSectionTitle).should('be.visible');
  }

  static addressSectionDividerPresent() {
    cy.get(addressSectionDivider).should('be.visible');
  }

  static allAddressShouldBeVisible() {
    cy.get(shipToAddresses).should('have.length', 1);
    cy.get(billToAddresses).should('have.length', 1);
  }

  static allEntityAddressShouldBeVisible() {
    cy.get(shipToAddresses).should('have.length', 1);
    cy.get(billToAddresses).should('have.length', 1);
  }

  static validateAddressFields() {
    cy.get(shipToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-line-1]').contains('1210 AvidXchange Lane');
        cy.get('[data-cy=address-locality]').contains('Charlotte');
        cy.get('[data-cy=address-comma-space]').contains(', ');
        cy.get('[data-cy=address-region]').contains('NC');
        cy.get('[data-cy=address-postal-code]').contains('28206');
      });
    });
  }

  static validateEntityAddressFields() {
    cy.get(shipToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-line-1]').contains('Address Line 1');
        cy.get('[data-cy=address-locality]').contains('Locality');
        cy.get('[data-cy=address-comma-space]').contains(', ');
        cy.get('[data-cy=address-region]').contains('Alabama');
        cy.get('[data-cy=address-postal-code]').contains('123456789');
      });
    });
    cy.get(billToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-line-1]').contains('1210 AvidXchange Lane');
        cy.get('[data-cy=address-locality]').contains('Charlotte');
        cy.get('[data-cy=address-comma-space]').contains(', ');
        cy.get('[data-cy=address-region]').contains('NC');
        cy.get('[data-cy=address-postal-code]').contains('28206');
      });
    });
  }

  static billToHeaderPresent() {
    cy.get(orgBillToAddressHeader).should('be.visible');
  }
  static shipToHeaderPresent() {
    cy.get(orgShipToAddressHeader).should('be.visible');
  }

  static getOrgsList() {
    cy.get(organizationsList);
  }

  static getErpsList() {
    cy.get(erpsList);
  }

  static viewHierBtnDisabled() {
    cy.get(viewHierBtn).children().should('have.class', 'disabled');
  }

  static viewHierBtnEnabled() {
    cy.get(viewHierBtn).children().should('not.have.class', 'disabled');
  }

  static validateEntityAddressContainDeactivateButton() {
    cy.get(shipToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=deactivate-address-btn]').contains('Deactivate');
      });
    });
    cy.get(billToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=deactivate-address-btn]').contains('Deactivate');
      });
    });
  }

  static validateEntityAddressesContainActiveLabel() {
    cy.get(shipToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-status]').contains('Active');
      });
    });
    cy.get(billToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-status]').contains('Active');
      });
    });
  }

  static clickFirstShipToAddressDeactivateButton() {
    cy.get(shipToAddresses).find('button').contains('Deactivate').first().click();
  }

  static clickFirstBillToAddressReactivateButton() {
    cy.get(billToAddresses).find('button').contains('Reactivate').first().click();
  }

  static dismissDeactivateAddressModal(type) {
    if (type === 'x') {
      this.getDialog().children().find('button').find('mat-icon').click();
    } else {
      this.getDialog().children().find('button').contains('Cancel').click();
    }
  }

  static deactivateAddress(id, addressId, type) {
    cy.intercept(deactivateAddress(id, addressId, type), {
      fixture: 'activate-deactivate-addresses.json',
    }).as('deactivateAddress');
    this.getDialog().children().find('button').contains('Deactivate').click();
  }

  static reactivateAddress(id, addressId, type) {
    cy.intercept(reactivateAddress(id, addressId, type), {
      fixture: 'activate-deactivate-addresses.json',
    }).as('deactivateAddress');
    this.getDialog().children().find('button').contains('Reactivate').click();
  }

  static reactivateAddressWithError(id, addressId, type) {
    cy.intercept(reactivateAddress(id, addressId, type), {
      fixture: 'activate-deactivate-addresses.json',
      statusCode: 500,
    }).as('activateAddress');
    this.getDialog().children().find('button').contains('Reactivate').click();
  }

  static firstShipToAddressInactiveCheck() {
    cy.get(shipToAddresses).first($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-status]').contains('Inactive');
      });
    });
  }

  static firstBillToAddressActiveCheck() {
    cy.get(billToAddresses).first($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-status]').contains('Active');
      });
    });
  }

  static firstShipToAddressReactiveButtonCheck() {
    cy.get(shipToAddresses).first($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=activate-address-btn]').contains('Reactivate');
      });
    });
  }

  static visitEntityDetailsPageWithInactiveAddressesAndWait() {
    this.visitEntityDetailsPage('get-entity-by-id-inactive-addresses.json');
    cy.wait('@getEntityById');
  }

  static validateEntityAddressContainReactivateButton() {
    cy.get(billToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=activate-address-btn]').contains('Reactivate');
      });
    });
    cy.get(shipToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=activate-address-btn]').contains('Reactivate');
      });
    });
  }

  static validateEntityAddressesContainInactiveLabel() {
    cy.get(billToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-status]').contains('Inactive');
      });
    });
    cy.get(shipToAddresses).each($event => {
      cy.wrap($event).within(() => {
        cy.get('[data-cy=address-status]').contains('Inactive');
      });
    });
  }

  static clickFirstAddressReactivateButton(type) {
    cy.get(type === 'shipTo' ? shipToAddresses : billToAddresses)
      .find('button')
      .contains('Reactivate')
      .first()
      .click();
  }

  static getTotalCount() {
    cy.get(treeNode).find('span');
  }

  static getOrgName() {
    cy.get(treeNode).contains('My Org');
  }

  static getErpName() {
    cy.get(treeNode).contains('My ERP');
  }

  static getOrgDetails(name, code) {
    cy.get(entityName).contains(name);
    cy.get(entityCode).contains(code);
  }
  static getErpDetails() {
    cy.get(entityName).contains('ERPNewName');
    cy.get(entityCode).contains('ERPCode123');
  }
  static getEntityList() {
    cy.get(viewEntityList);
  }

  static getEntityDetails() {
    cy.intercept(getEntities('233', '2'), { fixture: 'get-entity.json' }).as(
      'entitiesByBusinessLevel'
    );
    cy.get(treeNode).eq(3).click();
    cy.intercept(getEntityByIdUrl('cadlbfshs605o7i35wl3'), { fixture: 'get-entity-by-id.json' }).as(
      'entityById'
    );
    cy.intercept(getTreeURL, { fixture: 'get-updated-tree.json' }).as('updatedTree');
    cy.get(viewEntityList).eq(1).click();
  }

  static getEntityDetailsNameandCode() {
    cy.get(entityName).contains('Company C');
    cy.get(entityCode).contains('COMPC');
  }

  static checkCount(node, count) {
    cy.get(treeNode).eq(node).find('span').contains(count);
  }

  static backToList() {
    this.clickBackBtn();
    cy.intercept(getTreeURL, { fixture: 'get-new-tree.json' }).as('newTree');
    this.clickBackBtn();
  }

  static editAddressClick(addressId) {
    cy.get(getEditAddressBtn(addressId)).click();
  }

  static clickOrg() {
    cy.get(toggleCard).contains('orgName').parent().parent().parent().find('button').click();
  }

  static clickErp() {
    cy.get(toggleCard).contains('erpName').parent().parent().parent().find('button').click();
  }

  static clickOrgAndErp() {
    this.clickOrg();
    this.clickErp();
  }

  static clickViewHierBtn() {
    cy.get(viewHierBtn).click();
  }

  static checkDisabledErps() {
    cy.get(toggleCard)
      .contains('erpNameTwo')
      .parent()
      .parent()
      .parent()
      .find('button')
      .should('have.class', 'disabled');
  }

  static checkEnabledErps() {
    cy.get(toggleCard)
      .contains('erpNameTwo')
      .parent()
      .parent()
      .parent()
      .find('button')
      .should('not.have.class', 'disabled');
  }

  static checkDisabledOrgs() {
    cy.get(toggleCard)
      .contains('orgNameTwo')
      .parent()
      .parent()
      .parent()
      .find('button')
      .should('have.class', 'disabled');
  }

  static checkEnabledOrgs() {
    cy.get(toggleCard)
      .contains('orgNameTwo')
      .parent()
      .parent()
      .parent()
      .find('button')
      .should('not.have.class', 'disabled');
  }

  static getSideSheet() {
    cy.get(sideSheet);
  }

  static editAddressFormFill(id, address, type, fixture, isFailure = false) {
    cy.intercept('PUT', editTypeAddressUrl(id, address.id, type), {
      fixture: `${fixture}.json`,
      statusCode: isFailure ? 500 : 200,
    }).as('updatedAddress');
    cy.get(addressInput).clear();
    cy.get(addressInput).type(address.line1);
    cy.get(cityInput).clear();
    cy.get(cityInput).type(address.city);
    cy.get(stateInput).clear();
    cy.get(stateInput).type(address.state);
    cy.get(postalCodeInput).clear();
    cy.get(postalCodeInput).type(address.zipCode);
    cy.get('button').contains('Save').click();
  }

  static isGone() {
    cy.get(sideSheet).should('not.be.visible');
  }

  static getAddressDetails(address, city, state, postalCode) {
    cy.get(address1).contains(address);
    cy.get(addressLocality).contains(city);
    cy.get(addressRegion).contains(state);
    cy.get(addressPostalCode).contains(postalCode);
  }

  static editAddressNull() {
    cy.get(addressInput).clear();
    cy.get(cityInput).clear();
    cy.get(stateInput).clear();
    cy.get(postalCodeInput).clear();
  }

  static checkErrorMsgInputs(err1, err2, err3, err4) {
    cy.get('input#address-input').invoke('attr', 'placeholder').should('contain', err1);
    cy.get('input#city-input').invoke('attr', 'placeholder').should('contain', err2);
    cy.get('input#state-input').invoke('attr', 'placeholder').should('contain', err3);
    cy.get('input#postal-code-input').invoke('attr', 'placeholder').should('contain', err4);
  }

  static saveBtnStatus() {
    cy.get('button').contains('Save').should('be.disabled');
  }

  static maxLengthChecker(input, inputId, string, max) {
    cy.get(input).clear();
    cy.get(input).type(string);
    cy.get(inputId).invoke('val').its('length').should('eq', max);
  }
}
export default BusHierDetailsPage;
