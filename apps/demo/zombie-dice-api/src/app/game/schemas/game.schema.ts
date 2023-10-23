import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
  gameName: String,
  gameStatus: String,
  players: Object,
  gameData: Object,
  chat: Object,
});
