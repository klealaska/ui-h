import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import MenuPage from '../../pages/menu/menu-page';

Given(/^I'm at menu$/, () => {
  MenuPage.visit();
});

Given(/^I've joined a game$/, () => {
  MenuPage.joinLobby();
});

When(/^I select a game$/, () => {
  MenuPage.selectGame();
});

When(/^I enter Uame Name as "CyName"$/, () => {
  MenuPage.joinUserNameType('CyName');
});

When(/^I click "Leave Game"$/, () => {
  MenuPage.leaveGame();
});

Then(/^Join Game button should be disabled$/, () => {
  MenuPage.joinGameBtn().should('be.disabled');
});

Then(/^Join Game button should be successful$/, () => {
  MenuPage.joinGame();
});

Then(/^I receive the message "Player has been successfully removed from CyGame."$/, () => {
  MenuPage.removePlayerSuccess();
});
