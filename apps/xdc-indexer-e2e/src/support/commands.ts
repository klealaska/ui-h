/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import { OktaAuth } from '@okta/okta-auth-js';
import 'cypress-file-upload';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(username: string): Cypress.Chainable<void>;
      selectBuyer(selectMultiple?: boolean): Cypress.Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', username => {
  cy.session([Cypress.env('username'), Cypress.env('password')], () => {
    cy.request({
      method: 'POST',
      url: `https://${Cypress.env('okta_domain')}/api/v1/authn`,
      body: {
        username,
        password: Cypress.env('password'),
      },
    }).then(({ body }) => {
      const config = {
        issuer: `https://${Cypress.env('okta_domain')}/oauth2/ausr0idyduClJThOJ1d6`,
        clientId: Cypress.env('okta_clientId'),
        redirectUri: Cypress.env('redirectUri'),
        scopes: ['openid', 'email', 'profile'],
        pkce: true,
      };

      const authClient = new OktaAuth(config);

      return authClient.token
        .getWithoutPrompt({ sessionToken: body.sessionToken })
        .then(({ tokens }) => {
          window.sessionStorage.setItem(
            'tokens',
            JSON.stringify({
              access_token: tokens.accessToken.accessToken,
              id_token: tokens.idToken.idToken,
            })
          );
        });
    });
  });
});

Cypress.Commands.add('selectBuyer', (selectMultiple = false) => {
  cy.contains('Buyer selection').click();
  cy.get('[data-cy=buyer-filter-input]').find('input').type('AvidXchange');
  cy.wait(500);
  cy.get('mat-option').eq(0).click();

  if (selectMultiple) {
    cy.get('[data-cy=buyer-filter-input]').find('input').type('2 Qa');
    cy.wait(500);
    cy.get('mat-option').eq(0).click();
  }

  cy.get('[data-cy=buyer-modal-view-btn]').click();
  cy.wait(200);
});
