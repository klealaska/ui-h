const createGameBtn = '[data-cy=create-game-btn]';
const removeGameBtn = '[data-cy=remove-game-btn]';
const startGameBtn = '[data-cy=start-game-btn]';
const joinGameBtn = '[data-cy=join-game-btn]';
const leaveGameBtn = '[data-cy=leave-game-btn]';

class MenuPage {
  static visit() {
    cy.intercept('/api/game/games', { fixture: 'games.json' }).as('games');

    cy.visit('/');
    cy.wait('@games');
  }

  static lobby() {
    MenuPage.visit();
    MenuPage.userNameType('CyName');
    MenuPage.gameNameType('CyGame');
    MenuPage.createGame();
  }

  static joinLobby() {
    MenuPage.visit();
    MenuPage.selectGame();
    MenuPage.joinUserNameType('CyName');
    MenuPage.joinGame();
  }

  static startGame() {
    const message = {
      type: 'Start Game',
      game: {
        _id: '1',
        gameName: 'CyGame',
        gameStatus: 'Active',
        players: [
          {
            nickname: 'CyName',
            id: '1',
            isHost: true,
            score: 0,
            brainsRolled: 0,
            shotgunsRolled: 0,
            initialRoll: true,
          },
        ],
        gameData: {
          hostId: '1',
          turnIndex: 0,
          playerTurn: '1',
          turns: [],
          winner: {
            id: '',
            name: '',
          },
          dicePool: [
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'shotgun',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'red',
            },
            {
              1: 'brain',
              2: 'shotgun',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'red',
            },
            {
              1: 'brain',
              2: 'shotgun',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'red',
            },
          ],
          response: '',
        },
        __v: 0,
      },
    };

    // Route to game page here. For reasons unknown, routing is not working properly if triggered after the intercept below.
    cy.angularRouter('/game');

    cy.intercept('/api/game/startGame?gameId=1', { fixture: 'startGame-response.json' }).as(
      'startGame'
    );
    MenuPage.startGameBtn().click();
    cy.startGameFacade(message);
  }

  static userNameType(query) {
    cy.get('[data-cy=nickname-input]').type(query); // 2 seconds
  }

  static gameNameType(query) {
    cy.get('[data-cy=gamename-input]').type(query); // 2 seconds
  }

  static joinUserNameType(query) {
    cy.get('[data-cy=join-nickname-input]').type(query); // 2 seconds
  }

  static createGameBtn() {
    return cy.get(createGameBtn);
  }

  static joinGameBtn() {
    return cy.get(joinGameBtn);
  }

  static removeGameBtn() {
    return cy.get(removeGameBtn);
  }

  static leaveGameBtn() {
    return cy.get(leaveGameBtn);
  }

  static startGameBtn() {
    return cy.get(startGameBtn);
  }

  static selectGame() {
    cy.contains('td', 'Game 1').siblings().first().children().click();
  }

  static createGame() {
    const message = {
      type: 'Create Game',
      game: {
        _id: '1',
        gameName: 'CyGame',
        gameStatus: 'Lobby',
        players: [
          {
            nickname: 'CyName',
            id: '1',
            isHost: true,
            score: 0,
            brainsRolled: 0,
            shotgunsRolled: 0,
            initialRoll: true,
          },
        ],
        gameData: {
          hostId: '1',
          turnIndex: 0,
          playerTurn: '1',
          turns: [],
          winner: {
            id: '',
            name: '',
          },
          dicePool: [
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'brain',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'green',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'brain',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'yellow',
            },
            {
              1: 'brain',
              2: 'shotgun',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'red',
            },
            {
              1: 'brain',
              2: 'shotgun',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'red',
            },
            {
              1: 'brain',
              2: 'shotgun',
              3: 'shotgun',
              4: 'shotgun',
              5: 'footsteps',
              6: 'footsteps',
              color: 'red',
            },
          ],
          response: '',
        },
        __v: 0,
      },
    };

    cy.intercept('/api/game/createGame', { fixture: 'createGame.json' }).as('createGameInter');
    this.createGameBtn().click();
    cy.dispatchWebsocketAction(message, '[Game] Process WebSocket Message');
  }

  static joinGame() {
    cy.intercept('/api/game/joinGame?gameId=1', { fixture: 'joinGame.json' }).as('joinGameInter');
    this.joinGameBtn().click();
  }

  static removeGame() {
    cy.intercept('/api/game/removePlayer?gameId=1', {
      message: 'Player has been successfully removed from CyGame.',
    }).as('removePlayer');

    this.removeGameBtn().click();
  }

  static leaveGame() {
    cy.intercept('/api/game/removePlayer?gameId=1', {
      message: 'Player has been successfully removed from CyGame.',
    }).as('removePlayer');

    this.leaveGameBtn().click();
  }

  static removePlayerSuccess() {
    cy.wait('@removePlayer').then(inter => {
      expect(inter.response.body.message).to.equal(
        'Player has been successfully removed from CyGame.'
      );
    });
  }
}

export default MenuPage;
