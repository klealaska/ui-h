import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GameService } from './services/game.service';
import * as fromGame from './+state/game.reducer';
import { GameEffects } from './+state/game.effects';
import { GameFacade } from './+state/game.facade';
import { WebsocketService } from './services/websocket.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromGame.GAME_FEATURE_KEY, fromGame.reducer),
    EffectsModule.forFeature([GameEffects]),
  ],
  providers: [GameService, GameFacade, WebsocketService],
})
export class DemoSharedDataAccessModule {}
