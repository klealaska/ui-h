import { Player, GameData, Chat } from '../interfaces/game.interface';

export class BroadcastMoveDTO {
  readonly move: string;
  readonly player: string;
}

export class CreateGameDTO {
  readonly gameName: string;
  readonly gameStatus: string;
  readonly players: Player[];
  readonly gameData: GameData;
  readonly chat: Chat[];
}

export class UserInitGameDTO {
  readonly gameName: string;
  readonly nickname: string;
}

export class gameState {
  readonly gameData: GameData;
}

export class playerDTO {
  readonly players: Player[];
}
