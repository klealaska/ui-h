import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameWinner } from '@ui-coe/demo/shared/util';

@Component({
  selector: 'demo-winner-screen',
  templateUrl: './winner-screen.component.html',
  styleUrls: ['./winner-screen.component.scss'],
})
export class WinnerScreenComponent {
  @Input() winner!: GameWinner;
  @Output() buttonEvent = new EventEmitter();
}
