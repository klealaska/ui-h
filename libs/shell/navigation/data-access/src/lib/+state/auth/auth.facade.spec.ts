import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { AuthEffects } from './auth.effects';
import { AuthFacade } from './auth.facade';
import { AuthEntity } from './auth.models';
import { AUTH_FEATURE_KEY, AuthState, initialAuthState, authReducer } from './auth.reducer';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { AppName } from '../../enums';
import { HttpClientTestingModule } from '@angular/common/http/testing';

interface TestSchema {
  auth: AuthState;
}

const mockOktaAuthService = {
  authState$: of({ isAuthenticated: false }),
};

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let store: Store<TestSchema>;
  const createAuthEntity = (id: string, name = ''): AuthEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          HttpClientTestingModule,
          StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
          EffectsModule.forFeature([AuthEffects]),
        ],
        providers: [AuthFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(AuthFacade);
    });

    it('initAuth() should set loaded$ to false', async () => {
      const isLoaded = cold('a', { a: false });
      facade.init('test', AppName.Shell);
      expect(facade.loaded$).toBeObservable(isLoaded);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    // it('loadAll() should return empty list with loaded == true', async () => {
    //   // let list = await readFirst(facade.allAuth$);
    //   // let isLoaded = await readFirst(facade.loaded$);

    //   // expect(list.length).toBe(0);
    //   // expect(isLoaded).toBe(false);

    //   // facade.init();

    //   // list = await readFirst(facade.allAuth$);
    //   // isLoaded = await readFirst(facade.loaded$);

    //   // expect(list.length).toBe(0);
    //   // expect(isLoaded).toBe(true);
    //   expect(facade.isAuthenticated$).toEqual(of(false));
    // });

    /**
     * Use `loadAuthSuccess` to manually update list
     */
    // it('allAuth$ should return the loaded list; and loaded flag == true', async () => {
    //   let list = await readFirst(facade.allAuth$);
    //   let isLoaded = await readFirst(facade.loaded$);

    //   expect(list.length).toBe(0);
    //   expect(isLoaded).toBe(false);

    //   store.dispatch(
    //     AuthActions.loadAuthSuccess({
    //       auth: [createAuthEntity('AAA'), createAuthEntity('BBB')],
    //     })
    //   );

    //   list = await readFirst(facade.allAuth$);
    //   isLoaded = await readFirst(facade.loaded$);

    //   expect(list.length).toBe(2);
    //   expect(isLoaded).toBe(true);
    // });
  });
});
