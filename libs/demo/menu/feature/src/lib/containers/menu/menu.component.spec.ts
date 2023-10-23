import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideMockStore } from '@ngrx/store/testing';
import { MenuComponent } from './menu.component';
import { GameFacade } from '@ui-coe/demo/shared/data-access';
import { Store } from '@ngrx/store';
import { AxToastService, SharedUiModule } from '@ui-coe/shared/ui';
import { of } from 'rxjs';
import { CreateGameComponent, JoinGameComponent, LobbyComponent } from '@ui-coe/demo/menu/ui';
import { gameStub, playerStub } from '@ui-coe/demo/shared/util';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let loader: HarnessLoader;
  let gameFacadeStub: GameFacade;
  let toastServiceStub: AxToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        SharedUiModule,
        RouterTestingModule,
      ],
      declarations: [MenuComponent, LobbyComponent, JoinGameComponent, CreateGameComponent],
      providers: [GameFacade, Store, provideMockStore({ initialState: { game: { ids: [] } } })],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.isGameLoaded$ = of(false);
    toastServiceStub = TestBed.inject(AxToastService);
    gameFacadeStub = TestBed.inject(GameFacade);
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('If we have an error message, check if a toast opens up', () => {
      const spy = jest.spyOn(toastServiceStub, 'open').mockImplementation();

      gameFacadeStub.error$ = of('testing');

      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('createGame()', () => {
    it('createGame function should call gameFacade createGame function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'createGame').mockImplementation();
      component.createGame();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getGames()', () => {
    it('getGames function should call gameFacade getGames function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'getGames').mockImplementation();
      component.getGames();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('joinGame()', () => {
    it('joinGame function should call gameFacade addPlayer function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'addPlayer').mockImplementation();
      component.selectedGame = gameStub[0];
      component.joinGame();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('startGame()', () => {
    beforeEach(() => {
      component.isGameLoaded$ = of(true);
      component.currentPlayer$ = of(playerStub);
      fixture.detectChanges();
    });

    it('StartGame function should call gameFacades startGame function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'startGame').mockImplementation();

      component.startGame();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('exitLobby()', () => {
    beforeEach(() => {
      component.isGameLoaded$ = of(true);
      component.currentPlayer$ = of(playerStub);
      fixture.detectChanges();
    });

    it('exitLobby function should call gameFacades removePlayer function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'removePlayer').mockImplementation();

      component.exitLobby();
      expect(spy).toHaveBeenCalled();
    });
  });

  // describe('buildTableColumnDef()', () => {
  //   beforeEach(() => {
  //     component.showJoinView = true;
  //     component.gamesList$ = of(gameStub);
  //     fixture.detectChanges();
  //   });
  //   it('should have all columns', async () => {
  //     component.buildTableColumnDef();

  //     const table = await loader.getHarness(MatTableHarness);
  //     const getHeaderColText = async colNum =>
  //       await (
  //         await Array.from((await table.getHeaderRows()).values())[0].getCells()
  //       )[colNum].getText();

  //     expect(await getHeaderColText(0)).toBe('');
  //     expect(await getHeaderColText(1)).toBe('Game Name');
  //     expect(await getHeaderColText(2)).toBe('Players');
  //   });
  // });

  // describe('buildTableData()', () => {
  //   beforeEach(() => {
  //     component.showJoinView = true;
  //     component.gamesList$ = of(gameStub);
  //     fixture.detectChanges();
  //   });
  //   it('Table cells should match the data passed into the table', async () => {
  //     component.buildTableData();

  //     const table = await loader.getHarness(MatTableHarness);
  //     const getTableCellText = async (rowNum: number, colNum: number) =>
  //       (await Array.from(await (await table.getRows()).values())[rowNum].getCellTextByIndex())[
  //         colNum
  //       ];

  //     expect(await getTableCellText(0, 0)).toBe('');
  //     expect(await getTableCellText(0, 1)).toBe('Unit Test');
  //     expect(await getTableCellText(0, 2)).toBe('1/ 4');
  //   });
  // });

  describe('tableSelectEvent()', () => {
    beforeEach(() => {
      component.showJoinView = true;
      component.gamesList$ = of(gameStub);
      fixture.detectChanges();
    });
    it('Should test if the data passed into tableSelectEvent is beingsame to selectedGame', () => {
      const dataEvent = {
        gameName: 'Unit Test',
        palyers: '1/ 4',
      };
      component.tableSelectEvent(dataEvent);

      expect(component.selectedGame).toBe(gameStub[0]);
    });
  });

  describe('sendChatMessage', () => {
    it('sendMessageForm should call gameFacade sendChatMessage ', () => {
      const spy = jest.spyOn(gameFacadeStub, 'sendChatMessage').mockImplementation();
      component.sendMessageForm.controls['message'].setValue('Unit Test');
      component.sendChatMessage();

      expect(spy).toBeCalled();
      expect(component.sendMessageForm.controls['message'].value).toBe(null);
    });
  });
});
