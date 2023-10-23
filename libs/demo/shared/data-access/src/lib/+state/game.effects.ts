import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@ngrx/router-store/data-persistence';
import { map, withLatestFrom, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as GameActions from './game.actions';
import { GameService } from '../services/game.service';
import * as GameSelectors from './game.selectors';
import { Store } from '@ngrx/store';
import { WebsocketService } from '../services/websocket.service';

@Injectable()
export class GameEffects {
  loadGamesInLobby$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.loadGamesInLobby),
      switchMap(action =>
        this.gameService.getGamesInLobby().pipe(
          map(res =>
            GameActions.loadGamesInLobbySuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.loadGamesInLobbyFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  loadGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.loadGame),
      switchMap(action =>
        this.gameService.getGame(action.gameId).pipe(
          map(res =>
            GameActions.loadGameSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.loadGameFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  createGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.createGame),
      switchMap(action =>
        this.gameService.createGame(action.payload).pipe(
          map(res =>
            GameActions.createGameSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.createGameFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  addPlayer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.addPlayer),
      switchMap(action =>
        this.gameService.addPlayer(action.payload).pipe(
          map(res =>
            GameActions.addPlayerSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.addPlayerFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  removePlayer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.removePlayer),
      withLatestFrom(this.store.select(GameSelectors.getPlayerAndGameIds)),
      switchMap(([action, request]) =>
        this.gameService.removePlayer(request).pipe(
          map(res =>
            GameActions.removePlayerSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.removePlayerFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  fetchWebSocketToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.fetchWebsocketToken),
      switchMap(action =>
        this.gameService.getWebsocketToken().pipe(
          map(res =>
            GameActions.fetchWebsocketTokenSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.fetchWebsocketTokenFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  initWebSocketConnection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameActions.fetchWebsocketTokenSuccess),
        tap(action => this.webSocketService.initConnection(action?.res?.url))
      ),
    { dispatch: false }
  );

  processWebSocketMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.processWebSocketMessage),
      withLatestFrom(this.store.select(GameSelectors.getLoadedGame)),
      map(([action, currentGame]) => {
        const message = this.webSocketService.processMessage(currentGame, action.message);
        return GameActions.processWebSocketMessageSuccess({ message });
      })
    );
  });

  startGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.startGame),
      withLatestFrom(this.store.select(GameSelectors.getPlayerAndGameIds)),
      switchMap(([action, request]) =>
        this.gameService.startGame(request).pipe(
          map(res =>
            GameActions.startGameSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.startGameFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  deleteGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.removePlayer),
      withLatestFrom(this.store.select(GameSelectors.getLoadedGameId)),
      switchMap(([action, gameId]) =>
        this.gameService.deleteGame(gameId).pipe(
          map(res =>
            GameActions.deleteGameSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.deleteGameFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  rollDice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.rollDice),
      withLatestFrom(this.store.select(GameSelectors.getPlayerAndGameIds)),
      switchMap(([action, request]) =>
        this.gameService.rollDice(request).pipe(
          map(res =>
            GameActions.rollDiceSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.rollDiceFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  endTurn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.endTurn),
      withLatestFrom(this.store.select(GameSelectors.getEndTurnData)),
      switchMap(([action, request]) =>
        this.gameService.endTurn(request.score, request.ids).pipe(
          map(res =>
            GameActions.endTurnSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.endTurnFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  sendChatMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GameActions.sendChatMessage),
      withLatestFrom(this.store.select(GameSelectors.getSessionPlayer)),
      switchMap(([action, request]) =>
        this.gameService.sendChatMessage(action.chatMessage, request).pipe(
          map(res =>
            GameActions.sendChatMessageSuccess({
              res,
            })
          ),
          catchError(error =>
            of(
              GameActions.sendChatMessageFailure({
                error,
              })
            )
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private gameService: GameService,
    private webSocketService: WebsocketService,
    private store: Store
  ) {}
}
