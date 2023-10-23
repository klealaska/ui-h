import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { httpConfig } from './models';
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
  constructor(@Inject(MOCK_ENV) private mockEnv: boolean, private configService: ConfigService) {}

  private baseUrl = this.configService.get('TENANT_BASE_URL');
  private entitlementBaseUrl = this.configService.get('TENANT_PRODUCT_ENTITLEMENT_BASE_URL');
  private tenantUrl = `${this.baseUrl}/tenants`;
  private entitlementUrl = `${this.entitlementBaseUrl}/productentitlements`;

  // Tenant endpoints
  public getTenant(): string {
    const config: httpConfig = {
      path: this.tenantUrl,
      localPath: '/get-tenant.json',
    };
    return this.getPath(config);
  }

  public getTenantById(id: string): string {
    const config: httpConfig = {
      path: `${this.tenantUrl}/${id}`,
      localPath: '/get-tenant-by-id.json',
    };
    return this.getPath(config);
  }

  public postTenant(): string {
    const config: httpConfig = {
      path: this.tenantUrl,
      localPath: '/post-tenant.json',
    };
    return this.getPath(config);
  }

  public updateTenant(id: string): string {
    const config: httpConfig = {
      path: `${this.tenantUrl}/${id}`,
      localPath: '/update-tenant.json',
    };
    return this.getPath(config);
  }

  // Entitlement endpoints
  public getProductEntitlements(): string {
    const config: httpConfig = {
      path: this.entitlementUrl,
      localPath: '/get-product-entitlements.json',
    };
    return this.getPath(config);
  }

  public getProductEntitlementsByTenantId(id: string): string {
    const config: httpConfig = {
      path: `${this.entitlementUrl}/tenants/${id}`,
      localPath: '/get-product-entitlements-by-tenant-id.json',
    };
    return this.getPath(config);
  }

  public postProductEntitlementByTenantId(productentitlementId: string, tenantId: string): string {
    const config: httpConfig = {
      path: `${this.entitlementUrl}/${productentitlementId}/tenants/${tenantId}`,
      localPath: '/post-product-entitlement-by-tenant-id.json',
    };
    return this.getPath(config);
  }

  public activateTenantEntitlement(productEntitlementId: string, tenantId: string): string {
    const config: httpConfig = {
      path: `${this.entitlementUrl}/${productEntitlementId}/tenants/${tenantId}/activate`,
      localPath: '/patch-product-entitlements.json',
    };
    return this.getPath(config);
  }

  public deactivateTenantEntitlement(productEntitlementId: string, tenantId: string): string {
    const config: httpConfig = {
      path: `${this.entitlementUrl}/${productEntitlementId}/tenants/${tenantId}/deactivate`,
      localPath: '/patch-product-entitlements.json',
    };
    return this.getPath(config);
  }

  private getPath(config: httpConfig): string {
    return config[this.mockEnv ? 'localPath' : 'path'];
  }
}
