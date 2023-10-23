// import { NetworkRequestKeys } from '../../network-request-keys';

// describe('HotKeys', () => {
//   before(() => {
//     cy.login();

//     cy.fixture('composite-document').then(fixture => {
//       cy.intercept('**/user/*', fixture).as(NetworkRequestKeys.getDocumentData.interceptAlias);
//     });

//     cy.visit(`/indexing/682219b6-9e67-4705-8fb3-62e63b668b23`);
//     cy.wait(NetworkRequestKeys.getDocumentData.waitAlias, { timeout: 10000 }).then(response => {
//       expect(response.response.statusCode).to.equal(200);
//     });
//   });

//   it('hotkey trigger - should be displaying the hotkeys dialog', () => {
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get('body').type('{alt}{/}').click();
//     cy.get('xdc-hotkeys-dialog').should('be.visible');
//   });

//   it('should close the modal', () => {
//     cy.get('#hotkey-modal-close').click();
//     cy.get('xdc-hotkeys-dialog').should('not.exist');
//   });

//   it('user menu - should display the hotkeys dialog', () => {
//     cy.get('.user-menu').click();
//     cy.get('.mat-menu-panel').should('be.visible');

//     cy.get('.mat-menu-panel').find('button:nth-child(3)').click();

//     cy.get('xdc-hotkeys-dialog').should('be.visible');

//     cy.get('#hotkey-modal-close').click();

//     cy.get('xdc-hotkeys-dialog').should('not.exist');
//   });
// });
