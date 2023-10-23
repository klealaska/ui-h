import { createAction, props } from '@ngrx/store';
import {
  CreateGameRequest,
  GameEntity,
  Player,
  Message,
  UpdatePlayerRequest,
  Game,
} from '@ui-coe/demo/shared/util';

export const init = createAction('[Game Page] Init');

export const loadGamesInLobby = createAction('[Game] Load Games In Lobby List');
export const loadGamesInLobbySuccess = createAction(
  '[Game] Load Games In Lobby List Success',
  props<{ res: GameEntity[] }>()
);
export const loadGamesInLobbyFailure = createAction(
  '[Game] Load Games List In Lobby Failure',
  props<{ error: any }>()
);

export const loadGame = createAction('[Game] Load New Game', props<{ gameId: string }>());
export const loadGameSuccess = createAction('[Game] Load Game Success', props<{ res: any }>());
export const loadGameFailure = createAction('[Game] Load Game Failure', props<{ error: any }>());

export const createGame = createAction(
  '[Game] Create New Game',
  props<{ payload: CreateGameRequest }>()
);
export const createGameSuccess = createAction(
  '[Game] Create New Game Success',
  props<{ res: any }>()
);
export const createGameFailure = createAction(
  '[Game] Create New Game Failure',
  props<{ error: any }>()
);

export const addPlayer = createAction(
  '[Game] Add Player',
  props<{ payload: UpdatePlayerRequest }>()
);
export const addPlayerSuccess = createAction('[Game] Add Player Success', props<{ res: any }>());
export const addPlayerFailure = createAction('[Game] Add Player Failure', props<{ error: any }>());

export const removePlayer = createAction('[Game] Remove Player');
export const removePlayerSuccess = createAction(
  '[Game] Remove Player Success',
  props<{ res: any }>()
);
export const removePlayerFailure = createAction(
  '[Game] Remove Player Failure',
  props<{ error: any }>()
);

export const startGame = createAction('[Game] Start Game');
export const startGameSuccess = createAction('[Game] Start Game Success', props<{ res: any }>());
export const startGameFailure = createAction('[Game] Start Game Failure', props<{ error: any }>());

export const endTurn = createAction('[Game] End Turn');
export const endTurnSuccess = createAction('[Game] End Turn Success', props<{ res: any }>());
export const endTurnFailure = createAction('[Game] End Turn Failure', props<{ error: any }>());

export const deleteGame = createAction('[Game] Delete Game');
export const deleteGameSuccess = createAction('[Game] Delete Game Success', props<{ res: any }>());
export const deleteGameFailure = createAction(
  '[Game] Delete Game Failure',
  props<{ error: any }>()
);

export const fetchWebsocketToken = createAction('[Game] Fetch Websocket Token');
export const fetchWebsocketTokenSuccess = createAction(
  '[Game] Fetch Websocket Token Success',
  props<{ res: any }>()
);
export const fetchWebsocketTokenFailure = createAction(
  '[Game] Fetch Websocket Token Failure',
  props<{ error: any }>()
);

export const processWebSocketMessage = createAction(
  '[Game] Process WebSocket Message',
  props<{ message: Message }>()
);

export const processWebSocketMessageSuccess = createAction(
  '[Game] Message Processed Success',
  props<{ message: Message }>()
);

export const updateGameState = createAction('[Game] Update Game State', props<{ game: Game }>());

export const rollDice = createAction('[Game] Roll Dice');
export const rollDiceSuccess = createAction('[Game] Roll Dice Success', props<{ res: Player }>());
export const rollDiceFailure = createAction('[Game] Roll Dice Failure', props<{ error: any }>());

// Chatbox message
export const sendChatMessage = createAction(
  '[Game] Send Chat Message',
  props<{ chatMessage: string }>()
);
export const sendChatMessageSuccess = createAction(
  '[Game] Send Chat Message Success',
  props<{ res: any }>()
);
export const sendChatMessageFailure = createAction(
  '[Game] Send Chat Message Failure',
  props<{ error: any }>()
);
