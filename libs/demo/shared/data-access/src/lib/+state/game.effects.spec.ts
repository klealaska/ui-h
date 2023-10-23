import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { GameEffects } from './game.effects';
import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { Action } from '@ngrx/store';
import * as GameActions from './game.actions';
import { hot, cold } from 'jasmine-marbles';
import { mockGameEntities } from '@ui-coe/demo/shared/util';
import * as GameSelectors from './game.selectors';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('GameEffects', () => {
  let actions$: Observable<Action>;
  let effects: GameEffects;
  let gameService: GameService;
  let webSocketService: WebsocketService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: GameService,
          useValue: {
            getGamesInLobby: jest.fn(),
            getGame: jest.fn(),
            createGame: jest.fn(),
          },
        },
        {
          provide: WebsocketService,
          useValue: {
            initConnection: jest.fn(),
            processMessage: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(GameEffects);
    gameService = TestBed.inject(GameService);
    webSocketService = TestBed.inject(WebsocketService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadGamesInLobby$', () => {
    it('should return a loadGamesInLobbySuccess action, with the games, on success', () => {
      const action = GameActions.loadGamesInLobby();
      const outcome = GameActions.loadGamesInLobbySuccess({ res: mockGameEntities });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: mockGameEntities });
      const expected = cold('--b', { b: outcome });
      gameService.getGamesInLobby = jest.fn(() => response);

      expect(effects.loadGamesInLobby$).toBeObservable(expected);
    });

    it('should return a loadGamesInLobbyFailure action, with an error, on failure', () => {
      const error = new Error('Some error');
      const action = GameActions.loadGamesInLobby();
      const outcome = GameActions.loadGamesInLobbyFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      gameService.getGamesInLobby = jest.fn(() => response);

      expect(effects.loadGamesInLobby$).toBeObservable(expected);
    });
  });

  describe('loadGame$', () => {
    it('should return a loadGameSuccess action, with the game, on success', () => {
      const game = { id: 1 };
      const action = GameActions.loadGame({ gameId: '1' });
      const outcome = GameActions.loadGameSuccess({ res: game });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: game });
      const expected = cold('--b', { b: outcome });
      gameService.getGame = jest.fn(() => response);

      expect(effects.loadGame$).toBeObservable(expected);
    });

    it('should return a loadGameFailure action, with an error, on failure', () => {
      const error = new Error('Some error');
      const action = GameActions.loadGame({ gameId: '1' });
      const outcome = GameActions.loadGameFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      gameService.getGame = jest.fn(() => response);

      expect(effects.loadGame$).toBeObservable(expected);
    });
  });

  describe('createGame$', () => {
    it('should return a createGameSuccess action, with the game, on success', () => {
      const game = { id: 1 };
      const action = GameActions.createGame({ payload: { nickname: 'name', gameName: 'game1' } });
      const outcome = GameActions.createGameSuccess({ res: game });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: game });
      const expected = cold('--b', { b: outcome });
      gameService.createGame = jest.fn(() => response);

      expect(effects.createGame$).toBeObservable(expected);
    });

    it('should return a createGameFailure action, with an error, on failure', () => {
      const error = new Error('Some error');
      const action = GameActions.createGame({ payload: { nickname: 'name', gameName: 'game1' } });
      const outcome = GameActions.createGameFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      gameService.createGame = jest.fn(() => response);

      expect(effects.createGame$).toBeObservable(expected);
    });
  });

  describe('addPlayer$', () => {
    it('should return an addPlayerSuccess action, with the player, on success', () => {
      const player = { nickname: 'name', gameId: 'game1' };
      const action = GameActions.addPlayer({ payload: player });
      const outcome = GameActions.addPlayerSuccess({ res: player });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: player });
      const expected = cold('--b', { b: outcome });
      gameService.addPlayer = jest.fn(() => response);

      expect(effects.addPlayer$).toBeObservable(expected);
    });

    it('should return an addPlayerFailure action, with an error, on failure', () => {
      const error = new Error('Some error');
      const player = { nickname: 'name', gameId: 'game1' };
      const action = GameActions.addPlayer({ payload: player });
      const outcome = GameActions.addPlayerFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      gameService.addPlayer = jest.fn(() => response);

      expect(effects.addPlayer$).toBeObservable(expected);
    });
  });

  describe('removePlayer$', () => {
    it('should return a removePlayerSuccess action, with the player, on success', () => {
      const player = { nickname: 'name', gameId: 'game1' };
      const action = GameActions.removePlayer();
      const outcome = GameActions.removePlayerSuccess({ res: player });
      const ids = { gameId: 1, playerId: 1 };

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: player });
      const expected = cold('--b', { b: outcome });
      gameService.removePlayer = jest.fn(() => response);
      store.overrideSelector(GameSelectors.getPlayerAndGameIds, { gameId: '1', playerId: '1' });

      expect(effects.removePlayer$).toBeObservable(expected);
    });

    it('should return a removePlayerFailure action, with an error, on failure', () => {
      const error = new Error('Some error');
      const player = { nickname: 'name', gameId: 'game1' };
      const action = GameActions.removePlayer();
      const outcome = GameActions.removePlayerFailure({ error });
      const ids = { gameId: 1, playerId: 1 };

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      gameService.removePlayer = jest.fn(() => response);
      store.overrideSelector(GameSelectors.getPlayerAndGameIds, { gameId: '1', playerId: '1' });

      expect(effects.removePlayer$).toBeObservable(expected);
    });
  });

  describe('fetchWebSocketToken$', () => {
    it('should return a fetchWebsocketTokenSuccess action, with the token, on success', () => {
      const token = '123456789';
      const action = GameActions.fetchWebsocketToken();
      const outcome = GameActions.fetchWebsocketTokenSuccess({ res: { url: token } });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: { url: token } });
      const expected = cold('--b', { b: outcome });
      gameService.getWebsocketToken = jest.fn(() => response);

      expect(effects.fetchWebSocketToken$).toBeObservable(expected);
    });

    it('should return a fetchWebsocketTokenFailure action, with an error, on failure', () => {
      const error = new Error('Some error');
      const action = GameActions.fetchWebsocketToken();
      const outcome = GameActions.fetchWebsocketTokenFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      gameService.getWebsocketToken = jest.fn(() => response);

      expect(effects.fetchWebSocketToken$).toBeObservable(expected);
    });
  });
});
