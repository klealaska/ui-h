import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as ShellActions from './shell.actions';
import { ShellEffects } from './shell.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { LoggingService } from '@ui-coe/shared/util/services';

describe('ShellEffects', () => {
  let actions: Observable<Action>;
  let effects: ShellEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContentFacade,
        ShellEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        LoggingService,
      ],
    });

    effects = TestBed.inject(ShellEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      // actions = hot('-a-|', { a: ROOT_EFFECTS_INIT });
      // const expected = hot('-a-|', { a: ShellActions.loadShellSuccess({ shell: [] }) });
      // expect(effects.init$).toBeObservable(expected);
    });
  });
});
