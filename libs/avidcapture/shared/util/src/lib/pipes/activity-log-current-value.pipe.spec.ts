import { getIndexedLabelStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogCurrentValuePipe } from './activity-log-current-value.pipe';

describe('ActivityLogCurrentValuePipe', () => {
  const pipe = new ActivityLogCurrentValuePipe();

  afterEach(() => jest.clearAllMocks());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('getCurrentValue()', () => {
    describe('when label is found', () => {
      let expectedValue: string;
      const indexedLabelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);

      beforeEach(() => {
        expectedValue = pipe.transform(
          [indexedLabelStub],
          DocumentLabelKeys.lookupLabels.ShipToName
        );
      });

      it('should return the current value from passed in label', () =>
        expect(expectedValue).toBe(indexedLabelStub.value.text));
    });

    describe('when label is NOT found', () => {
      let expectedValue: string;
      const indexedLabelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);

      beforeEach(() => {
        expectedValue = pipe.transform([indexedLabelStub], DocumentLabelKeys.nonLookupLabels.Terms);
      });

      it('should return an empty string for current value', () => expect(expectedValue).toBe(''));
    });
  });
});
