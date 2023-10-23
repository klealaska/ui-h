import { getIndexedLabelStub } from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, DocumentTypes } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogMachineValuePipe } from './activity-log-machine-value.pipe';

describe('ActivityLogMachineValuePipe', () => {
  const activityLogHelperServiceStub = {
    getMachineValue: jest.fn(),
  } as any;

  const pipe = new ActivityLogMachineValuePipe(activityLogHelperServiceStub);

  afterEach(() => jest.clearAllMocks());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return whatever the activityLogHelperService.getMachineValue returns', () => {
    activityLogHelperServiceStub.getMachineValue.mockReturnValueOnce('-');
    const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
    const expectedValue = pipe.transform(label, 0, DocumentTypes.Indexing);

    expect(activityLogHelperServiceStub.getMachineValue).toHaveBeenNthCalledWith(
      1,
      label,
      0,
      DocumentTypes.Indexing
    );
    expect(expectedValue).toBe('-');
  });
});
