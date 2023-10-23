import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import MenuPage from '../../pages/menu/menu-page';

Given(/^I'm at menu$/, () => {
  MenuPage.visit();
});

Then(/^Create button should be disabled$/, () => {
  MenuPage.createGameBtn().should('be.disabled');
});

When(/^I enter User Name as "CyName"$/, () => {
  MenuPage.userNameType('CyName');
});

When(/^I enter Game Name as "CyGame"$/, () => {
  MenuPage.gameNameType('CyGame');
});

Then(/^Create Game should be successful$/, () => {
  MenuPage.createGame();
});
