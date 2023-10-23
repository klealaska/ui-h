import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { DieComponent, WinnerScreenComponent } from '@ui-coe/demo/game/ui';
import { GameFacade } from '@ui-coe/demo/shared/data-access';
import { ChatboxComponent } from '@ui-coe/demo/shared/ui';
import { AxToastService, SharedUiModule } from '@ui-coe/shared/ui';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { GameBoardComponent } from './game-board.component';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let router: Router;
  let gameFacadeStub: GameFacade;
  let toastServiceStub: AxToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedUiModule,
      ],
      declarations: [
        GameBoardComponent,
        WinnerScreenComponent,
        MockComponent(DieComponent),
        MockComponent(ChatboxComponent),
      ],
      providers: [GameFacade, ConfigService, Store],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    toastServiceStub = TestBed.inject(AxToastService);
    gameFacadeStub = TestBed.inject(GameFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('test', () => {
      const spy = jest.spyOn(toastServiceStub, 'open').mockImplementation();

      component.response$ = of('Testing');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('rollDice', () => {
    it('rollDice function should call gameFacade rollDice function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'rollDice').mockImplementation();
      component.rollDice();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('endTurn', () => {
    it('endTurn function should call gameFacade endTurn function', () => {
      const spy = jest.spyOn(gameFacadeStub, 'endTurn').mockImplementation();
      component.endTurn();

      expect(spy).toHaveBeenCalled();
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

  describe('exitGame', () => {
    beforeEach(() => {
      component.winner$ = of({ id: '1', name: 'testing' });
      fixture.detectChanges();
    });
    it('should call exitGame function', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const exitGameBtn = fixture.nativeElement.querySelector('[data-test="exit-button"]');
      exitGameBtn.click();

      expect(navigateSpy).toHaveBeenCalledWith(['/menu']);
    });
  });
});
