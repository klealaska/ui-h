import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SortDirection } from '@ui-coe/avidcapture/shared/types';

import * as actions from './uploads-queue-page.actions';

describe('Pending Page Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('QueryUploadedInvoices', () => {
    beforeEach(() => store.dispatch(new actions.QueryUploadedInvoices()));

    it('should dispatch QueryUploadedInvoices action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryUploadedInvoices());
    });
  });

  describe('SetSourceEmail', () => {
    beforeEach(() => store.dispatch(new actions.SetSourceEmail('mock')));

    it('should dispatch SetSourceEmail action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetSourceEmail('mock'));
    });
  });

  describe('SetColumnSortedData', () => {
    beforeEach(() =>
      store.dispatch(
        new actions.SetColumnSortedData({ active: 'fileName', direction: SortDirection.Ascending })
      )
    );

    it('should dispatch SetColumnSortedData action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetColumnSortedData({ active: 'fileName', direction: SortDirection.Ascending })
      );
    });
  });

  describe('ResetPageNumber', () => {
    beforeEach(() => store.dispatch(new actions.ResetPageNumber()));

    it('should dispatch ResetPageNumber action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ResetPageNumber());
    });
  });

  describe('EnablePageRefresh', () => {
    beforeEach(() => store.dispatch(new actions.EnablePageRefresh()));

    it('should dispatch EnablePageRefresh action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.EnablePageRefresh());
    });
  });

  describe('DisablePageRefresh', () => {
    beforeEach(() => store.dispatch(new actions.DisablePageRefresh()));

    it('should dispatch DisablePageRefresh action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.DisablePageRefresh());
    });
  });

  describe('SetScrollPosition', () => {
    beforeEach(() => store.dispatch(new actions.SetScrollPosition([0, 0])));

    it('should dispatch SetScrollPosition action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetScrollPosition([0, 0]));
    });
  });

  describe('ScrollToPosition', () => {
    beforeEach(() => store.dispatch(new actions.ScrollToPosition()));

    it('should dispatch ScrollToPosition action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ScrollToPosition());
    });
  });

  describe('UpdateMyUploadsInvoiceSubmit', () => {
    beforeEach(() => store.dispatch(new actions.UpdateMyUploadsInvoiceSubmit('mock')));

    it('should dispatch UpdateMyUploadsInvoiceSubmit action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateMyUploadsInvoiceSubmit('mock')
      );
    });
  });

  describe('UploadDocument', () => {
    const fileStub = {} as any;
    beforeEach(() => store.dispatch(new actions.UploadDocument(fileStub, 'mock', 'correlationId')));

    it('should dispatch UploadDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UploadDocument(fileStub, 'mock', 'correlationId')
      );
    });
  });

  describe('QueryAllPendingDocuments', () => {
    beforeEach(() => store.dispatch(new actions.QueryAllPendingDocuments()));

    it('should dispatch QueryAllPendingDocuments action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryAllPendingDocuments());
    });
  });

  describe('CreatePendingUpload', () => {
    beforeEach(() => store.dispatch(new actions.CreatePendingUpload([])));

    it('should dispatch CreatePendingUpload action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.CreatePendingUpload([]));
    });
  });

  describe('FilterByInvoiceName', () => {
    beforeEach(() => store.dispatch(new actions.FilterByInvoiceName('value')));

    it('should dispatch FilterByInvoiceName action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.FilterByInvoiceName('value'));
    });
  });

  describe('ClearUploadedDocumentMessages', () => {
    beforeEach(() => store.dispatch(new actions.ClearUploadedDocumentMessages()));

    it('should dispatch ClearUploadedDocumentMessages action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.ClearUploadedDocumentMessages()
      );
    });
  });

  describe('BatchDeletion', () => {
    beforeEach(() => store.dispatch(new actions.BatchDeletion([])));

    it('should dispatch BatchDeletion action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.BatchDeletion([]));
    });
  });

  describe('BatchDownload', () => {
    beforeEach(() => store.dispatch(new actions.BatchDownload([])));

    it('should dispatch BatchDownload action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.BatchDownload([]));
    });
  });
});
