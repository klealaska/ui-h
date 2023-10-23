import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AddPlayerResponse,
  ChatMessageRequest,
  CreateGameRequest,
  CreateGameResponse,
  EndTurn,
  EndTurnResponse,
  Game,
  GameUpdateResponse,
  GenericResponse,
  Player,
  RemovePlayerModel,
  RollDiceRequest,
  StartGameModel,
  UpdatePlayerRequest,
  SessionPlayerModel,
} from '@ui-coe/demo/shared/util';
import { ConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  createGame(payload: CreateGameRequest): Observable<CreateGameResponse> {
    const url = this.configService.get('zombieDiceApiUrl') + '/api/game/createGame';
    return this.http.post<CreateGameResponse>(url, payload);
  }

  getGamesInLobby(): Observable<Game[]> {
    const url = this.configService.get('zombieDiceApiUrl') + '/api/game/games';
    return this.http.get<Game[]>(url);
  }

  getGame(gameId: string): Observable<Game> {
    const url = this.configService.get('zombieDiceApiUrl') + '/api/game/game?gameId=' + gameId;
    return this.http.get<Game>(url);
  }

  addPlayer(payload: UpdatePlayerRequest): Observable<AddPlayerResponse> {
    const url =
      this.configService.get('zombieDiceApiUrl') + '/api/game/joinGame?gameId=' + payload.gameId;
    return this.http.put<AddPlayerResponse>(url, { nickname: payload.nickname });
  }

  removePlayer(payload: RemovePlayerModel): Observable<GenericResponse> {
    const url =
      this.configService.get('zombieDiceApiUrl') +
      '/api/game/removePlayer?gameId=' +
      payload.gameId;
    return this.http.put<GenericResponse>(url, { playerId: payload.playerId });
  }

  getWebsocketToken(): Observable<any> {
    const url = this.configService.get('pubSubFunctionUrl');
    return this.http.get(url);
  }

  startGame(payload: StartGameModel): Observable<GameUpdateResponse> {
    const url =
      this.configService.get('zombieDiceApiUrl') + '/api/game/startGame?gameId=' + payload.gameId;
    const request = { playerId: payload.playerId };
    return this.http.put<GameUpdateResponse>(url, request);
  }

  deleteGame(gameId: string) {
    const url =
      this.configService.get('zombieDiceApiUrl') + '/api/game/deleteGame?gameId=' + gameId;
    return this.http.delete(url);
  }

  rollDice(payload: RollDiceRequest): Observable<Player> {
    const url = this.configService.get('zombieDiceApiUrl') + '/api/game/rollDice';
    return this.http.put<Player>(url, payload);
  }

  endTurn(score: number, payload: EndTurn): Observable<EndTurnResponse> {
    const url = this.configService.get('zombieDiceApiUrl') + '/api/game/endTurn';
    const request = {
      gameId: payload.gameId,
      playerId: payload.playerId,
      score,
    };
    return this.http.put<EndTurnResponse>(url, request);
  }

  sendChatMessage(chatMessage: string, payload: SessionPlayerModel): Observable<string> {
    const request: ChatMessageRequest = {
      playerId: payload.playerId,
      nickname: payload.playerName,
      message: chatMessage,
    };

    const url =
      this.configService.get('zombieDiceApiUrl') + '/api/game/chatMessage?gameId=' + payload.gameId;

    return this.http.put<string>(url, request);
  }
}
