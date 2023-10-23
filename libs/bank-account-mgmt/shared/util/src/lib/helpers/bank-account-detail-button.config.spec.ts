import { getBankAccountDetailButtonConfig } from '@ui-coe/bank-account-mgmt/shared/util';
import { bankAccountDetailsContentMock } from '@ui-coe/bank-account-mgmt/shared/test';

describe('bank account detail button config', () => {
  // it('should return the config for active', () => {
  //   expect(getBankAccountDetailButtonConfig('active', bankAccountDetailsContentMock)).toEqual([
  //     {
  //       displayEdit: true,
  //       label: 'Deactivate',
  //       buttonType: 'secondary',
  //       buttonColor: 'critical',
  //     },
  //   ]);
  // });

  // it('should return the config for inactive and/or locked', () => {
  //   expect(getBankAccountDetailButtonConfig('locked', bankAccountDetailsContentMock)).toEqual([
  //     {
  //       displayEdit: true,
  //       label: 'Reactivate',
  //       buttonColor: 'default',
  //       buttonType: 'secondary',
  //     },
  //   ]);
  // });

  it('should return the config for pending', () => {
    expect(getBankAccountDetailButtonConfig('pending', bankAccountDetailsContentMock)).toEqual([
      {
        // displayEdit: false,
        label: 'Reject',
        buttonType: 'secondary',
        buttonColor: 'critical',
        updatedStatus: 'failed',
      },
      {
        // displayEdit: false,
        label: 'Approve',
        buttonType: 'primary',
        buttonColor: 'default',
        updatedStatus: 'active',
      },
    ]);
  });

  it('should return the config for failed', () => {
    expect(getBankAccountDetailButtonConfig('failed', bankAccountDetailsContentMock)).toEqual([
      {
        // displayEdit: false,
        label: 'Approve',
        buttonType: 'primary',
        buttonColor: 'default',
        updatedStatus: 'active',
      },
    ]);
  });

  it('should return empty array for non-valid status', () => {
    expect(getBankAccountDetailButtonConfig('someStatus', bankAccountDetailsContentMock)).toEqual(
      []
    );
  });
});
