import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import * as mockBankAccounts from '../../assets/mock/json/bank-account-list.json';
import * as mockBankAccountDetails from '../../assets/mock/json/bank-account-detail.json';
import DoneCallback = jest.DoneCallback;
import { IBankAccount } from '@ui-coe/bank-account-mgmt/shared/types';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from '../../services/http-config.service';
import { ConfigService } from '@nestjs/config';
import { MOCK_ENV, MOCK_FILE_PATH } from '../shared';
import { MockHttpService, defaultSortFilterConfig } from '@ui-coe/shared/bff/data-access';
import {
  addBankAccountParamsMock,
  updateBankAccountParamsMock,
  updateStatusParamsMock,
} from '../../assets/mock/body/bank-account-params.mock';

describe('bankAccountsController', () => {
  let controller: BankAccountsController;
  let service: BankAccountsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [BankAccountsController],
      providers: [
        BankAccountsService,
        HttpConfigService,
        ConfigService,
        MockHttpService,
        { provide: MOCK_ENV, useValue: true },
        { provide: MOCK_FILE_PATH, useValue: '' },
        { provide: 'SORT_FILTER_CONFIG', useValue: defaultSortFilterConfig },
      ],
    }).compile();

    service = moduleRef.get<BankAccountsService>(BankAccountsService);
    controller = moduleRef.get<BankAccountsController>(BankAccountsController);
  });

  describe('getBankAccounts', () => {
    it('should return the bank-accounts collection', (done: DoneCallback) => {
      const expected = mockBankAccounts;
      jest.spyOn(service, 'getBankAccounts').mockImplementation(() => of(expected));
      controller.getBankAccounts({}).subscribe((response: IBankAccount[]) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('getBankAccountDetails', () => {
    it('should return bank account details', (done: DoneCallback) => {
      const expected = { ...mockBankAccountDetails, isNew: false };
      jest.spyOn(service, 'getBankAccountDetail').mockImplementation(() => of(expected));
      controller.getBankAccountDetail({}, '1').subscribe((response: IBankAccount) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('addBankAccountDetails', () => {
    it('should return bank account details', (done: DoneCallback) => {
      const expected = mockBankAccountDetails;
      jest.spyOn(service, 'addBankAccount').mockImplementation(() => of(expected));
      controller
        .addBankAccount({}, addBankAccountParamsMock)
        .subscribe((response: IBankAccount) => {
          expect(response).toEqual(expected);
          done();
        });
    });
  });

  describe('updateBankAccount', () => {
    it('should return the updated bank account', (done: DoneCallback) => {
      const expected = mockBankAccountDetails;
      jest.spyOn(service, 'updateBankAccount').mockImplementation(() => of(expected));
      controller
        .updateBankAccount({}, updateBankAccountParamsMock)
        .subscribe((response: IBankAccount) => {
          expect(response).toEqual(expected);
          done();
        });
    });
  });

  describe('activateBankAccount', () => {
    it('should return the activated bank account', (done: DoneCallback) => {
      const expected = mockBankAccountDetails;
      jest.spyOn(service, 'activateBankAccount').mockImplementation(() => of(expected));
      controller.activateBankAccount({}, '1').subscribe((response: IBankAccount) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('deactivateBankAccount', () => {
    it('should return the deactivated bank account', (done: DoneCallback) => {
      const expected = mockBankAccountDetails;
      jest.spyOn(service, 'deactivateBankAccount').mockImplementation(() => of(expected));
      controller.deactivateBankAccount({}, '1').subscribe((response: IBankAccount) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a bank account', (done: DoneCallback) => {
      const expected = mockBankAccountDetails;
      jest.spyOn(service, 'updateStatus').mockImplementation(() => of(expected));
      controller.updateStatus({}, updateStatusParamsMock).subscribe((response: IBankAccount) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });
});
