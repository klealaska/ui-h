import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Game, Player } from '@ui-coe/demo/shared/util';
import { GAME_FEATURE_KEY, State, gameAdapter } from './game.reducer';

// Lookup the 'Game' feature state managed by NgRx
export const getGameState = createFeatureSelector<State>(GAME_FEATURE_KEY);

const { selectAll, selectEntities } = gameAdapter.getSelectors();

export const getGameLoaded = createSelector(getGameState, (state: State) => state.loaded);

export const getGameError = createSelector(getGameState, (state: State) => state.error?.error);

export const getGamesInLobby = createSelector(getGameState, (state: State) => selectAll(state));

export const getLoadedGame = createSelector(getGameState, (state: State) => state.loadedGame);

export const getCurrentGameId = createSelector(getLoadedGame, (game: Game) => game?._id);

export const isGameLoaded = createSelector(getGameState, (state: State) => !!state.loadedGame);

export const getPlayers = createSelector(getLoadedGame, (game: Game) => game?.players);

export const getCurrentPlayer = createSelector(getGameState, (state: State) => state.player);

export const getCurrentPlayerId = createSelector(getCurrentPlayer, (player: Player) => player?.id);

export const getCurrentPlayerName = createSelector(
  getCurrentPlayer,
  (player: Player) => player?.nickname
);

// export const chatMessage = createSelector(getGameState, (state: State) => state.chatMessage);

export const getCurrentPlayerBrainsRolled = createSelector(
  getCurrentPlayer,
  (player: Player) => player?.brainsRolled
);

export const getPlayerTurn = createSelector(
  getLoadedGame,
  (game: Game) => game.players[game?.gameData?.turnIndex]
);

export const isPlayerTurn = createSelector(
  getPlayerTurn,
  getCurrentPlayerId,
  (playerTurn: Player, playerId: string) => playerTurn.id === playerId
);

export const getWinner = createSelector(getLoadedGame, (game: Game) => game?.gameData?.winner);

export const getGameResponse = createSelector(
  getLoadedGame,
  (game: Game) => game?.gameData?.response
);

export const getPlayerAndGameIds = createSelector(
  getCurrentGameId,
  getCurrentPlayerId,
  (gameId, playerId) => {
    return { playerId: playerId, gameId: gameId };
  }
);

export const getPlayerAndGameId = createSelector(
  getCurrentGameId,
  getCurrentPlayer,
  (gameId, player) => {
    return { playerId: player?.id, playerName: player?.nickname, gameId: gameId };
  }
);

export const getEndTurnData = createSelector(
  getPlayerAndGameIds,
  getCurrentPlayerBrainsRolled,
  (ids, score) => {
    return { ids: ids, score: score };
  }
);

export const getLoadedGameId = createSelector(
  getGameState,
  (state: State) => state.loadedGame?._id
);

export const getWebSocketToken = createSelector(
  getGameState,
  (state: State) => state.webSocketToken
);

export const getWebsocketMessage = createSelector(getGameState, (state: State) => state.message);

export const getLatestGameMessage = createSelector(
  getGameState,
  (state: State) => state.processedMessage
);

export const getGameEntities = createSelector(getGameState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(getGameState, (state: State) => state.selectedId);

export const getSelected = createSelector(
  getGameEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getSessionPlayer = createSelector(
  getCurrentGameId,
  getCurrentPlayer,
  (gameId, player) => {
    return { playerId: player?.id, playerName: player?.nickname, gameId: gameId };
  }
);

// export const getChatMessages = createSelector(getGameState, (state: State) => state.chatMessage);
