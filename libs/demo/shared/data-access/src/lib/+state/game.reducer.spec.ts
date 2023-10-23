import { State, initialState, reducer } from './game.reducer';
import * as GameActions from './game.actions';
import { Player, Message, mockMessage } from '@ui-coe/demo/shared/util';
import { Action } from '@ngrx/store';

describe('Game Reducer', () => {
  const createGameEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as any);

  let state: State;

  beforeEach(() => {
    state = {
      ...initialState,
      loaded: false,
      error: null,
    };
  });

  describe('valid Game actions', () => {
    it('loadGameSuccess should set the list of known Game', () => {
      const gameEntity = createGameEntity('PRODUCT-AAA');
      const action = GameActions.loadGameSuccess({ res: gameEntity });

      const result: State = reducer(state, action);

      expect(result.loadedGame).toBe(gameEntity);
      expect(result.loaded).toBe(false);
      expect(result.error).toBeNull();
    });

    it('loadGameFailure should set error', () => {
      const action = GameActions.loadGameFailure({ error: 'error' });

      const result: State = reducer(state, action);

      expect(result.error).toBe('error');
      expect(result.loaded).toBe(false);
    });

    it('createGameSuccess should update state with new game and player', () => {
      const res = {
        game: createGameEntity('PRODUCT-AAA'),
        player: { id: '123' } as Player,
      };
      const action = GameActions.createGameSuccess({ res });

      const result: State = reducer(state, action);

      expect(result.loadedGame).toEqual(res.game);
      expect(result.player).toEqual(res.player);
      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();
    });

    it('createGameFailure should set error', () => {
      const error = 'error';
      const action = GameActions.createGameFailure({ error });

      const result: State = reducer(state, action);

      expect(result.error).toBe(error);
      expect(result.loaded).toBe(true);
    });

    it('addPlayerSuccess should update state with new game and player', () => {
      const res = {
        game: createGameEntity('PRODUCT-AAA'),
        player: { id: '123' } as Player,
      };
      const action = GameActions.addPlayerSuccess({ res });

      const result: State = reducer(state, action);

      expect(result.loadedGame).toEqual(res.game);
      expect(result.player).toEqual(res.player);
      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();
    });

    it('removePlayerSuccess should update state to null game and player', () => {
      const action = GameActions.removePlayerSuccess(null);

      const result: State = reducer(state, action);

      expect(result.loadedGame).toBeNull();
      expect(result.player).toBeNull();
      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();
    });

    it('startGameSuccess should update state to true loaded', () => {
      const action = GameActions.startGameSuccess(null);

      const result: State = reducer(state, action);

      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();
    });

    it('startGameFailure should set error', () => {
      const error = 'error';
      const action = GameActions.startGameFailure({ error });

      const result: State = reducer(state, action);

      expect(result.error).toBe(error);
      expect(result.loaded).toBe(true);
    });

    it('rollDiceSuccess should update state with new player data', () => {
      const player = { id: '123' } as Player;
      const action = GameActions.rollDiceSuccess({ res: player });

      const result: State = reducer(state, action);

      expect(result.player).toEqual(player);
      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();
    });

    it('fetchWebsocketTokenSuccess should update state with new webSocketToken', () => {
      const res = { url: 'ws://test.com' };
      const action = GameActions.fetchWebsocketTokenSuccess({ res });

      const result: State = reducer(state, action);

      expect(result.webSocketToken).toEqual(res.url);
      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();
    });

    it('fetchWebsocketTokenFailure should set error', () => {
      const error = 'error';
      const action = GameActions.fetchWebsocketTokenFailure({ error });

      const result: State = reducer(state, action);

      expect(result.error).toBe(error);
    });

    it('processWebSocketMessage should update state with new message', () => {
      const message = mockMessage as Message;
      const action = GameActions.processWebSocketMessage({ message });

      const result: State = reducer(state, action);

      expect(result.message).toEqual(message);
    });

    it('processWebSocketMessageSuccess should update state with new processedMessage', () => {
      const message = mockMessage as Message;
      const action = GameActions.processWebSocketMessageSuccess({ message });

      const result: State = reducer(state, action);

      expect(result.processedMessage).toEqual(message);
    });

    it('updateGameState should update state with new game', () => {
      const game = createGameEntity('PRODUCT-AAA');
      const action = GameActions.updateGameState({ game });

      const result: State = reducer(state, action);

      expect(result.loadedGame).toEqual(game);
    });
  });

  describe('unknown action', () => {
    it('should return the initial state on an unknown action', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
