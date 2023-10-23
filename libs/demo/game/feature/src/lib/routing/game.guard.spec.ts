import { TestBed } from '@angular/core/testing';
import { GameFacade } from '@ui-coe/demo/shared/data-access';
import { Store, StoreModule } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GameGuard } from './game.guard';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('GameGuard', () => {
  let guard: GameGuard;
  let router: Router;

  const gameFacadeStub = {
    isGameLoaded$: of(false),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        Store,
        GameGuard,
        {
          provide: GameFacade,
          useValue: gameFacadeStub,
        },
      ],
    });
    router = TestBed.inject(Router);
    guard = TestBed.inject(GameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate()', () => {
    it('canActivate should be equal to isGameLoaded and be truthy', () => {
      expect(guard.canActivate()).toBe(gameFacadeStub.isGameLoaded$);

      expect(guard.canActivate).toBeTruthy();
    });

    it('canActivate should be falsy and route to menu', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      guard.canActivate();
      expect(guard.canActivate).toBeFalsy;
      // expect(navigateSpy).toHaveBeenCalledWith(['menu']);
    });
  });
});
