import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './components/lobby/lobby.component';
import { MatButtonModule } from '@angular/material/button';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedUiModule } from '@ui-coe/shared/ui';
import { ButtonComponent, InputComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedUiModule,
    ButtonComponent,
    InputComponent,
    SharedUiV2Module,
  ],
  declarations: [LobbyComponent, CreateGameComponent, JoinGameComponent],
  exports: [LobbyComponent, CreateGameComponent, JoinGameComponent],
})
export class DemoMenuUiModule {}
