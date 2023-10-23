import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BusinessLevelFacade } from './business-level.facade';
import * as fromBusinessLevel from './business-level.reducer';

describe('BusinessLevel Facade', () => {
  let facade: BusinessLevelFacade;
  let store: Store;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          fromBusinessLevel.businessLevelFeatureKey,
          fromBusinessLevel.reducer
        ),
      ],
      providers: [BusinessLevelFacade, provideMockActions(() => actions$)],
    });
    facade = TestBed.inject(BusinessLevelFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should update business level name', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.updateBusinessLevelName();
    expect(spy).toHaveBeenCalledWith({ type: '[BusinessLevel] Update Business Level Name' });
  });
});
