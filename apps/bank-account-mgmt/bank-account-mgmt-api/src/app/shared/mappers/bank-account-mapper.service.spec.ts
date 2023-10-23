import { bankAccountDetailMapper, bankAccountListMapper } from './bank-account-mapper.service';
import * as mockList from '../../../assets/mock/json/bank-account-list.json';
import * as mockDetail from '../../../assets/mock/json/bank-account-detail.json';

describe('bank account mapper', () => {
  it('should add the isNew flag to each bam list object', () => {
    expect(bankAccountListMapper(mockList)[0]).toEqual({ ...mockList[0], isNew: false });
  });

  it('should add the isNew flag to the bam detail object', () => {
    expect(bankAccountDetailMapper(mockDetail)).toEqual({ ...mockDetail, isNew: false });
  });
});
