/**
 * @file This file was generated by ax-lib generator.
 * @copyright AvidXchange Inc.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameGuard } from './game.guard';
import { GameBoardComponent } from '../containers/game-board/game-board.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [GameGuard], component: GameBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoGameFeatureRoutingModule {}