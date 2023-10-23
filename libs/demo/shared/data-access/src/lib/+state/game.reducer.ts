import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as GameActions from './game.actions';
import { GameEntity, Message, Player } from '@ui-coe/demo/shared/util';

export const GAME_FEATURE_KEY = 'game';

export interface State extends EntityState<GameEntity> {
  selectedId?: string | number; // which Game record has been selected
  loadedGame?: GameEntity;
  player: Player;
  message: Message; // unfiltered message that is not necessarily specific to current game
  processedMessage: Message; // processed messages are specific to current game
  webSocketToken?: string;
  loaded: boolean; // has the Game list been loaded
  error?: any; // last known error (if any)
}

export interface GamePartialState {
  readonly [GAME_FEATURE_KEY]: State;
}

export const gameAdapter: EntityAdapter<GameEntity> = createEntityAdapter<GameEntity>({
  selectId: (Game: any) => Game._id,
});

export const initialState: State = gameAdapter.getInitialState({
  // set initial required properties
  player: null,
  message: null,
  processedMessage: null,
  loaded: false,
});

const GameReducer = createReducer(
  initialState,
  on(GameActions.loadGamesInLobby, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GameActions.loadGamesInLobbySuccess, (state, { res }) => {
    return gameAdapter.setAll(res, { ...state, loaded: true });
  }),
  on(GameActions.loadGamesInLobbyFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(GameActions.loadGame, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GameActions.loadGameSuccess, (state, action) => ({
    ...state,
    loadedGame: action.res,
    player: action?.res?.players?.find(player => state.player.id === player.id),
    loaded: false,
    error: null,
  })),
  on(GameActions.loadGameFailure, (state, action) => ({
    ...state,
    loadedGame: null,
    loaded: false,
    error: action.error,
  })),

  on(GameActions.createGame, state => ({
    ...state,
    player: null,
    loaded: false,
    error: null,
  })),
  on(GameActions.createGameSuccess, (state, action) => ({
    ...state,
    loadedGame: action.res?.game,
    player: action.res?.player,
    loaded: true,
    error: null,
  })),
  on(GameActions.createGameFailure, (state, { error }) => ({
    ...state,
    error,
    loaded: true,
  })),

  on(GameActions.addPlayer, state => ({
    ...state,
    loadedGame: null,
    player: null,
    loaded: false,
    error: null,
  })),

  on(GameActions.addPlayerSuccess, (state, action) => ({
    ...state,
    loadedGame: action.res?.game,
    player: action.res?.player,
    loaded: true,
    error: null,
  })),

  on(GameActions.removePlayer, state => ({
    ...state,
    loaded: false,
    error: null,
  })),

  on(GameActions.removePlayerSuccess, state => ({
    ...state,
    loadedGame: null,
    player: null,
    loaded: true,
    error: null,
  })),

  on(GameActions.startGame, state => ({
    ...state,
    loaded: false,
    error: null,
  })),

  on(GameActions.startGameSuccess, (state, action) => ({
    ...state,
    loaded: true,
    error: null,
  })),

  on(GameActions.startGameFailure, (state, action) => ({
    ...state,
    loaded: true,
    error: action.error,
  })),

  on(GameActions.addPlayer, state => ({
    ...state,
    loadedGame: null,
    player: null,
    loaded: false,
    error: null,
  })),
  on(GameActions.addPlayerSuccess, (state, action) => ({
    ...state,
    loadedGame: action.res?.game,
    player: action.res?.player,
    loaded: true,
    error: null,
  })),

  on(GameActions.removePlayer, state => ({
    ...state,
    loaded: false,
    error: null,
  })),

  on(GameActions.removePlayerSuccess, state => ({
    ...state,
    loadedGame: null,
    player: null,
    loaded: true,
    error: null,
  })),

  on(GameActions.rollDice, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GameActions.rollDiceSuccess, (state, action) => ({
    ...state,
    player: action.res,
    loaded: true,
    error: null,
  })),

  on(GameActions.fetchWebsocketToken, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GameActions.fetchWebsocketTokenSuccess, (state, action) => ({
    ...state,
    webSocketToken: action?.res?.url,
    loaded: true,
    error: null,
  })),
  on(GameActions.fetchWebsocketTokenFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(GameActions.processWebSocketMessage, (state, action) => ({
    ...state,
    message: action.message,
  })),

  on(GameActions.processWebSocketMessageSuccess, (state, action) => ({
    ...state,
    processedMessage: action.message,
  })),

  on(GameActions.updateGameState, (state, action) => ({
    ...state,
    loadedGame: action.game,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return GameReducer(state, action);
}
