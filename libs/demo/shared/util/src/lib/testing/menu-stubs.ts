import { Player, Game } from '../models/game.models';

export const playerStub: Player = {
  nickname: 'Test',
  id: '1',
  isHost: true,
  score: 0,
  brainsRolled: 0,
  shotgunsRolled: 0,
  initialRoll: true,
  diceRolled: undefined,
};

export const gameStub: Array<Game> = [
  {
    _id: '1',
    gameName: 'Unit Test',
    gameStatus: '',
    players: [
      {
        nickname: 'Test',
        id: '1',
        isHost: true,
        score: 0,
        brainsRolled: 0,
        shotgunsRolled: 0,
        initialRoll: true,
        diceRolled: undefined,
      },
    ],
    gameData: {
      hostId: '',
      turnIndex: 1,
      playerTurn: '',
      turns: [],
      winner: {
        id: '',
        name: '',
      },
      response: '',
    },
    chat: [],
  },
];
