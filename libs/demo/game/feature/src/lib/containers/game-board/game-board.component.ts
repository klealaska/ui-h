import { Component, OnInit } from '@angular/core';
import { Player, Game, GameWinner } from '@ui-coe/demo/shared/util';
import { GameFacade } from '@ui-coe/demo/shared/data-access';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AxToastService } from '@ui-coe/shared/ui';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfigService, ShellConfigService } from '@ui-coe/shared/util/services';

@Component({
  selector: 'demo-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
  sendMessageForm: UntypedFormGroup;
  chatExpanded = true;
  playerTurn$: Observable<Player> = this.gameFacade.playerTurn$;
  isPlayerTurn$: Observable<boolean> = this.gameFacade.isPlayerTurn$;
  winner$: Observable<GameWinner> = this.gameFacade.winner$;
  response$: Observable<string> = this.gameFacade.response$;
  currentGame$: Observable<Game> = this.gameFacade.loadedGame$;
  currentPlayer$: Observable<Player> = this.gameFacade.currentPlayer$;

  // TODO: make MFE key dynamic
  private assetsPath: string = this.shellConfigService.getMfeManifest('demo-zombie-dice-spa');

  constructor(
    private gameFacade: GameFacade,
    private toastService: AxToastService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private shellConfigService: ShellConfigService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    // TODO: Abstract this to the data access library
    this.response$
      .pipe(filter(res => !!res))
      .subscribe(res => this.toastService.open('Info: ' + res, 'info'));
  }

  private buildForm(): void {
    this.sendMessageForm = this.formBuilder.group({
      message: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * rollDice()
   * * Triggers action to roll the game dice. Disabled if it is not the current player's turn.
   *
   */
  rollDice(): void {
    this.gameFacade.rollDice();
  }

  /**
   * endTurn()
   * * Triggers action to end the player's turn. Disabled if it is not the current player's turn.
   *
   */
  endTurn(): void {
    this.gameFacade.endTurn();
  }

  /**
   * exitGame()
   * * Triggers action to remove current player from the game. Routes user back to '/menu' page.
   *
   */
  exitGame(): void {
    this.router.navigate(['/menu']);
  }

  /**
   * sendChatMessage()
   * * Triggers action to send chat message to all game players.
   *
   */
  sendChatMessage(): void {
    if (this.sendMessageForm.controls['message'].value != null) {
      this.gameFacade.sendChatMessage(this.sendMessageForm.controls['message'].value);
      this.sendMessageForm.reset();
    }
  }

  getImg(value: string, color: string): string {
    return value && color
      ? `${this.assetsPath}/assets/images/${value}${color}.png`
      : `${this.assetsPath}/assets/images/empty.png`;
  }
}
