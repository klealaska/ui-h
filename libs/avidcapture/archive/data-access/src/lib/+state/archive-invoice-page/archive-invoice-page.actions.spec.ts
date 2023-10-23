import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { InvoiceTypes } from '@ui-coe/avidcapture/shared/types';
import { getCompositeDataStub } from '@ui-coe/avidcapture/shared/test';

import * as actions from './archive-invoice-page.actions';

describe('Archive Page Actions', () => {
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

  describe('InitArchiveInvoicePage', () => {
    beforeEach(() => store.dispatch(new actions.InitArchiveInvoicePage('1')));

    it('should dispatch InitArchiveInvoicePage action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.InitArchiveInvoicePage('1'));
    });
  });

  describe('QueryArchivedDocument', () => {
    beforeEach(() => store.dispatch(new actions.QueryArchivedDocument('1')));

    it('should dispatch QueryArchivedDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryArchivedDocument('1'));
    });
  });

  describe('QueryDocumentFormFields', () => {
    beforeEach(() => store.dispatch(new actions.QueryDocumentFormFields(InvoiceTypes.Standard)));

    it('should dispatch QueryDocumentFormFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryDocumentFormFields(InvoiceTypes.Standard)
      );
    });
  });

  describe('ParseDocumentFormFields', () => {
    beforeEach(() => store.dispatch(new actions.ParseDocumentFormFields(InvoiceTypes.Standard)));

    it('should dispatch ParseDocumentFormFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.ParseDocumentFormFields(InvoiceTypes.Standard)
      );
    });
  });

  describe('UpdateFontFace', () => {
    beforeEach(() => store.dispatch(new actions.UpdateFontFace(true)));

    it('should dispatch UpdateFontFace action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateFontFace(true));
    });
  });

  describe('SkipToPreviousDocument', () => {
    beforeEach(() => store.dispatch(new actions.SkipToPreviousDocument('')));

    it('should dispatch SkipToPreviousDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SkipToPreviousDocument(''));
    });
  });

  describe('SkipToNextDocument', () => {
    beforeEach(() => store.dispatch(new actions.SkipToNextDocument('')));

    it('should dispatch SkipToNextDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SkipToNextDocument(''));
    });
  });

  describe('HandleNextDocumentGiven', () => {
    const compositeDocumentStub = getCompositeDataStub();
    beforeEach(() => store.dispatch(new actions.HandleNextDocumentGiven(compositeDocumentStub)));

    it('should dispatch HandleNextDocumentGiven action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.HandleNextDocumentGiven(compositeDocumentStub)
      );
    });
  });
});
