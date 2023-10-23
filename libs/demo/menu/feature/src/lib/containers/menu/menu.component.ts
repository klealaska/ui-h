import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Game,
  UpdatePlayerRequest,
  Player,
  CreateGameRequest,
  WebsocketMessages,
} from '@ui-coe/demo/shared/util';
import { GameFacade } from '@ui-coe/demo/shared/data-access';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnDef, CellDef, AxToastService } from '@ui-coe/shared/ui';
import { TableDataType } from '../../models/game.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'demo-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  // * 'stop$' is used to close all subscriptions when component is destroyed
  private stop$: Subject<void> = new Subject<void>();

  chatExpanded = true;

  sendMessageForm: UntypedFormGroup;
  createGameForm: UntypedFormGroup;
  joinGameForm: UntypedFormGroup;
  gamesList$: Observable<Game[]> = this.gameFacade.gamesInLobby$;
  currentPlayer$: Observable<Player> = this.gameFacade.currentPlayer$;
  currentGame$: Observable<Game> = this.gameFacade.loadedGame$;
  isGameLoaded$: Observable<boolean> = this.gameFacade.isGameLoaded$;

  selectedGame: Game;
  dataSource: MatTableDataSource<TableDataType>;
  tableDef: TableColumnDef[];

  showCreateView = false;
  showJoinView = false;

  constructor(
    private gameFacade: GameFacade,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: AxToastService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.gameFacade.getWebsocketToken();
    this.buildForms();
    this.getGames();

    this.buildTableData();
    this.tableDef = this.buildTableColumnDef();

    this.gameFacade.webSocketMessage$
      .pipe(
        takeUntil(this.stop$),
        filter(res => res?.type === WebsocketMessages.START_GAME)
      )
      .subscribe(res => {
        this.router.navigate(['../game'], { relativeTo: this.route });
      });

    this.gameFacade.error$
      .pipe(
        takeUntil(this.stop$),
        filter(res => !!res)
      )
      .subscribe(res => {
        this.toastService.open('Error: ' + res.message, 'error');
      });
  }

  private buildForms(): void {
    this.createGameForm = this.formBuilder.group({
      gameName: ['', Validators.compose([Validators.required])],
      nickname: ['', Validators.compose([Validators.required])],
    });
    this.joinGameForm = this.formBuilder.group({
      nickname: ['', Validators.compose([Validators.required])],
    });
    this.sendMessageForm = this.formBuilder.group({
      message: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * createGame()
   * * Triggers action to create a new game session.
   *
   */
  createGame(): void {
    const createGame: CreateGameRequest = {
      gameName: this.createGameForm.controls['gameName'].value,
      nickname: this.createGameForm.controls['nickname'].value,
    };
    this.gameFacade.createGame(createGame);
  }

  /**
   * getGames()
   * * Triggers action to fetch all games in lobby.
   *
   */
  getGames(): void {
    this.gameFacade.getGames();
  }

  /**
   * joinGame()
   * * Triggers action to add player to selected game session.
   *
   */
  joinGame(): void {
    const payload: UpdatePlayerRequest = {
      nickname: this.joinGameForm.controls['nickname'].value,
      gameId: this.selectedGame._id,
    };
    this.gameFacade.addPlayer(payload);
  }

  /**
   * startGame()
   * * Triggers action to start a game session. This changes the `gameStatus` from 'lobby' to 'active'.
   * * Only the game host can start the game. If successful, user will be routed to '/game' route.
   *
   */
  startGame(): void {
    this.gameFacade.startGame();
  }

  /**
   * exitLobby()
   * * Triggers action to remove current player from game lobby.
   *
   */
  exitLobby(): void {
    this.gameFacade.removePlayer();
  }

  /**
   * tableSelectEvent()
   * * Determines which game session was selected from the game table.
   * * Assigns the selected game to 'selectedGame'.
   *
   */
  tableSelectEvent(data: any): void {
    console.log('working');
    this.gamesList$.pipe(take(1)).subscribe(games => {
      this.selectedGame = games.find(game => game.gameName === data.gameName);
    });
  }

  ngOnDestroy(): void {
    // Close all remaining subscriptions
    this.stop$.next();
    this.stop$.complete();
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

  backBtn(): void {
    this.showCreateView = false;
    this.showJoinView = false;
  }

  buildTableColumnDef() {
    const columnDef: string[] = ['singleSelect', 'gameName', 'players'];
    const headerCellDef: string[] = ['', 'Game Name', 'Players'];
    const cellDef: CellDef[] = [
      { type: 'text', value: '' },
      { type: 'text', value: (element: TableDataType) => element.gameName },
      { type: 'text', value: (element: TableDataType) => element.players },
    ];
    return columnDef.map((columnDef, index) => {
      return {
        columnDef: columnDef,
        headerCellDef: headerCellDef[index],
        cellDef: cellDef[index],
      };
    });
  }

  buildTableData(): void {
    this.gamesList$.subscribe(games => {
      const gameTable = [];
      games.forEach(game => {
        // const players = [];
        // game.players.forEach(player => players.push({ userName: player.nickname }));
        const gameData = {
          gameName: game.gameName,
          players: String(game.players.length) + '/ 4',
          // nestedTableColumnDefs: this.buildNestedTableColumnDef(),
          // nestedTableDatasource: players,
        };
        gameTable.push(gameData);
      });
      this.dataSource = new MatTableDataSource(gameTable);
    });
  }
}
