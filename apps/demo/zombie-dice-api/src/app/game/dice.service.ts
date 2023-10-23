import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Die, DieState, Game, DiceRolled } from './interfaces/game.interface';

@Injectable()
export class DiceService {
  constructor(@InjectModel('Game') private readonly GameModel: Model<Game>) {}

  async rollDice(gameId: string, playerId: string) {
    const initialRoll = await this.getInitialRollValue(gameId, playerId);

    return initialRoll
      ? await this.initialRoll(gameId, playerId)
      : await this.subsequentRoll(gameId, playerId);
  }

  async initialRoll(gameId: string, playerId: string) {
    const randomDiceSelection = await this.randomDiceSelection(3, gameId);

    await this.diceRoll(gameId, playerId, randomDiceSelection);
    await this.updateInitialRoll(gameId, playerId);
    await this.clearResponse(gameId);

    return this.getCurrentPlayer(gameId, playerId);
  }

  async subsequentRoll(gameId: string, playerId: string) {
    const player = await this.getCurrentPlayer(gameId, playerId);
    const currentPlayersDice = [
      player.diceRolled.firstDie,
      player.diceRolled.secondDie,
      player.diceRolled.thirdDie,
    ];
    await this.removeDiceFromPool(gameId, currentPlayersDice);

    const diceKept = currentPlayersDice.filter(die => {
      return die.diceValue === 'footsteps';
    });
    const numberOfDiceToGrab = 3 - diceKept.length;
    const latestDicePool = await this.getDicePool(gameId);

    return latestDicePool.length > 0
      ? await this.determinePlayerRollEligibility(gameId, playerId, numberOfDiceToGrab, diceKept)
      : await this.endPlayerTurn(
          gameId,
          playerId,
          'Not enough dice left in the pool to roll again. Sorry!'
        );
  }

  async determinePlayerRollEligibility(
    gameId: string,
    playerId: string,
    numberOfDiceToGrab: number,
    diceKept: DieState[]
  ) {
    return numberOfDiceToGrab > 0
      ? await this.determineIfThereAreEnoughDiceToRoll(
          gameId,
          playerId,
          numberOfDiceToGrab,
          diceKept
        )
      : await this.playerRollsPersistingDice(gameId, playerId); // only happens when a player rolls 3 'footsteps'
  }

  async determineIfThereAreEnoughDiceToRoll(
    gameId: string,
    playerId: string,
    numberOfDiceToGrab: number,
    diceKept: DieState[]
  ) {
    const randomDiceSelection = await this.randomDiceSelection(numberOfDiceToGrab, gameId);
    const diceToRoll = randomDiceSelection.concat(diceKept.map(obj => obj.die));

    if (diceToRoll.length != 3) {
      return await this.endPlayerTurn(
        gameId,
        playerId,
        'You do not have enough dice to roll again!'
      );
    } else if (diceToRoll.length == 3) {
      return await this.rollDiceAndReturnOutcome(gameId, playerId, diceToRoll);
    } else {
      return await this.endPlayerTurn(
        gameId,
        playerId,
        'You do not have enough dice to roll again!'
      );
    }
  }

  async playerRollsPersistingDice(gameId: string, playerId: string) {
    const randomDiceSelection = await this.randomDiceSelection(3, gameId);

    return randomDiceSelection.length !== 3
      ? await this.endPlayerTurn(gameId, playerId, 'You do not have enough dice to roll again!')
      : await this.rollDiceAndReturnOutcome(gameId, playerId, randomDiceSelection);
  }

  async rollDiceAndReturnOutcome(gameId: string, playerId: string, randomDiceSelection: Die[]) {
    await this.diceRoll(gameId, playerId, randomDiceSelection);
    return this.getCurrentPlayer(gameId, playerId);
  }

  async diceRoll(gameId: string, playerId: string, dice: Die[]) {
    const game = await this.GameModel.findById(gameId);
    const allPlayers = game.players;
    const playerIndex = allPlayers.findIndex(player => player.id === playerId);
    const firstDie = Object.keys(dice[0]);
    const secondDie = Object.keys(dice[1]);
    const thirdDie = Object.keys(dice[2]);

    // Removes 'color' property from Die object.
    firstDie.splice(6);
    secondDie.splice(6);
    thirdDie.splice(6);

    const firstDiceRoll = firstDie[Math.floor(Math.random() * firstDie.length)];
    const firstDiceValue = dice[0][firstDiceRoll];

    const secondDiceRoll = secondDie[Math.floor(Math.random() * secondDie.length)];
    const secondDiceValue = dice[1][secondDiceRoll];

    const thirdDiceRoll = thirdDie[Math.floor(Math.random() * thirdDie.length)];
    const thirdDiceValue = dice[2][thirdDiceRoll];

    const diceRolled = {
      firstDie: {
        diceRoll: firstDiceRoll,
        diceValue: firstDiceValue,
        die: dice[0],
      },
      secondDie: {
        diceRoll: secondDiceRoll,
        diceValue: secondDiceValue,
        die: dice[1],
      },
      thirdDie: {
        diceRoll: thirdDiceRoll,
        diceValue: thirdDiceValue,
        die: dice[2],
      },
    };
    const diceValues = [
      diceRolled.firstDie.diceValue,
      diceRolled.secondDie.diceValue,
      diceRolled.thirdDie.diceValue,
    ];
    const brainsRolled = diceValues.filter(die => die === 'brain').length;
    const shotgunsRolled = diceValues.filter(die => die === 'shotgun').length;

    if (shotgunsRolled == 3) {
      await this.endPlayerTurn(gameId, playerId, 'Shotgunned!', 0);
    } else if (shotgunsRolled + allPlayers[playerIndex].shotgunsRolled >= 3) {
      await this.endPlayerTurn(gameId, playerId, 'Shotgunned!', 0);
    } else {
      await this.updateDiceRolled(gameId, diceRolled, playerId, brainsRolled, shotgunsRolled);
    }
  }

  async randomDiceSelection(numberOfDice: number, gameId: string) {
    const dicePool = await this.getDicePool(gameId);
    return dicePool.sort(() => 0.5 - Math.random()).slice(0, numberOfDice);
  }

  async removeDiceFromPool(gameId: string, dice: DieState[]) {
    const dicePool = await this.getDicePool(gameId);
    const diceToBeRemoved = dice.filter(die => {
      return die.diceValue !== 'footsteps';
    });
    const colorOfDiceToRemove = diceToBeRemoved.map(dice => dice.die.color);

    if (colorOfDiceToRemove.length !== 0) {
      for (let i = 0; i < colorOfDiceToRemove.length; i++) {
        const index = dicePool.findIndex(die => {
          return die.color === colorOfDiceToRemove[i];
        });
        dicePool.splice(index, 1);
      }
    }

    await this.updateDicePool(gameId, dicePool);
  }

  async getInitialRollValue(gameId: string, playerId: string): Promise<boolean> {
    const game = await this.GameModel.findById(gameId);
    const player = game.players.find(players => {
      return players.id === playerId;
    });

    return player.initialRoll;
  }

  async updateInitialRoll(gameId: string, playerId: string) {
    const game = await this.GameModel.findById(gameId);
    const allPlayers = game.players;
    const playerIndex = allPlayers.findIndex(player => player.id === playerId);

    allPlayers[playerIndex].initialRoll = false;

    await this.GameModel.findByIdAndUpdate(
      gameId,
      { players: allPlayers },
      {
        new: true,
      }
    );
  }

  async updateDiceRolled(
    gameId: string,
    diceRolled: DiceRolled,
    playerId: string,
    brainsRolled: number,
    shotgunsRolled: number
  ) {
    const game = await this.GameModel.findById(gameId);
    const allPlayers = game.players;
    const playerIndex = allPlayers.findIndex(player => player.id === playerId);

    allPlayers[playerIndex].brainsRolled += brainsRolled;
    allPlayers[playerIndex].shotgunsRolled += shotgunsRolled;
    allPlayers[playerIndex].diceRolled = diceRolled;

    await this.GameModel.findByIdAndUpdate(gameId, { players: allPlayers }, { new: true });
  }

  async endPlayerTurn(gameId: string, playerId: string, message?: string, score?: number) {
    const game = await this.GameModel.findById(gameId);
    const allPlayers = game.players;
    const playerIndex = allPlayers.findIndex(player => player.id === playerId);

    allPlayers[playerIndex].score += score;
    allPlayers[playerIndex].brainsRolled = 0;
    allPlayers[playerIndex].shotgunsRolled = 0;
    allPlayers[playerIndex].diceRolled = null;
    allPlayers[playerIndex].initialRoll = true;

    if (allPlayers[playerIndex].score >= 13) {
      return await this.assignWinner(gameId, playerId);
    } else {
      await this.updateTurnIndex(gameId);
      await this.createFreshDicePool(gameId);
      await this.GameModel.findByIdAndUpdate(gameId, { players: allPlayers }, { new: true });
      await this.updateResponse(gameId, message);

      return game;
    }
  }

  async updateTurnIndex(gameId: string) {
    const game = await this.GameModel.findById(gameId);
    const totalPlayers = game.players.length;
    let turnIndex = game.gameData.turnIndex;

    turnIndex < totalPlayers - 1 ? turnIndex++ : (turnIndex = 0);

    const updateGameData = {
      hostId: game.gameData.hostId,
      turnIndex: turnIndex,
      playerTurn: game.players[turnIndex].id,
      turns: game.gameData.turns,
      winner: game.gameData.winner,
      dicePool: game.gameData.dicePool,
      response: game.gameData.response,
    };

    await game.updateOne({ gameData: updateGameData, updateGameData });
  }

  async createDicePool(): Promise<Die[]> {
    const greenDie = {
      color: 'green',
      1: 'brain',
      2: 'brain',
      3: 'brain',
      4: 'shotgun',
      5: 'footsteps',
      6: 'footsteps',
    };
    const yellowDie = {
      color: 'yellow',
      1: 'brain',
      2: 'brain',
      3: 'shotgun',
      4: 'shotgun',
      5: 'footsteps',
      6: 'footsteps',
    };
    const redDie = {
      color: 'red',
      1: 'brain',
      2: 'shotgun',
      3: 'shotgun',
      4: 'shotgun',
      5: 'footsteps',
      6: 'footsteps',
    };

    return [
      greenDie,
      greenDie,
      greenDie,
      greenDie,
      greenDie,
      greenDie,
      yellowDie,
      yellowDie,
      yellowDie,
      yellowDie,
      redDie,
      redDie,
      redDie,
    ];
  }

  async updateDicePool(gameId: string, newDicePool: Die[]) {
    const game = await this.GameModel.findById(gameId);
    const updateDicePool = {
      hostId: game.gameData.hostId,
      turnIndex: game.gameData.turnIndex,
      playerTurn: game.gameData.playerTurn,
      turns: game.gameData.turns,
      winner: game.gameData.winner,
      dicePool: newDicePool,
      response: game.gameData.response,
    };

    await game.updateOne({ gameData: updateDicePool, updateDicePool });
  }

  async assignWinner(gameId: string, playerId: string) {
    const game = await this.GameModel.findById(gameId);
    const gameData = game.gameData;
    const allPlayers = game.players;
    const playerIndex = allPlayers.findIndex(player => player.id === playerId);

    gameData.winner.id = allPlayers[playerIndex].id;
    gameData.winner.name = allPlayers[playerIndex].nickname;

    await this.GameModel.findByIdAndUpdate(gameId, { gameData: gameData }, { new: true });

    return game;
  }

  async clearResponse(gameId: string) {
    const game = await this.GameModel.findById(gameId);
    const gameData = game.gameData;

    gameData.response = '';

    await this.GameModel.findByIdAndUpdate(gameId, { gameData: gameData }, { new: true });
  }

  async updateResponse(gameId: string, response: string) {
    const game = await this.GameModel.findById(gameId);
    const gameData = game.gameData;

    gameData.response = response;

    await this.GameModel.findByIdAndUpdate(gameId, { gameData: gameData }, { new: true });
  }

  async createFreshDicePool(gameId: string) {
    const freshDicePool = await this.createDicePool();

    await this.updateDicePool(gameId, freshDicePool);
  }

  async getDicePool(gameId: string): Promise<Die[]> {
    const game = await this.GameModel.findById(gameId);
    return game.gameData.dicePool;
  }

  async getCurrentPlayer(gameId: string, playerId: string) {
    const game = await this.GameModel.findById(gameId);
    const player = game.players.find(players => {
      return players.id === playerId;
    });

    return player;
  }
}
