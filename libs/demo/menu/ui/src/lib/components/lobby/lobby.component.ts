import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Game, Player } from '@ui-coe/demo/shared/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  @Input() currentGame$: Observable<Game>;
  @Input() currentPlayer$: Observable<Player>;
  @Output() exitLobbyEvent = new EventEmitter<void>();
  @Output() startGameEvent = new EventEmitter<void>();
}
