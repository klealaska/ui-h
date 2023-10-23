import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { GameFacade } from './game.facade';
import * as GameActions from './game.actions';
import { mockGame1, mockMessage } from '@ui-coe/demo/shared/util';

describe('GameFacade', () => {
  let facade: GameFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameFacade, provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    facade = TestBed.inject(GameFacade);
  });

  it('should dispatch createGame action', () => {
    const payload = { gameName: '123', nickname: 'john' };
    const action = GameActions.createGame({ payload });

    const spy = jest.spyOn(store, 'dispatch');
    facade.createGame(payload);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch loadGamesInLobby action', () => {
    const action = GameActions.loadGamesInLobby();

    const spy = jest.spyOn(store, 'dispatch');
    facade.getGames();

    expect(spy).toHaveBeenCalledWith(action);
  });
  it('should dispatch loadGame action', () => {
    const gameId = '123';
    const action = GameActions.loadGame({ gameId });

    const spy = jest.spyOn(store, 'dispatch');
    facade.getGame(gameId);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch addPlayer action', () => {
    const payload = { gameId: '123', playerId: '456' };
    const action = GameActions.addPlayer({ payload });

    const spy = jest.spyOn(store, 'dispatch');
    facade.addPlayer(payload);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch removePlayer action', () => {
    const action = GameActions.removePlayer();

    const spy = jest.spyOn(store, 'dispatch');
    facade.removePlayer();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch fetchWebsocketToken action', () => {
    const action = GameActions.fetchWebsocketToken();

    const spy = jest.spyOn(store, 'dispatch');
    facade.getWebsocketToken();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch startGame action', () => {
    const action = GameActions.startGame();

    const spy = jest.spyOn(store, 'dispatch');
    facade.startGame();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch endTurn action', () => {
    const action = GameActions.endTurn();

    const spy = jest.spyOn(store, 'dispatch');
    facade.endTurn();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch deleteGame action', () => {
    const action = GameActions.deleteGame();

    const spy = jest.spyOn(store, 'dispatch');
    facade.deleteGame();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch rollDice action', () => {
    const action = GameActions.rollDice();

    const spy = jest.spyOn(store, 'dispatch');
    facade.rollDice();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch sendChatMessage action', () => {
    const chatMessage = 'test message';
    const action = GameActions.sendChatMessage({ chatMessage });

    const spy = jest.spyOn(store, 'dispatch');
    facade.sendChatMessage(chatMessage);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch processWebSocketMessage action', () => {
    const message = mockMessage;
    const action = GameActions.processWebSocketMessage({ message });

    const spy = jest.spyOn(store, 'dispatch');
    facade.processWebSocketMessage(message);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch updateGameState action', () => {
    const game = mockGame1;
    const action = GameActions.updateGameState({ game });

    const spy = jest.spyOn(store, 'dispatch');
    facade.updateGameState(game);

    expect(spy).toHaveBeenCalledWith(action);
  });
});
