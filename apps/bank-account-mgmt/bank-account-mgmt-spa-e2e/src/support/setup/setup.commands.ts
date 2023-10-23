// /* eslint-disable prettier/prettier */
// // This file is used for any custom commands.  Below is a login custom command that can be reused throughout the
// // Cypress specs instead of repeating the login process.  Obviously, right now we don't have any notion of
// // authentication so simply hitting localhost:4200 is the login flow.

// // ***REQUIRED INTERFACE FOR ANY CUSTOM COMMANDS IN THIS FILE (MAY BE ABLE TO ABSTRACT IF WE WANT)***
// // eslint-disable-next-line @typescript-eslint/no-namespace
// declare namespace Cypress {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   interface Chainable<Subject> {
//     login(url: string): void;
//     getByCy(value: string): Chainable<Element>;
//     getById(value: string): Chainable<Element>;
//     getByClassName(value: string): Chainable<Element>;
//     clickLinkByLabel(label: string): void;
//   }
// }

// // ***CUSTOM COMMAND***
// // In the future, we will add to this.  However, a login custom command that types the email, password, and clicks a button
// //  each time is a poor performing custom command.  There are best practices that surround doing things like this that we can
// // discuss in an Xpensables tech huddle that will ensure that the login flow is a fraction of a second as opposed to 4+ seconds
// // per test.
// Cypress.Commands.add('login', url => {
//   cy.visit(url);
// });

// Cypress.Commands.add('getByCy', value => {
//   return cy.get(`[data-cy=${value}]`);
// });

// Cypress.Commands.add('getById', value => {
//   return cy.get(`[id=${value}]`);
// });

// Cypress.Commands.add('getByClassName', value => {
//   return cy.get(`.${value}`);
// });

// Cypress.Commands.add('clickLinkByLabel', label => {
//   cy.get('a').contains(label).click();
// });
