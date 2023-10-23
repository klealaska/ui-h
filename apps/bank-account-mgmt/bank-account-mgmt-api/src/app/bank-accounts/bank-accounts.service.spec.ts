import { BankAccountsService } from './bank-accounts.service';
import { HttpConfigService } from '../../services/http-config.service';
import { Test } from '@nestjs/testing';
import { configServiceMock } from '../../assets/mock/services';
import { MOCK_ENV, MOCK_FILE_PATH } from '../shared';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import * as mockBankAccounts from '../../assets/mock/json/bank-account-list.json';
import * as mockBankAccountDetails from '../../assets/mock/json/bank-account-detail.json';
import { AxiosResponse } from 'axios';
import { IBankAccount, IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import DoneCallback = jest.DoneCallback;
import { MockHttpService, defaultSortFilterConfig } from '@ui-coe/shared/bff/data-access';
import {
  addBankAccountParamsMock,
  updateBankAccountParamsMock,
  updateStatusParamsMock,
} from '../../assets/mock/body/bank-account-params.mock';
import { HttpException } from '@nestjs/common';
import { IUpdateStatusParams } from '../models/bank-account.model';

describe('bankAccountService', () => {
  let service: BankAccountsService;
  let mockHttpService: MockHttpService;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        BankAccountsService,
        MockHttpService,
        { provide: HttpConfigService, useValue: configServiceMock },
        { provide: MOCK_ENV, useValue: true },
        { provide: MOCK_FILE_PATH, useValue: '' },
        { provide: 'SORT_FILTER_CONFIG', useValue: defaultSortFilterConfig },
      ],
    }).compile();

    service = moduleRef.get<BankAccountsService>(BankAccountsService);
    mockHttpService = moduleRef.get<MockHttpService>(MockHttpService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  describe('getBankAccounts()', () => {
    it('should getBankAccounts() -- success', (done: DoneCallback) => {
      const headers = {};
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({ data: mockBankAccounts } as AxiosResponse));
      service.getBankAccounts({}).subscribe((response: IBankAccount[]) => {
        expect(httpService.get).toHaveBeenCalledWith(configServiceMock.getBankAccounts(), {
          headers,
        });
        expect(response).toEqual(mockBankAccounts);
        done();
      });
    });

    it('should getBankAccounts() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => throwError(() => 'error'));
      service.getBankAccounts({}).subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });

  describe('getBankAccountDetail()', () => {
    const headers = {};
    it('should getBankAccountDetail() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({ data: mockBankAccountDetails } as AxiosResponse));
      service.getBankAccountDetail(headers, '1').subscribe((response: IBankAccountMapped) => {
        expect(httpService.get).toHaveBeenCalledWith(
          `${configServiceMock.getBankAccountById()}/1`,
          { headers }
        );
        expect(response).toEqual(
          JSON.parse(JSON.stringify({ ...mockBankAccountDetails, isNew: false }))
        );
        done();
      });
    });

    it('should getBankAccountDetail() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => throwError(() => 'error'));
      service.getBankAccountDetail(headers, '1').subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });

  describe('addBankAccountDetails', () => {
    const headers = {};

    it('should addBankAccount() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of({ data: addBankAccountParamsMock } as AxiosResponse));
      service
        .addBankAccount(headers, addBankAccountParamsMock)
        .subscribe((response: IBankAccount) => {
          expect(httpService.post).toHaveBeenCalledWith(
            configServiceMock.postBankAccount(),
            addBankAccountParamsMock,
            { headers }
          );
          expect(response).toEqual(addBankAccountParamsMock);
          done();
        });
    });

    it('should addBankAccount() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'post').mockImplementationOnce(() => throwError(() => 'error'));
      service.addBankAccount(headers, addBankAccountParamsMock).subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });

  describe('updateBankAccount', () => {
    const headers = {};

    it('should updateBankAccount() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'put')
        .mockImplementationOnce(() => of({ data: mockBankAccountDetails } as AxiosResponse));
      service
        .updateBankAccount(headers, updateBankAccountParamsMock)
        .subscribe((response: IBankAccount) => {
          expect(httpService.put).toHaveBeenCalledWith(
            configServiceMock.updateBankAccount(),
            updateBankAccountParamsMock,
            { headers }
          );
          expect(response).toEqual(mockBankAccountDetails);
          done();
        });
    });

    it('should updateBankAccount() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'put').mockImplementationOnce(() => throwError(() => 'error'));
      service.updateBankAccount(headers, updateBankAccountParamsMock).subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });

  describe('activateBankAccount', () => {
    const headers = {};
    const id = '1';

    it('should activateBankAccount() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'put')
        .mockImplementationOnce(() => of({ data: mockBankAccountDetails } as AxiosResponse));
      service.activateBankAccount(headers, id).subscribe((response: IBankAccount) => {
        expect(httpService.put).toHaveBeenCalledWith(
          `${configServiceMock.updateBankAccount()}/${id}/activate`,
          {},
          { headers }
        );
        expect(response).toEqual(mockBankAccountDetails);
        done();
      });
    });

    it('should activateBankAccount() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'put').mockImplementationOnce(() => throwError(() => 'error'));
      service.activateBankAccount(headers, '1').subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });

  describe('deactivateBankAccount', () => {
    const headers = {};
    const id = '1';

    it('should deactivateBankAccount() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'put')
        .mockImplementationOnce(() => of({ data: mockBankAccountDetails } as AxiosResponse));
      service.deactivateBankAccount(headers, id).subscribe((response: IBankAccount) => {
        expect(httpService.put).toHaveBeenCalledWith(
          `${configServiceMock.updateBankAccount()}/${id}/deactivate`,
          {},
          { headers }
        );
        expect(response).toEqual(mockBankAccountDetails);
        done();
      });
    });

    it('should deactivateBankAccount() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'put').mockImplementationOnce(() => throwError(() => 'error'));
      service.deactivateBankAccount(headers, '1').subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });

  describe('updateStatus', () => {
    const headers = {};
    const params: IUpdateStatusParams = updateStatusParamsMock;

    it('should updateStatus() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'put')
        .mockImplementationOnce(() => of({ data: mockBankAccountDetails } as AxiosResponse));
      service.updateStatus(headers, params).subscribe((response: IBankAccount) => {
        expect(httpService.put).toHaveBeenCalledWith(
          `${configServiceMock.updateStatus()}/status`,
          updateStatusParamsMock,
          { headers }
        );
        expect(response).toEqual(mockBankAccountDetails);
        done();
      });
    });

    it('should updateStatus() -- error', (done: DoneCallback) => {
      jest.spyOn(httpService, 'put').mockImplementationOnce(() => throwError(() => 'error'));
      service.updateStatus(headers, updateStatusParamsMock).subscribe({
        error: err => {
          expect(err).toEqual(new HttpException('error', 400));
          done();
        },
      });
    });
  });
});
