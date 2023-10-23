import {
  getActivityStub,
  getCompositeDataStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, DocumentTypes } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogColumnValuePipe } from './activity-log-column-value.pipe';

describe('ActivityLogColumnValuePipe', () => {
  const storeStub = {
    selectSnapshot: jest.fn(),
  } as any;

  const activityLogHelperServiceStub = {
    getMachineValue: jest.fn(),
  } as any;

  const pipe = new ActivityLogColumnValuePipe(storeStub, activityLogHelperServiceStub);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('when DocumentType is Indexing', () => {
    describe('when activity.indexer is System and getMachineValue returns a hyphen', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activity = getActivityStub();
      const compositeData = getCompositeDataStub();

      activity.indexer = 'System';
      compositeData.indexed.activities = [activity];
      label.value.confidence = 0.65;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );
        activityLogHelperServiceStub.getMachineValue.mockReturnValueOnce('-');

        expectedValue = pipe.transform(label, 0, DocumentTypes.Indexing);
      });

      it('should call activityLogHelperService getMachineValue fn', () =>
        expect(activityLogHelperServiceStub.getMachineValue).toHaveBeenNthCalledWith(
          1,
          label,
          0,
          DocumentTypes.Indexing
        ));

      it('should return the text label value', () => {
        expect(expectedValue).toBe(label.value.text);
      });
    });

    describe('When activity.indexer is System and getMachineValue returns a value', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activity = getActivityStub();
      const compositeData = getCompositeDataStub();

      activity.indexer = 'System';
      compositeData.indexed.activities = [activity];
      label.value.confidence = 0.95;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );
        activityLogHelperServiceStub.getMachineValue.mockReturnValueOnce('mock man value');

        expectedValue = pipe.transform(label, 0, DocumentTypes.Indexing);
      });

      it('should call activityLogHelperService getMachineValue fn', () =>
        expect(activityLogHelperServiceStub.getMachineValue).toHaveBeenNthCalledWith(
          1,
          label,
          0,
          DocumentTypes.Indexing
        ));

      it('should return a machine value', () => {
        expect(expectedValue).toBe('W1000023');
      });
    });

    describe('when activity.indexer is not System', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activity = getActivityStub();
      const compositeData = getCompositeDataStub();

      activity.indexer = 'mockUser';
      compositeData.indexed.activities = [activity];
      label.value.confidence = 0.95;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );

        expectedValue = pipe.transform(label, 0, DocumentTypes.Indexing);
      });

      it('should NOT call activityLogHelperService getMachineValue fn', () =>
        expect(activityLogHelperServiceStub.getMachineValue).not.toHaveBeenCalled());

      it('should return the label value', () => {
        expect(expectedValue).toBe(label.value.text);
      });
    });

    describe('when compositeData is NULL', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activity = getActivityStub();
      const compositeData = getCompositeDataStub();

      activity.indexer = 'mockUser';
      compositeData.indexed.activities = [activity];
      label.value.confidence = 0.95;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData: null,
            },
          })
        );

        expectedValue = pipe.transform(label, 0, DocumentTypes.Indexing);
      });

      it('should NOT call activityLogHelperService getMachineValue fn', () =>
        expect(activityLogHelperServiceStub.getMachineValue).not.toHaveBeenCalled());

      it('should return the label value', () => {
        expect(expectedValue).toBe(label.value.text);
      });
    });
  });
  describe('when DocumentType is Archived', () => {
    describe('when activity.indexer is System and getMachineValue returns a hyphen', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activity = getActivityStub();
      const compositeData = getCompositeDataStub();

      activity.indexer = 'System';
      compositeData.indexed.activities = [activity];
      label.value.confidence = 0.65;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              document: compositeData,
            },
          })
        );
        activityLogHelperServiceStub.getMachineValue.mockReturnValueOnce('-');

        expectedValue = pipe.transform(label, 0, DocumentTypes.Archived);
      });

      it('should call activityLogHelperService getMachineValue fn', () =>
        expect(activityLogHelperServiceStub.getMachineValue).toHaveBeenNthCalledWith(
          1,
          label,
          0,
          DocumentTypes.Archived
        ));

      it('should return the text label value', () => {
        expect(expectedValue).toBe(label.value.text);
      });
    });
  });
});
