export interface GameEntity {
  _id?: string;
  gameName: string;
  gameStatus: string;
  players: Player[];
  gameData: GameData;
  chat: Chat[];
}

export interface GenericResponse {
  message: string;
}
export interface CreateGameRequest {
  gameName: string;
  nickname: string;
}

export interface CreateGameResponse {
  message: string;
  player: GameEntity;
}

export interface Game {
  _id?: string;
  gameName: string;
  gameStatus: string;
  players: Player[];
  gameData: GameData;
  chat: Chat[];
}

export interface AddPlayerModel {
  updatedGame: Game;
  player: Player;
}

export interface UpdatePlayerRequest {
  nickname?: string;
  gameId: string;
}

export interface AddPlayerResponse {
  message: string;
  game: Game;
  player: Player;
}

export interface RemovePlayerRequest {
  playerId: string;
}

export interface RemovePlayerModel {
  playerId: string;
  gameId: string;
}

export interface StartGameRequest {
  playerId: string;
  gameId: string;
}

export interface GameUpdateResponse {
  message: string;
  game: string;
}
export interface Player {
  nickname: string;
  id: string;
  isHost: boolean;
  score: number;
  brainsRolled: number;
  shotgunsRolled: number;
  initialRoll: boolean;
  diceRolled: RollDiceResponse;
}

export interface Chat {
  playerId: string;
  nickname: string;
  message: string;
}

export interface GameData {
  hostId: string;
  turnIndex: number;
  playerTurn: string;
  turns: any[];
  winner: GameWinner;
  response: string;
}

export interface GameWinner {
  id: string;
  name: string;
}

export interface StartGameModel {
  gameId: string;
  playerId: string;
}

export interface EndTurnRequest {
  player: Player;
  score: number;
}

export interface RollDiceRequest {
  gameId: string;
  playerId: string;
}

export interface EndTurn {
  gameId: string;
  playerId: string;
  score?: number;
}

export interface ChatMessageRequest {
  playerId: string;
  nickname: string;
  message: string;
}

export interface SessionPlayerModel {
  playerId: string;
  playerName: string;
  gameId: string;
}

export interface EndTurnResponse {
  message: string;
}

export interface RollDiceResponse {
  firstDie: DieState;
  secondDie: DieState;
  thirdDie: DieState;
}
export interface DieState {
  diceRoll: string;
  diceValue: string;
  die: Die;
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
export interface Message {
  type: string;
  game: Game;
  player?: Player;
}
