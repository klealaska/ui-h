import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import {
  getActivityStub,
  getAdvancedFilterStub,
  getAggregateBodyRequest,
  getCompositeDataStub,
  getEscalationStub,
  getFieldBaseStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';

import * as actions from './indexing-page.actions';

describe('Indexing Page Actions', () => {
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

  describe('InitIndexingPage', () => {
    beforeEach(() => store.dispatch(new actions.InitIndexingPage('1')));

    it('should dispatch InitIndexingPage action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.InitIndexingPage('1'));
    });
  });

  describe('QueryUnindexedDocument', () => {
    beforeEach(() => store.dispatch(new actions.QueryUnindexedDocument('test')));

    it('should dispatch QueryUnindexedDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryUnindexedDocument('test'));
    });
  });

  describe('PutInEscalation', () => {
    const indexedDocumentStub = getCompositeDataStub().indexed;
    const actionStub = 'ActionStub' as any;
    const documentIdStub = '1';

    beforeEach(() =>
      store.dispatch(new actions.PutInEscalation(indexedDocumentStub, actionStub, documentIdStub))
    );

    it('should dispatch PutInEscalation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.PutInEscalation(indexedDocumentStub, actionStub, documentIdStub)
      );
    });
  });

  describe('SaveIndexedDocument', () => {
    const indexedDocumentStub = getCompositeDataStub().indexed;
    const actionStub = 'ActionStub' as any;

    beforeEach(() =>
      store.dispatch(new actions.SaveIndexedDocument(indexedDocumentStub, actionStub))
    );

    it('should dispatch SaveIndexedDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SaveIndexedDocument(indexedDocumentStub, actionStub, false)
      );
    });
  });

  describe('SubmitIndexedDocument', () => {
    const indexedDocumentStub = getCompositeDataStub().indexed;
    const actionStub = 'ActionStub' as any;
    const documentIdStub = '1';

    beforeEach(() =>
      store.dispatch(
        new actions.SubmitIndexedDocument(indexedDocumentStub, actionStub, documentIdStub)
      )
    );

    it('should dispatch SubmitIndexedDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SubmitIndexedDocument(indexedDocumentStub, actionStub, documentIdStub)
      );
    });
  });

  describe('AddCompositeDataActivity', () => {
    const activityStub = getActivityStub();

    beforeEach(() => store.dispatch(new actions.AddCompositeDataActivity(activityStub)));

    it('should dispatch AddCompositeDataActivity action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.AddCompositeDataActivity(activityStub)
      );
    });
  });

  describe('RemoveCustomerAccountActivity', () => {
    beforeEach(() => store.dispatch(new actions.RemoveCustomerAccountActivity()));

    it('should dispatch RemoveCustomerAccountActivity action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.RemoveCustomerAccountActivity()
      );
    });
  });

  describe('UpdateOnLookupFieldAssociation', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateOnLookupFieldAssociation(indexedLabelStub)));

    it('should dispatch UpdateOnLookupFieldAssociation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateOnLookupFieldAssociation(indexedLabelStub)
      );
    });
  });

  describe('UpdateOnNonLookupFieldAssociation', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() =>
      store.dispatch(new actions.UpdateOnNonLookupFieldAssociation(indexedLabelStub))
    );

    it('should dispatch UpdateOnNonLookupFieldAssociation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateOnNonLookupFieldAssociation(indexedLabelStub)
      );
    });
  });

  describe('UpdateOnManualIntervention', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateOnManualIntervention(fieldBaseStub)));

    it('should dispatch UpdateOnManualIntervention action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateOnManualIntervention(fieldBaseStub)
      );
    });
  });

  describe('UpdateCompositeDataLabel', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateCompositeDataLabel(indexedLabelStub)));

    it('should dispatch UpdateCompositeDataLabel action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateCompositeDataLabel(indexedLabelStub)
      );
    });
  });

  describe('AddCompositeDataLabel', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() => store.dispatch(new actions.AddCompositeDataLabel(indexedLabelStub)));

    it('should dispatch AddCompositeDataLabel action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.AddCompositeDataLabel(indexedLabelStub)
      );
    });
  });

  describe('UpdateChangedLabels', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateChangedLabels(indexedLabelStub)));

    it('should dispatch UpdateChangedLabels action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateChangedLabels(indexedLabelStub)
      );
    });
  });

  describe('QueryNextDocument', () => {
    beforeEach(() => store.dispatch(new actions.QueryNextDocument(null)));

    it('should dispatch QueryNextDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryNextDocument(null));
    });
  });

  describe('SkipDocument', () => {
    beforeEach(() => store.dispatch(new actions.SkipDocument('1', 1)));

    it('should dispatch SkipDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SkipDocument('1', 1));
    });
  });

  describe('SkipToPreviousDocument', () => {
    beforeEach(() => store.dispatch(new actions.SkipToPreviousDocument('1')));

    it('should dispatch SkipToPreviousDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SkipToPreviousDocument('1'));
    });
  });

  describe('SkipToNextDocument', () => {
    beforeEach(() => store.dispatch(new actions.SkipToNextDocument('1')));

    it('should dispatch SkipToNextDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SkipToNextDocument('1'));
    });
  });

  describe('SetBuyerId', () => {
    beforeEach(() => store.dispatch(new actions.SetBuyerId('1')));

    it('should dispatch SetBuyerId action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetBuyerId('1'));
    });
  });

  describe('RemoveLatestFieldAssociation', () => {
    beforeEach(() => store.dispatch(new actions.RemoveLatestFieldAssociation()));

    it('should dispatch RemoveLatestFieldAssociation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveLatestFieldAssociation());
    });
  });

  describe('SetEscalation', () => {
    const escalationStub = getEscalationStub('mock');

    beforeEach(() => store.dispatch(new actions.SetEscalation(escalationStub)));

    it('should dispatch SetEscalation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetEscalation(escalationStub));
    });
  });

  describe('OverrideEscalation', () => {
    beforeEach(() => store.dispatch(new actions.OverrideEscalation()));

    it('should dispatch OverrideEscalation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.OverrideEscalation());
    });
  });

  describe('SetPdfFileValue', () => {
    beforeEach(() => store.dispatch(new actions.SetPdfFileValue()));

    it('should dispatch SetPdfFileValue action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetPdfFileValue());
    });
  });

  describe('SetPdfSecret', () => {
    beforeEach(() => store.dispatch(new actions.SetPdfSecret('mock')));

    it('should dispatch SetPdfSecret action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetPdfSecret('mock'));
    });
  });

  describe('UpdateLookupFieldAssociationValue', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateLookupFieldAssociationValue(fieldBaseStub)));

    it('should dispatch UpdateLookupFieldAssociationValue action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateLookupFieldAssociationValue(fieldBaseStub)
      );
    });
  });

  describe('ResetIndexingState', () => {
    beforeEach(() => store.dispatch(new actions.ResetIndexingState()));

    it('should dispatch ResetIndexingState action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ResetIndexingState());
    });
  });

  describe('UpdateLabelsAfterThresholdCheck', () => {
    beforeEach(() => store.dispatch(new actions.UpdateLabelsAfterThresholdCheck()));

    it('should dispatch UpdateLabelsAfterThresholdCheck action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateLabelsAfterThresholdCheck()
      );
    });
  });

  describe('UpdateSupplierAddressLabel', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateSupplierAddressLabel(fieldBaseStub, [])));

    it('should dispatch UpdateSupplierAddressLabel action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateSupplierAddressLabel(fieldBaseStub, [])
      );
    });
  });

  describe('UpdateShipToAddressLabel', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateShipToAddressLabel(fieldBaseStub, [])));

    it('should dispatch UpdateShipToAddressLabel action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateShipToAddressLabel(fieldBaseStub, [])
      );
    });
  });

  describe('AddAutoFormatActivity', () => {
    const indexedDocumentStub = getCompositeDataStub().indexed;

    beforeEach(() => store.dispatch(new actions.AddAutoFormatActivity(indexedDocumentStub, null)));

    it('should dispatch AddAutoFormatActivity action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.AddAutoFormatActivity(indexedDocumentStub, null)
      );
    });
  });

  describe('UpdateSwappedDocument', () => {
    const indexedDocumentStub = getCompositeDataStub().indexed;

    beforeEach(() => store.dispatch(new actions.UpdateSwappedDocument(indexedDocumentStub)));

    it('should dispatch UpdateSwappedDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateSwappedDocument(indexedDocumentStub)
      );
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

  describe('UpdateFontFace', () => {
    beforeEach(() => store.dispatch(new actions.UpdateFontFace(true)));

    it('should dispatch UpdateFontFace action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateFontFace(true));
    });
  });

  describe('DisableHighlight', () => {
    beforeEach(() => store.dispatch(new actions.DisableHighlight(true)));

    it('should dispatch DisableHighlight action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.DisableHighlight(true));
    });
  });

  describe('StorePageFilters', () => {
    const pageFilters = getAdvancedFilterStub();

    beforeEach(() => store.dispatch(new actions.StorePageFilters(pageFilters)));

    it('should dispatch StorePageFilters action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.StorePageFilters(pageFilters));
    });
  });

  describe('RoundCurrencyValues', () => {
    beforeEach(() => store.dispatch(new actions.RoundCurrencyValues()));

    it('should dispatch RoundCurrencyValues action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RoundCurrencyValues());
    });
  });

  describe('InitialInvoiceTypeLabelValueCheck', () => {
    beforeEach(() => store.dispatch(new actions.InitialInvoiceTypeLabelValueCheck()));

    it('should dispatch InitialInvoiceTypeLabelValueCheck action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.InitialInvoiceTypeLabelValueCheck()
      );
    });
  });

  describe('GetNextDocument', () => {
    const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
    beforeEach(() =>
      store.dispatch(new actions.GetNextDocument('mock', searchBodyRequestStub, 'Submit'))
    );

    it('should dispatch GetNextDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.GetNextDocument('mock', searchBodyRequestStub, 'Submit')
      );
    });
  });

  describe('EnableQueueSockets', () => {
    beforeEach(() => store.dispatch(new actions.EnableQueueSockets()));

    it('should dispatch EnableQueueSockets action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.EnableQueueSockets());
    });
  });
});
