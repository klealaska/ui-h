import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RolesEffects } from './roles.effects';

describe('RolesEffects', () => {
  let actions$: Observable<any>;
  let effects: RolesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RolesEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(RolesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
