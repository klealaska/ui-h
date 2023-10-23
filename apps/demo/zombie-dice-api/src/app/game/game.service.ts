import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { WebPubSubServiceClient, WebPubSubGroup } from '@azure/web-pubsub';
import {
  UpdatePlayerModel,
  Game,
  Player,
  RemovePlayerModel,
  RemovePlayerDTO,
  Chat,
} from './interfaces/game.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDTO, UserInitGameDTO } from './dto/move.dto';
import { v4 as uuidv4 } from 'uuid';
import { DiceService } from './dice.service';
import { AddPlayerModel } from '@ui-coe/demo/shared/util';
import { FullOperationResponse } from '@azure/core-client';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameService {
  private serviceClient: WebPubSubServiceClient;
  private gameGroup: WebPubSubGroup;

  constructor(
    @InjectModel('Game') private readonly GameModel: Model<Game>,
    private diceSvc: DiceService,
    private http: HttpService,
    private readonly configService: ConfigService
  ) {}

  async sendGameUpdate(type: string, game: Game) {
    const message = {
      type: type,
      game: game,
    };
    const url = this.configService.get<string>('PUBSUB_FUNCTION_URL');
    await this.http.post(url, message).toPromise();
  }

  async createGame(userInitGameDTO: UserInitGameDTO): Promise<Game> {
    const createGameDTO: CreateGameDTO = await this.initGameData(userInitGameDTO);
    const newGame = await new this.GameModel(createGameDTO);
    return newGame.save();
  }

  async deleteGame(gameId: string): Promise<any> {
    const game = await this.GameModel.findByIdAndDelete(gameId);
    return game;
  }

  async getGamesInLobby(): Promise<Game[]> {
    const games = await this.GameModel.find().exec();
    return games.filter(game => game.gameStatus === 'Lobby');
  }

  async getGame(gameId: string): Promise<Game> {
    const game = await this.GameModel.findById(gameId);
    console.log(game);
    return game;
  }

  async addPlayerToGame(gameId: string, payload: UpdatePlayerModel): Promise<any> {
    const updateGameDTO: CreateGameDTO = payload.game;
    const newPlayer: Player = {
      nickname: payload.nickname,
      id: uuidv4(),
      isHost: false,
      score: 0,
      brainsRolled: 0,
      shotgunsRolled: 0,
      diceRolled: undefined,
      initialRoll: true,
    };

    updateGameDTO.players.push(newPlayer);
    const updatedGame = await this.GameModel.findByIdAndUpdate(gameId, updateGameDTO, {
      new: true,
    });
    return { updatedGame: updatedGame, player: newPlayer };
  }

  async removePlayer(gameId: string, payload: RemovePlayerModel): Promise<Game> {
    const updateGameDTO: RemovePlayerDTO = payload.game;
    updateGameDTO.players = this.removeItem(updateGameDTO.players, payload.playerId);
    const updatedGame = await this.GameModel.findByIdAndUpdate(gameId, updateGameDTO, {
      new: true,
    });
    return updatedGame;
  }

  async startGame(gameId: string) {
    const updatedGame = await this.GameModel.findByIdAndUpdate(
      gameId,
      { gameStatus: 'Active' },
      { new: true }
    );
    return updatedGame;
  }

  async endTurn(gameId: string, payload: any) {
    let game: Game = await this.GameModel.findById(gameId);
    const player = game.players.find(player => player.id === payload.player.id);
    player.score += payload.score;
    game.players[game.players.indexOf(player)] = player;

    game = this.calculateNextTurn(game);

    const updatedGame = await this.GameModel.findByIdAndUpdate(gameId, game, { new: true });
    return updatedGame;
  }

  async sendChatMessage(gameId: string, payload: Chat): Promise<Game> {
    const game: Game = await this.GameModel.findById(gameId);
    const chat: Chat = {
      playerId: payload.playerId,
      nickname: payload.nickname,
      message: payload.message,
    };

    game.chat.push(chat);
    const updatedGame = await this.GameModel.findByIdAndUpdate(gameId, game, {
      new: true,
    });
    return updatedGame;
  }

  private async initGameData(payload: UserInitGameDTO) {
    const playerId: string = uuidv4();
    const createGameDTO: CreateGameDTO = {
      gameName: payload.gameName,
      gameStatus: 'Lobby',
      players: [
        {
          nickname: payload.nickname,
          id: playerId,
          isHost: true,
          score: 0,
          brainsRolled: 0,
          shotgunsRolled: 0,
          diceRolled: undefined,
          initialRoll: true,
        },
      ],
      gameData: {
        hostId: playerId,
        turnIndex: 0,
        playerTurn: playerId,
        turns: [],
        winner: {
          id: '',
          name: '',
        },
        dicePool: await this.diceSvc.createDicePool(),
        response: '',
      },
      chat: [],
    };
    return createGameDTO;
  }

  private removeItem(players: Player[], playerId: string): Player[] {
    const player = players.find(player => player.id === playerId);
    const index = players.indexOf(player);
    if (index > -1) {
      players.splice(index, 1);
    }
    // If the Host was removed, set another player as Host
    if (player.isHost) {
      players[0].isHost = true;
    }
    return players;
  }

  private calculateNextTurn(game: Game): Game {
    if (game.gameData.turnIndex === game.players.length - 1) {
      game.gameData.turnIndex = 0;
    } else {
      game.gameData.turnIndex += 1;
    }
    game.gameData.playerTurn = game.players[game.gameData.turnIndex].id;
    return game;
  }

  async verifyHost(gameId: string, playerId: string) {
    const game = await this.GameModel.findById(gameId);
    const host = game.players.find(player => player.isHost);
    console.log(host.id + ' ' + playerId);
    return host.id === playerId;
  }
}
