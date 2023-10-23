import {
  getActivityStub,
  getCompositeDataStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  ActivityTypes,
  DocumentLabelKeys,
  EscalationCategoryTypes,
} from '@ui-coe/avidcapture/shared/types';

import { IndexingPageSelectors } from './indexing-page.selectors';

describe('IndexingPageSelectors', () => {
  it('should select compositeData from state', () =>
    expect(
      IndexingPageSelectors.compositeData({
        compositeData: getCompositeDataStub(),
      } as any)
    ).toEqual(getCompositeDataStub()));

  it('should select originalCompositeData from state', () =>
    expect(
      IndexingPageSelectors.originalCompositeData({
        originalCompositeData: getCompositeDataStub(),
      } as any)
    ).toEqual(getCompositeDataStub()));

  it('should select pdfFile from state', () =>
    expect(
      IndexingPageSelectors.pdfFile({
        pdfFile: {
          url: `api/file/1`,
          httpHeaders: { Authorization: `Bearer token` },
          withCredentials: true,
        },
      } as any)
    ).toStrictEqual({
      url: `api/file/1`,
      httpHeaders: { Authorization: `Bearer token` },
      withCredentials: true,
    }));

  it('should select hasNewEscalations from state', () =>
    expect(IndexingPageSelectors.hasNewEscalations({ hasNewEscalations: false } as any)).toBe(
      false
    ));

  it('should return label name when label is found', () => {
    const labelStub = {
      indexed: {
        labels: [
          {
            label: DocumentLabelKeys.nonLookupLabels.BuyerName,
            page: 1,
            value: {
              text: 'buyerNameMock',
              confidence: 99.99,
              boundingBox: [],
              required: false,
              verificationState: '',
            },
          },
        ],
      },
    };
    expect(IndexingPageSelectors.buyerName({ compositeData: labelStub } as any)).toBe(
      'buyerNameMock'
    );
  });

  it('should return empty string when labels is empty', () => {
    const labelStub = {
      indexed: {
        labels: [],
      },
    };
    expect(IndexingPageSelectors.buyerName({ compositeData: labelStub } as any)).toBe('');
  });

  it('should return empty string when labels is null', () => {
    const labelStub = {
      indexed: {
        labels: null,
      },
    };
    expect(IndexingPageSelectors.buyerName({ document: labelStub } as any)).toBe('');
  });

  it('should return empty string when document is null', () => {
    expect(IndexingPageSelectors.buyerName({ document: null } as any)).toBe('');
  });

  it('should return empty string when indexed data is null', () => {
    const labelStub = {
      indexed: null,
    };
    expect(IndexingPageSelectors.buyerName({ document: labelStub } as any)).toBe('');
  });

  it('should return empty string when label value is null', () => {
    const document = getCompositeDataStub();
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerName);
    indexedLabel.value = null;
    document.indexed.labels.push(indexedLabel);

    expect(IndexingPageSelectors.buyerName({ document } as any)).toBe('');
  });

  it('should return buyerName label when label exists', () => {
    const compositeData = getCompositeDataStub();
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerName);
    compositeData.indexed.labels.push(indexedLabel);

    expect(IndexingPageSelectors.buyerName({ compositeData } as any)).toBe(indexedLabel.value.text);
  });

  it('should select latestFieldAssociation from state', () =>
    expect(
      IndexingPageSelectors.latestFieldAssociation({
        latestFieldAssociation: null,
      } as any)
    ).toBeNull());

  it('should return null ActivityToDisplay when compositedata is null', () => {
    expect(IndexingPageSelectors.activityToDisplay({ compositeData: null } as any)).toBeNull();
  });

  it('should return null ActivityToDisplay when indexeddata is null', () => {
    expect(
      IndexingPageSelectors.activityToDisplay({ compositeData: { indexed: null } } as any)
    ).toBeNull();
  });

  it('should return null ActivityToDisplay when activities is null', () => {
    expect(
      IndexingPageSelectors.activityToDisplay({
        compositeData: { indexed: { activities: null } },
      } as any)
    ).toBeNull();
  });

  describe('when activity is a create new account activity', () => {
    it('should select nothing from state', () => {
      const compositeData = getCompositeDataStub();
      const activity = getActivityStub();

      compositeData.indexed.activities = [];
      compositeData.indexed.activities.push(activity);

      expect(IndexingPageSelectors.activityToDisplay({ compositeData } as any)).toEqual(null);
    });
  });

  describe('when activity has an exception and then a save after it', () => {
    it('should select the exception activity from state', () => {
      const compositeData = getCompositeDataStub();
      const exceptionActivity = getActivityStub();
      const saveActivity = getActivityStub();

      exceptionActivity.activity = ActivityTypes.Exception;
      saveActivity.activity = ActivityTypes.Save;
      compositeData.indexed.activities = [];
      compositeData.indexed.activities.push(exceptionActivity, saveActivity);

      expect(IndexingPageSelectors.activityToDisplay({ compositeData } as any)).toEqual(
        exceptionActivity
      );
    });
  });

  describe('Selector saveInvoiceIsActive', () => {
    const compositeData = getCompositeDataStub();
    const activity = getActivityStub();
    compositeData.indexed.labels[0].label = 'IngestionType';
    compositeData.indexed.labels[0].value.text = 'api';
    it('should return TRUE if ingestion type is API and saveInvoiceIsActive flag is true and canSeeSaveButton is true', () => {
      expect(
        IndexingPageSelectors.saveInvoiceIsActive({ compositeData } as any, null, true)
      ).toBeTruthy();
    });

    it('should return TRUE if has escalation and saveInvoiceIsActive flag is true and canSeeSaveButton is true', () => {
      expect(
        IndexingPageSelectors.saveInvoiceIsActive({ compositeData } as any, activity, true)
      ).toBeTruthy();
    });

    it('should return FALSE if ingestion type different of API, does not have escalation and saveInvoiceIsActive flag is true and canSeeSaveButton is true', () => {
      compositeData.indexed.labels[0].value.text = 'email';
      expect(
        IndexingPageSelectors.saveInvoiceIsActive({ compositeData } as any, null, true)
      ).toBeFalsy();
    });

    it('should return FALSE if canSeeSaveButton flag is false', () => {
      expect(
        IndexingPageSelectors.saveInvoiceIsActive({ compositeData } as any, activity, false)
      ).toBeFalsy();
    });
  });

  describe('Selector saveInvoiceIsActive when ingestion type is email & latest escalation is create new account number', () => {
    const compositeData = getCompositeDataStub();
    const activity = getActivityStub();

    compositeData.indexed.labels[0].label = 'IngestionType';
    compositeData.indexed.labels[0].value.text = 'email';
    activity.activity = ActivityTypes.CreateNewAccount;

    it('should return FALSE', () => {
      expect(
        IndexingPageSelectors.saveInvoiceIsActive({ compositeData } as any, activity, true)
      ).toBeFalsy();
    });
  });

  describe('Selector moreActionsIsActive', () => {
    const compositeData = getCompositeDataStub();

    it('should return TRUE if has escalation and moreActionsIsActive flag is true and canSeeMoreActions is true', () => {
      expect(
        IndexingPageSelectors.moreActionsIsActive({ compositeData } as any, true)
      ).toBeTruthy();
    });

    it('should return FALSE if canSeeSaveButton flag is false', () => {
      expect(
        IndexingPageSelectors.moreActionsIsActive({ compositeData } as any, false)
      ).toBeFalsy();
    });
  });

  it('should return true for hasActivities', () => {
    const compositeData = getCompositeDataStub();
    const activityStub = getActivityStub();

    compositeData.indexed.activities.push(activityStub);
    expect(IndexingPageSelectors.hasActivities({ compositeData } as any)).toBeTruthy();
  });

  it('should return false for hasActivities', () => {
    const compositeData = getCompositeDataStub();
    compositeData.indexed.activities = [];
    expect(IndexingPageSelectors.hasActivities({ compositeData } as any)).toBeFalsy();
  });

  it('should return false for hasActivities when compositedata is null', () => {
    expect(IndexingPageSelectors.hasActivities({ compositeData: null } as any)).toBeFalsy();
  });

  it('should return false for hasActivities when indexed is null', () => {
    expect(
      IndexingPageSelectors.hasActivities({ compositeData: { indexed: null } } as any)
    ).toBeFalsy();
  });

  it('should return false for hasActivities when activities is null', () => {
    expect(
      IndexingPageSelectors.hasActivities({
        compositeData: { indexed: { activities: null } },
      } as any)
    ).toBeFalsy();
  });

  it('should select associatedErrorMessage from state', () =>
    expect(
      IndexingPageSelectors.associatedErrorMessage({
        associatedErrorMessage: null,
      } as any)
    ).toBeNull());

  describe('markAsChoices selector', () => {
    it('should NOT add Recycle Bin to the markAsList', () =>
      expect(
        IndexingPageSelectors.markAsChoices({} as any, [
          EscalationCategoryTypes.RecycleBin,
          EscalationCategoryTypes.ImageIssue,
        ])
      ).toEqual(expect.arrayContaining([{ text: EscalationCategoryTypes.ImageIssue }])));

    it('should NOT add Reject to Sender to the markAsList', () =>
      expect(
        IndexingPageSelectors.markAsChoices({} as any, [
          EscalationCategoryTypes.RejectToSender,
          EscalationCategoryTypes.DataExceptionAU,
        ])
      ).toEqual(expect.arrayContaining([{ text: EscalationCategoryTypes.DataExceptionAU }])));
  });

  describe('selector isSwappedDocument', () => {
    const compositeData = getCompositeDataStub();

    it('should return false when composite data is null', () => {
      expect(IndexingPageSelectors.isSwappedDocument({ compositeData: null } as any)).toBeFalsy();
    });

    it('should return false when composite.indexed data is null', () => {
      const testCompositeData = getCompositeDataStub();
      testCompositeData.indexed = null;
      expect(
        IndexingPageSelectors.isSwappedDocument({ compositeData: testCompositeData } as any)
      ).toBeFalsy();
    });

    it('should return false if a document does not have a swap activity', () => {
      expect(IndexingPageSelectors.isSwappedDocument({ compositeData } as any)).toBeFalsy();
    });

    it('should return true if a document has a swap activity', () => {
      compositeData.indexed.activities[0].activity = 'Swap';
      expect(IndexingPageSelectors.isSwappedDocument({ compositeData } as any)).toBeTruthy();
    });
  });

  it('should select isReadOnly from state', () =>
    expect(
      IndexingPageSelectors.isReadOnly({
        isReadOnly: true,
      } as any)
    ).toBeTruthy());

  it('should select swappedDocument from state', () =>
    expect(
      IndexingPageSelectors.swappedDocument({
        swappedDocument: null,
      } as any)
    ).toBeNull());

  it('should select updateFontFace from state', () =>
    expect(
      IndexingPageSelectors.updateFontFace({
        updateFontFace: true,
      } as any)
    ).toEqual(true));

  it('should select disableHighlight from state', () =>
    expect(
      IndexingPageSelectors.disableHighlight({
        disableHighlight: true,
      } as any)
    ).toEqual(true));

  it('should select hasChangedLabels from state', () =>
    expect(
      IndexingPageSelectors.hasChangedLabels({
        changedLabels: [],
      } as any)
    ).toEqual(false));
});
