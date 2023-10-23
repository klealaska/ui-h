import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IHttpConfig } from '../app/models/http-config.model';
import { MOCK_ENV } from '../app/shared';
import { getUnmaskedAccountNumber } from '@ui-coe/bank-account-mgmt/details/data-access';

/**
 * HttpConfigService
 * @description A service that will contain httpConfig objects
 * that hold the remote and local URL's to the appropriate resource
 * the `path` property contains the remote URL
 * the `localPath` property contains the relative path, extending the provided 'MOCK_FILE_PATH',
 * to the local mock json file.
 * 'MOCK_ENV' needs to be provided representing a boolean that indicates if the app is run in mock or not
 */
@Injectable()
export class HttpConfigService {
  constructor(@Inject(MOCK_ENV) private _mockEnv: boolean, private configService: ConfigService) {}
  private baseUrl = this.configService.get('BAM_BASE_URL');
  private bankAccountUrl = `${this.baseUrl}/accounts`;

  public getBankAccounts(): string {
    return this.getPath({
      path: this.bankAccountUrl,
      localPath: '/bank-account-list.json',
      // mockOnly: false,
    });
  }

  public getBankAccountById(): string {
    return this.getPath({
      path: this.bankAccountUrl,
      localPath: '/bank-account-detail.json',
      // mockOnly: false,
    });
  }

  public postBankAccount(): string {
    return this.getPath({
      path: this.bankAccountUrl,
      localPath: '/bank-account-detail.json',
      // mockOnly: false,
    });
  }

  public updateBankAccount(): string {
    return this.getPath({
      path: this.bankAccountUrl,
      localPath: '/bank-account-detail.json',
      // mockOnly: false,
    });
  }

  public getUnmaskedAccountNumber(): string {
    return this.getPath({
      path: this.bankAccountUrl,
      localPath: '/bank-account-list.json',
      // mockOnly: false,
    });
  }

  public updateStatus(): string {
    return this.getPath({
      path: this.bankAccountUrl,
      localPath: '/bank-account-detail.json',
      // mockOnly: false,
    });
  }

  // ToDo: Update IHttpConfig to uncomment 'path' prop when we have real services
  private getPath(config: IHttpConfig): string {
    // const useMock = this._mockEnv || config.mockOnly;
    return config[this._mockEnv ? 'localPath' : 'path'];
  }
}
