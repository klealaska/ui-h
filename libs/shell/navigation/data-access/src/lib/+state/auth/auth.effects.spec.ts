import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { AppName } from '../../enums/app-name';

import * as AuthActions from './auth.actions';
import { AuthEffects } from './auth.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockOktaAuthService = {
  authState$: of({ isAuthenticated: false }),
};

describe('AuthEffects', () => {
  let actions: Observable<Action>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthEffects, provideMockActions(() => actions), provideMockStore()],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      AuthActions.initAuth({ authUrl: 'test', appName: AppName.Shell });

      expect(effects.initAuth$);
    });
  });
});
