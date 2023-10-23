import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getConfig() {
    return {
      config: {
        env: this.config.get('ENVIRONMENT'),
        baseUrl: this.config.get('TENANT_BASE_URL'),
      },
    };
  }
}
