import { TestBed } from '@angular/core/testing';
import {
  activitiesStub,
  fieldBaseStub,
  getActivityStub,
  getCompositeDataStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, DocumentTypes } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogHelperService } from './activity-log-helper.service';
import { Store } from '@ngxs/store';

const storeStub = {
  selectSnapshot: jest.fn(),
} as any;

describe('ActivityLogHelperService', () => {
  let service: ActivityLogHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    });
    service = TestBed.inject(ActivityLogHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMachineValue()', () => {
    describe('when the predicted value confidence is High', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activities = [getActivityStub()];
      const fields = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      label.value.confidence = 0.95;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
            indexingDocumentFields: {
              formFields: fields,
            },
          })
        );
      });

      it('should return value with High Confidence text beside it', () => {
        expect(service.getMachineValue(label, 0, DocumentTypes.Indexing)).toBe(
          `${label.value.text} (Confidence: High)`
        );
      });
    });

    describe('when the predicted value confidence is Low', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activities = [getActivityStub()];
      const fields = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      fields[0].displayThreshold.view = 80;
      fields[0].displayThreshold.readonly = 90;
      label.value.confidence = 0.8;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
            indexingDocumentFields: {
              formFields: fields,
            },
          })
        );
      });

      it('should return value with Low Confidence text beside it', () => {
        expect(service.getMachineValue(label, 0, DocumentTypes.Indexing)).toBe(
          `${label.value.text} (Confidence: Low)`
        );
      });
    });

    describe('when the predicted value confidence is lower than the Low Confidence display', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activities = [getActivityStub()];
      const fields = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      fields[0].displayThreshold.view = 80;
      fields[0].displayThreshold.readonly = 90;
      label.value.confidence = 0.5;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
            indexingDocumentFields: {
              formFields: fields,
            },
          })
        );
      });

      it('should return a hyphen for the confidence', () => {
        expect(service.getMachineValue(label, 0, DocumentTypes.Indexing)).toBe('-');
      });
    });

    describe('when value does not have either current predicted or a previous predicted value', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const fields = fieldBaseStub;
      const activities = activitiesStub;
      const compositeData = getCompositeDataStub();

      activities[0].labels[1].value.confidence = 0;
      label.value.confidence = 0;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
            indexingDocumentFields: {
              formFields: fields,
            },
          })
        );
      });

      it('should return a hyphen', () => {
        expect(service.getMachineValue(label, 0, DocumentTypes.Indexing)).toBe('-');
      });
    });

    describe('when does not find displayThreshold value', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      const fields = fieldBaseStub;
      const activities = activitiesStub;
      const compositeData = getCompositeDataStub();

      activities[0].labels[1].value.confidence = 0;
      label.value.confidence = 0;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
            indexingDocumentFields: {
              formFields: fields,
            },
          })
        );
      });

      it('should return a hyphen', () => {
        expect(service.getMachineValue(label, 0, DocumentTypes.Indexing)).toBe('-');
      });
    });

    describe('when value has a previous predicted value but NOT a current predicted value', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activities = activitiesStub;
      const fields = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      activities[0].labels[1].value.confidence = 0.95;
      label.value.confidence = 1;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
            indexingDocumentFields: {
              formFields: fields,
            },
          })
        );
      });

      it('should return the last predicted value', () => {
        expect(service.getMachineValue(label, 1, DocumentTypes.Indexing)).toBe(
          `${activities[0].labels[1].value.text} (Confidence: High)`
        );
      });
    });

    describe('when value has a previous predicted value but NOT a current predicted value for archived page', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activities = activitiesStub;
      const fields = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      activities[0].labels[1].value.confidence = 0.95;
      label.value.confidence = 1;
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            archiveInvoicePage: {
              document: compositeData,
              formFields: fields,
            },
          })
        );
      });

      it('should return the last predicted value', () => {
        expect(service.getMachineValue(label, 1, DocumentTypes.Archived)).toBe(
          `${activities[0].labels[1].value.text} (Confidence: High)`
        );
      });
    });

    describe('When value text is blank', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const activities = activitiesStub;
      const fields = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      label.value.confidence = 0.95;
      label.value.text = '';
      compositeData.indexed.activities = activities;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            archiveInvoicePage: {
              document: compositeData,
              formFields: fields,
            },
          })
        );
      });

      it('should return a hyphen', () => {
        expect(service.getMachineValue(label, 0, DocumentTypes.Archived)).toBe('-');
      });
    });
  });
});
