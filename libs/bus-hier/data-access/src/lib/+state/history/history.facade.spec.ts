import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { HistoryFacade } from './history.facade';
import * as fromHistory from './history.reducer';
import * as HistoryActions from './history.actions';

describe('HistoryFacade', () => {
  let facade: HistoryFacade;
  let store: Store;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromHistory.historyFeatureKey, fromHistory.reducer),
      ],
      providers: [HistoryFacade, provideMockActions(() => actions$)],
    });
    facade = TestBed.inject(HistoryFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('updateHistoryEvents', () => {
    it('should update the history events', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.updateHistoryEvents([]);
      expect(spy).toHaveBeenCalledWith(HistoryActions.updateHistoryEvents({ events: [] }));
    });
  });
});
