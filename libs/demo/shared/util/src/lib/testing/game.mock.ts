import { GameData, GameEntity, Message, Player } from '../models/game.models';

export const mockPlayer1: Player = {
  nickname: 'John',
  id: '1',
  isHost: true,
  score: 10,
  brainsRolled: 2,
  shotgunsRolled: 1,
  initialRoll: true,
  diceRolled: {
    firstDie: {
      diceRoll: 'brain',
      diceValue: 'green',
      die: {
        color: 'green',
        1: 'brain',
        2: 'shotgun',
        3: 'shotgun',
        4: 'feet',
        5: 'feet',
        6: 'brain',
      },
    },
    secondDie: {
      diceRoll: 'brain',
      diceValue: 'green',
      die: {
        color: 'green',
        1: 'brain',
        2: 'shotgun',
        3: 'shotgun',
        4: 'feet',
        5: 'feet',
        6: 'brain',
      },
    },
    thirdDie: {
      diceRoll: 'brain',
      diceValue: 'green',
      die: {
        color: 'green',
        1: 'brain',
        2: 'shotgun',
        3: 'shotgun',
        4: 'feet',
        5: 'feet',
        6: 'brain',
      },
    },
  },
};

export const mockPlayer2: Player = {
  nickname: 'Tim',
  id: '2',
  isHost: false,
  score: 4,
  brainsRolled: 2,
  shotgunsRolled: 1,
  initialRoll: true,
  diceRolled: {
    firstDie: {
      diceRoll: 'brain',
      diceValue: 'green',
      die: {
        color: 'green',
        1: 'brain',
        2: 'shotgun',
        3: 'shotgun',
        4: 'feet',
        5: 'feet',
        6: 'brain',
      },
    },
    secondDie: {
      diceRoll: 'brain',
      diceValue: 'green',
      die: {
        color: 'green',
        1: 'brain',
        2: 'shotgun',
        3: 'shotgun',
        4: 'feet',
        5: 'feet',
        6: 'brain',
      },
    },
    thirdDie: {
      diceRoll: 'brain',
      diceValue: 'green',
      die: {
        color: 'green',
        1: 'brain',
        2: 'shotgun',
        3: 'shotgun',
        4: 'feet',
        5: 'feet',
        6: 'brain',
      },
    },
  },
};

export const mockGameData: GameData = {
  hostId: '1',
  turnIndex: 1,
  playerTurn: '1',
  turns: [],
  winner: { id: '1', name: 'John' },
  response: 'success',
};
export const mockGame1: GameEntity = {
  _id: '1',
  gameName: 'Mock Game 1',
  gameStatus: 'Active',
  players: [mockPlayer1, mockPlayer2],
  gameData: mockGameData,
  chat: [{ playerId: '1', nickname: 'John', message: 'Hello everyone!' }],
};

export const mockGame2: GameEntity = {
  _id: '2',
  gameName: 'Mock Game 2',
  gameStatus: 'Lobby',
  players: [mockPlayer1],
  gameData: mockGameData,
  chat: [{ playerId: '1', nickname: 'John', message: 'Hello everyone!' }],
};

export const mockMessage: Message = {
  type: 'Start Game',
  game: mockGame1,
  player: mockPlayer1,
};

export const mockGameEntities: GameEntity[] = [mockGame1, mockGame2];
