import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  AddPlayerResponse,
  CreateGameResponse,
  Game,
  GameUpdateResponse,
  GenericResponse,
  RemovePlayerRequest,
  StartGameRequest,
  EndTurn,
  RollDiceRequest,
  WebsocketMessages,
} from '@ui-coe/demo/shared/util';

import { DiceService } from './dice.service';
import { UserInitGameDTO } from './dto/move.dto';
import { GameService } from './game.service';
import { UpdatePlayerModel, RemovePlayerModel, Chat } from './interfaces/game.interface';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService, private diceService: DiceService) {}

  // @Get('/negotiate')
  // async getToken(@Res() res): Promise<any> {
  //   const token = await this.gameService.initWebsocket();
  //   return res.status(HttpStatus.OK).json(token);
  // }

  @Post('/createGame')
  async createGame(
    @Res() res,
    @Body() userInitGameDTO: UserInitGameDTO
  ): Promise<CreateGameResponse> {
    const game = await this.gameService.createGame(userInitGameDTO);
    await this.gameService.sendGameUpdate(WebsocketMessages.CREATE_GAME, game);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Game has been successfully created', game, player: game.players[0] });
  }

  @Delete('/deleteGame')
  async deleteGame(@Res() res, @Query('gameId') gameId): Promise<void> {
    const game = await this.gameService.deleteGame(gameId);
    if (!game) throw new NotFoundException('Game does not exist');
    await this.gameService.sendGameUpdate(WebsocketMessages.DELETE_GAME, game);
    return res.status(HttpStatus.OK).json({ message: 'Game has been successfully deleted' });
  }

  @Get('/games')
  async getGamesInLobby(@Res() res): Promise<Game[]> {
    const games = await this.gameService.getGamesInLobby();
    return res.status(HttpStatus.OK).json(games);
  }

  @Get('/game')
  async getGame(@Res() res, @Query('gameId') gameId): Promise<Game> {
    const game = await this.gameService.getGame(gameId);
    return res.status(HttpStatus.OK).json(game);
  }

  @Put('joinGame')
  async joinGame(
    @Res() res,
    @Query('gameId') gameId,
    @Body() body: any
  ): Promise<AddPlayerResponse> {
    const game = await this.gameService.getGame(gameId);
    if (game.players.length >= 4) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Game is at capacity. No more than 4 players allowed in a game.',
      });
    }
    if (game.gameStatus !== 'Lobby') {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Game has already started. New players cannot be added to a game in progress.',
      });
    }

    const payload: UpdatePlayerModel = {
      nickname: body.nickname,
      game: game,
    };
    const response = await this.gameService.addPlayerToGame(gameId, payload);
    await this.gameService.sendGameUpdate(WebsocketMessages.PLAYER_UPDATE, response.updatedGame);
    return res.status(HttpStatus.OK).json({
      message: 'Player has been successfully added to the game',
      game: response.updatedGame,
      player: response.player,
    });
  }

  @Put('removePlayer')
  async removePlayer(
    @Res() res,
    @Query('gameId') gameId,
    @Body() body: RemovePlayerRequest
  ): Promise<GenericResponse> {
    const game = await this.gameService.getGame(gameId);
    if (!game.players.find(player => player.id === body.playerId)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Player not found.',
      });
    }
    if (game.players.length === 1) {
      await this.gameService.deleteGame(gameId);
    } else {
      const payload: RemovePlayerModel = {
        playerId: body.playerId,
        game: game,
      };
      const updatedGame = await this.gameService.removePlayer(gameId, payload);
      await this.gameService.sendGameUpdate(WebsocketMessages.PLAYER_UPDATE, updatedGame);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Player has been successfully removed from ' + game.gameName + '.',
    });
  }

  @Put('startGame')
  async startGame(
    @Res() res,
    @Query('gameId') gameId,
    @Body() payload: StartGameRequest
  ): Promise<GameUpdateResponse> {
    const isHost = await this.gameService.verifyHost(gameId, payload.playerId);
    if (!isHost) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Only the host can start the game.',
      });
    }
    const game = await this.gameService.startGame(gameId);
    await this.gameService.sendGameUpdate(WebsocketMessages.START_GAME, game);
    return res.status(HttpStatus.OK).json({
      message: 'Host has successfully started the game.',
      game,
    });
  }

  @Put('/chatMessage')
  async chatMessage(@Res() res, @Body() payload: Chat, @Query('gameId') gameId): Promise<Game> {
    const response = await this.gameService.sendChatMessage(gameId, payload);

    await this.gameService.sendGameUpdate(WebsocketMessages.CHAT, response);
    return res.status(HttpStatus.OK).json(response);
  }

  @Put('/rollDice')
  async diceRoll(@Res() res, @Body() payload: RollDiceRequest): Promise<Game> {
    const game = await this.gameService.getGame(payload.gameId);

    console.log('PlayerTurn', game.gameData.playerTurn);
    console.log('payload', payload.playerId);
    if (game.gameData.playerTurn == payload.playerId) {
      const response = await this.diceService.rollDice(payload.gameId, payload.playerId);
      const newGame = await this.gameService.getGame(payload.gameId);
      await this.gameService.sendGameUpdate(WebsocketMessages.DICE_ROLL, newGame);
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res.status(HttpStatus.FORBIDDEN).json('Not allowed to currently roll.');
    }
  }

  @Put('/endTurn')
  async endTurn(@Res() res, @Body() payload: EndTurn): Promise<Game> {
    const game = await this.gameService.getGame(payload.gameId);
    const response = await this.diceService.endPlayerTurn(
      payload.gameId,
      payload.playerId,
      'player ended turn',
      payload.score
    );
    await this.gameService.sendGameUpdate(WebsocketMessages.END_TURN, game);
    return res.status(HttpStatus.OK).json(response);
  }
}
