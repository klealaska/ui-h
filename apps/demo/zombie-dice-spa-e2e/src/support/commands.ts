// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});

// Below commands need to be fixed for tests to work

// Cypress.Commands.add('dispatchWebsocketAction', (res, actionType) => {
//   cy.window().then(w => {
//     const action = { type: actionType, res: res };
//     const store = w['store'];
//     store.dispatch(action);
//   });
// });

// Cypress.Commands.add('startGameFacade', message => {
//   cy.window().then(w => {
//     const gameFacade = w['gameFacade'];
//     gameFacade.processWebSocketMessage(message);
//   });
// });

// Cypress.Commands.add('angularRouter', route => {
//   cy.window().then(w => {
//     w['router'].navigate([route]);
//   });
// });

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
