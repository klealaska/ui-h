import { Inject, Injectable } from '@nestjs/common';
import { httpConfig } from '../app/models/http-config.model';
import { MOCK_ENV } from '../app/shared';

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
  constructor(@Inject(MOCK_ENV) private mockEnv: boolean) {}

  public getPayments(): string {
    return this.getPath({
      // path: 'add real service endpoint when available',
      localPath: '/payment-list.json',
    });
  }

  public getPath(config: httpConfig): string {
    return config[this.mockEnv ? 'localPath' : 'path'];
  }
}
