import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameSchema } from './schemas/game.schema';
import { DiceService } from './dice.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
    HttpModule,
    ConfigModule.forRoot(),
  ],
  controllers: [GameController],
  providers: [GameService, DiceService],
})
export class GameModule {}
