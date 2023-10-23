import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameService } from './game.service';
import {
  AddPlayerModel,
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
  mockPlayer1,
  mockGame1,
  mockGameData,
} from '@ui-coe/demo/shared/util';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameService, ConfigService],
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should create a game', async () => {
    const payload: CreateGameRequest = { gameName: 'Test Game', nickname: 'Test Player' };
    const response: CreateGameResponse = { message: 'Game created', player: mockGame1 };

    const promise = service.createGame(payload).toPromise();
    const req = httpMock.expectOne('/api/game/createGame');
    expect(req.request.method).toBe('POST');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should get games in lobby', async () => {
    const response: Game[] = [
      {
        _id: '1',
        gameName: 'Test Game',
        gameStatus: 'lobby',
        players: [],
        gameData: mockGameData,
        chat: [],
      },
    ];

    const promise = service.getGamesInLobby().toPromise();
    const req = httpMock.expectOne('/api/game/games');
    expect(req.request.method).toBe('GET');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should get a game', async () => {
    const gameId = '1';
    const response: Game = {
      _id: gameId,
      gameName: 'Test Game',
      gameStatus: 'lobby',
      players: [],
      gameData: mockGameData,
      chat: [],
    };

    const promise = service.getGame(gameId).toPromise();
    const req = httpMock.expectOne(`/api/game/game?gameId=${gameId}`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should add a player', async () => {
    const payload: UpdatePlayerRequest = { nickname: 'Test Player', gameId: '1' };
    const response: AddPlayerResponse = {
      message: 'Player added',
      game: mockGame1,
      player: mockPlayer1,
    };

    const promise = service.addPlayer(payload).toPromise();
    const req = httpMock.expectOne('/api/game/joinGame?gameId=1');
    expect(req.request.method).toBe('PUT');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should remove a player', async () => {
    const payload: RemovePlayerModel = { playerId: '1', gameId: '1' };
    const response: GenericResponse = { message: 'Player removed' };

    const promise = service.removePlayer(payload).toPromise();
    const req = httpMock.expectOne('/api/game/removePlayer?gameId=1');
    expect(req.request.method).toBe('PUT');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should get a websocket token', async () => {
    const response = 'token';

    const promise = service.getWebsocketToken().toPromise();
    const req = httpMock.expectOne('');
    expect(req.request.method).toBe('GET');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should start a game', async () => {
    const payload: StartGameModel = { gameId: '1', playerId: '1' };
    const response: GameUpdateResponse = { message: 'Game started', game: '' };

    const promise = service.startGame(payload).toPromise();
    const req = httpMock.expectOne('/api/game/startGame?gameId=1');
    expect(req.request.method).toBe('PUT');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should delete a game', async () => {
    const gameId = '1';

    const promise = service.deleteGame(gameId).toPromise();
    const req = httpMock.expectOne(`/api/game/deleteGame?gameId=${gameId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    await promise;
  });

  it('should roll dice', async () => {
    const payload: RollDiceRequest = { gameId: '1', playerId: '1' };
    const response: Player = {
      nickname: 'Test Player',
      id: '1',
      isHost: false,
      score: 0,
      brainsRolled: 0,
      shotgunsRolled: 0,
      initialRoll: false,
      diceRolled: {
        firstDie: {
          diceRoll: 'shotgun',
          diceValue: '3',
          die: { color: 'green', 1: '', 2: '', 3: 'shotgun', 4: '', 5: '', 6: '' },
        },
        secondDie: {
          diceRoll: 'brain',
          diceValue: '1',
          die: { color: 'yellow', 1: 'brain', 2: '', 3: '', 4: '', 5: '', 6: '' },
        },
        thirdDie: {
          diceRoll: 'footsteps',
          diceValue: '2',
          die: { color: 'red', 1: '', 2: 'footsteps', 3: '', 4: '', 5: '', 6: '' },
        },
      },
    };

    const promise = service.rollDice(payload).toPromise();
    const req = httpMock.expectOne('/api/game/rollDice');
    expect(req.request.method).toBe('PUT');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should end a turn', async () => {
    const payload: EndTurn = { gameId: '1', playerId: '1', score: 1 };
    const response: EndTurnResponse = { message: 'Turn ended' };

    const promise = service.endTurn(1, payload).toPromise();
    const req = httpMock.expectOne('/api/game/endTurn');
    expect(req.request.method).toBe('PUT');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });

  it('should send a chat message', async () => {
    const payload: SessionPlayerModel = { playerId: '1', playerName: 'Test Player', gameId: '1' };
    const chatMessage = 'Test message';
    const response = 'Message sent';

    const promise = service.sendChatMessage(chatMessage, payload).toPromise();
    const req = httpMock.expectOne('/api/game/chatMessage?gameId=1');
    expect(req.request.method).toBe('PUT');
    req.flush(response);

    const data = await promise;
    expect(data).toEqual(response);
  });
});
