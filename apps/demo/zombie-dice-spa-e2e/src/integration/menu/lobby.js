import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import MenuPage from '../../pages/menu/menu-page';

Given(/^I've created a game$/, () => {
  MenuPage.lobby();
});

When(/^I click "Remove Game"$/, () => {
  MenuPage.removeGame();
});

When(/^I click "Start Game"$/, () => {
  MenuPage.startGame();
});

Then(/^I receive the message "Player has been successfully removed from CyGame."$/, () => {
  MenuPage.removePlayerSuccess();
});

Then(/^I will be rerouted to "game"$/, () => {
  cy.url().should('include', 'game');
});
