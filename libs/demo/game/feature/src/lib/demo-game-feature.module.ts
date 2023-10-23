import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GameBoardComponent } from './containers/game-board/game-board.component';
import { DemoGameUiModule } from '@ui-coe/demo/game/ui';
import { DemoSharedUiModule } from '@ui-coe/demo/shared/ui';
import { GameGuard } from './routing/game.guard';
import { DemoSharedDataAccessModule } from '@ui-coe/demo/shared/data-access';
import { DemoGameFeatureRoutingModule } from './routing/demo-game-feature-routing.module';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DemoGameFeatureRoutingModule,
    DemoSharedUiModule,
    DemoGameUiModule,
    DemoSharedDataAccessModule,
    ButtonComponent,
  ],
  declarations: [GameBoardComponent],
  exports: [GameBoardComponent],
  providers: [GameGuard],
})
export class DemoGameFeatureModule {}
