import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CreateGameRequest,
  UpdatePlayerRequest,
  Game,
  Message,
  Player,
  GameWinner,
} from '@ui-coe/demo/shared/util';

import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';

@Injectable()
export class GameFacade {
  loaded$: Observable<boolean> = this.store.pipe(select(GameSelectors.getGameLoaded));
  gamesInLobby$: Observable<Game[]> = this.store.pipe(select(GameSelectors.getGamesInLobby));
  loadedGame$: Observable<Game> = this.store.pipe(select(GameSelectors.getLoadedGame));
  currentPlayer$: Observable<Player> = this.store.pipe(select(GameSelectors.getCurrentPlayer));
  playerTurn$: Observable<Player> = this.store.pipe(select(GameSelectors.getPlayerTurn));
  isPlayerTurn$: Observable<boolean> = this.store.pipe(select(GameSelectors.isPlayerTurn));
  winner$: Observable<GameWinner> = this.store.pipe(select(GameSelectors.getWinner));
  isGameLoaded$: Observable<boolean> = this.store.pipe(select(GameSelectors.isGameLoaded));
  webSocketToken$: Observable<string> = this.store.pipe(select(GameSelectors.getWebSocketToken));
  webSocketMessage$: Observable<Message> = this.store.pipe(
    select(GameSelectors.getLatestGameMessage)
  );
  error$: Observable<any> = this.store.pipe(select(GameSelectors.getGameError));
  response$: Observable<string> = this.store.pipe(select(GameSelectors.getGameResponse));

  constructor(private store: Store) {}

  createGame(payload: CreateGameRequest): void {
    this.store.dispatch(GameActions.createGame({ payload }));
  }

  getGames(): void {
    this.store.dispatch(GameActions.loadGamesInLobby());
  }

  getGame(gameId: string): void {
    this.store.dispatch(GameActions.loadGame({ gameId }));
  }

  addPlayer(payload: UpdatePlayerRequest): void {
    this.store.dispatch(GameActions.addPlayer({ payload }));
  }

  removePlayer(): void {
    this.store.dispatch(GameActions.removePlayer());
  }

  getWebsocketToken(): void {
    this.store.dispatch(GameActions.fetchWebsocketToken());
  }

  startGame(): void {
    this.store.dispatch(GameActions.startGame());
  }

  endTurn(): void {
    this.store.dispatch(GameActions.endTurn());
  }

  deleteGame(): void {
    this.store.dispatch(GameActions.deleteGame());
  }

  rollDice(): void {
    this.store.dispatch(GameActions.rollDice());
  }

  sendChatMessage(chatMessage: string): void {
    this.store.dispatch(GameActions.sendChatMessage({ chatMessage }));
  }

  processWebSocketMessage(message: Message): void {
    this.store.dispatch(GameActions.processWebSocketMessage({ message }));
  }

  updateGameState(game: Game): void {
    this.store.dispatch(GameActions.updateGameState({ game }));
  }
}
