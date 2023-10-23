import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TimeIntervals } from '@ui-coe/avidcapture/shared/types';

import * as actions from './dashboard-page.actions';

describe('Dashboard Page Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([], { developmentMode: true })],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('QueryTransactionCountReport', () => {
    beforeEach(() => store.dispatch(new actions.QueryTransactionCountReport('1', [])));

    it('should dispatch QueryTransactionCountReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryTransactionCountReport('1', [])
      );
    });
  });

  describe('ExceptionVolumeReport', () => {
    beforeEach(() => store.dispatch(new actions.ExceptionVolumeReport('1', [])));

    it('should dispatch ExceptionVolumeReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ExceptionVolumeReport('1', []));
    });
  });

  describe('QueryAverageTimeToSubmissionReport', () => {
    beforeEach(() =>
      store.dispatch(new actions.QueryAverageTimeToSubmissionReport('1', [], TimeIntervals.Minutes))
    );

    it('should dispatch QueryAverageTimeToSubmissionReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryAverageTimeToSubmissionReport('1', [], TimeIntervals.Minutes)
      );
    });
  });

  describe('QueryAverageTimeToIndexReport', () => {
    beforeEach(() => store.dispatch(new actions.QueryAverageTimeToIndexReport('1', [])));

    it('should dispatch QueryAverageTimeToIndexReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryAverageTimeToIndexReport('1', [])
      );
    });
  });

  describe('QueueAgingReport', () => {
    beforeEach(() => store.dispatch(new actions.QueueAgingReport('1')));

    it('should dispatch QueueAgingReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueueAgingReport('1'));
    });
  });

  describe('ElectronicDeliveryReport', () => {
    beforeEach(() => store.dispatch(new actions.ElectronicDeliveryReport('1', [])));

    it('should dispatch ElectronicDeliveryReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.ElectronicDeliveryReport('1', [])
      );
    });
  });

  describe('QueryTopPaperSuppliersReport', () => {
    beforeEach(() => store.dispatch(new actions.QueryTopPaperSuppliersReport('1', [])));

    it('should dispatch QueryTopPaperSuppliersReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryTopPaperSuppliersReport('1', [])
      );
    });
  });

  describe('UpdateSubmissionTimeInterval', () => {
    beforeEach(() => store.dispatch(new actions.UpdateSubmissionTimeInterval(TimeIntervals.Hours)));

    it('should dispatch UpdateSubmissionTimeInterval action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateSubmissionTimeInterval(TimeIntervals.Hours)
      );
    });
  });

  describe('GenerateTransactionCountReport', () => {
    beforeEach(() => store.dispatch(new actions.GenerateTransactionCountReport({}, true)));

    it('should dispatch GenerateTransactionCountReport action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.GenerateTransactionCountReport({}, true)
      );
    });
  });
});
