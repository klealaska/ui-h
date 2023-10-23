import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private http: HttpService, private configService: ConfigService) {}
  async getProducts(locale = 'en') {
    const cmsBaseUrl = this.configService.get('CMS_URL');
    const authToken = this.configService.get('CMS_AUTH_TOKEN');
    const response = this.http.get(`${cmsBaseUrl}/products?locale=${locale}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return await response.pipe(map(data => data.data));
  }

  async getDetails(content, locale = 'en') {
    const cmsBaseUrl = this.configService.get('CMS_URL');
    const authToken = this.configService.get('CMS_AUTH_TOKEN');
    const response = this.http.get(`${cmsBaseUrl}/${content}?locale=${locale}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return await response.pipe(map(data => data.data));
  }

  async getProductsById(productId: string, locale: string) {
    const cmsBaseUrl = this.configService.get('CMS_URL');
    const authToken = this.configService.get('CMS_AUTH_TOKEN');
    const response = this.http.get(`${cmsBaseUrl}/products/${productId}?localle=${locale}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return await response.pipe(map(data => data.data));
  }
}
