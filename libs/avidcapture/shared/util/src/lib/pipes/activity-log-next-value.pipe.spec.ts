import {
  activitiesStub,
  getCompositeDataStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, DocumentTypes } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogNextValuePipe } from './activity-log-next-value.pipe';

describe('ActivityLogNextValuePipe', () => {
  const storeStub = {
    selectSnapshot: jest.fn(),
  } as any;

  const pipe = new ActivityLogNextValuePipe(storeStub);

  afterEach(() => jest.clearAllMocks());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('for Indexing pages', () => {
    describe('when label is found', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const compositeData = getCompositeDataStub();

      compositeData.indexed.activities = activitiesStub;
      compositeData.indexed.labels.push(label);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );

        expectedValue = pipe.transform(
          activitiesStub,
          DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          1,
          DocumentTypes.Indexing
        );
      });

      it('should return the next value', () => {
        expect(expectedValue).toBe('Account Number Prev');
      });
    });

    describe('when label is NOT found', () => {
      let expectedValue: string;
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );

        expectedValue = pipe.transform(
          activitiesStub,
          DocumentLabelKeys.lookupLabels.ShipToAddress,
          2,
          DocumentTypes.Indexing
        );
      });
      it('should return undefined', () => {
        expect(expectedValue).toBeUndefined();
      });
    });

    describe('when compositeData is NULL', () => {
      let expectedValue: string;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData: null,
            },
          })
        );

        expectedValue = pipe.transform(
          activitiesStub,
          DocumentLabelKeys.lookupLabels.ShipToAddress,
          2,
          DocumentTypes.Indexing
        );
      });
      it('should return undefined', () => {
        expect(expectedValue).toBeUndefined();
      });
    });
  });

  describe('for Archived pages', () => {
    describe('when label is found', () => {
      let expectedValue: string;
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const compositeData = getCompositeDataStub();

      compositeData.indexed.activities = activitiesStub;
      compositeData.indexed.labels.push(label);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              document: compositeData,
            },
          })
        );

        expectedValue = pipe.transform(
          activitiesStub,
          DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          1,
          DocumentTypes.Archived
        );
      });

      it('should return the next value', () => {
        expect(expectedValue).toBe('Account Number Prev');
      });
    });

    describe('when label is NOT found', () => {
      let expectedValue: string;
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              document: compositeData,
            },
          })
        );

        expectedValue = pipe.transform(
          activitiesStub,
          DocumentLabelKeys.lookupLabels.ShipToAddress,
          2,
          DocumentTypes.Archived
        );
      });
      it('should return undefined', () => {
        expect(expectedValue).toBeUndefined();
      });
    });
  });
});
