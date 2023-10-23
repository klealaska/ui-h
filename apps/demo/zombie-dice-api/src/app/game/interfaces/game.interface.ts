import { Document } from 'mongoose';
import { CreateGameDTO } from '../dto/move.dto';

export interface Game extends Document {
  readonly gameName: string;
  readonly gameStatus: string;
  readonly players: Player[];
  readonly gameData: GameData;
  readonly chat: Chat[];
}

export interface Player {
  nickname: string;
  id: string;
  isHost: boolean;
  score: number;
  brainsRolled: number;
  shotgunsRolled: number;
  diceRolled: DiceRolled;
  initialRoll: boolean;
}

export interface GameData {
  hostId: string;
  turnIndex: number;
  playerTurn: string;
  turns: any[];
  winner: GameWinner;
  dicePool: Array<Die>;
  response: string;
}

export interface Chat {
  playerId: string;
  nickname: string;
  message: string;
}

export interface UpdatePlayerModel {
  nickname?: string;
  game: CreateGameDTO;
}

export interface RemovePlayerDTO {
  readonly gameName: string;
  readonly gameStatus: string;
  players: Player[];
  readonly gameData: GameData;
}

export interface RemovePlayerModel {
  playerId: string;
  game: Game;
}

export interface GameWinner {
  id: string;
  name: string;
}

export interface Die {
  color: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
}

export interface DiceRolled {
  firstDie: DieState;
  secondDie: DieState;
  thirdDie: DieState;
}

export interface DieState {
  diceRoll: string;
  diceValue: string;
  die: Die;
}
