import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  constructor(@Inject(MOCK_ENV) private mockEnv: boolean, private configService: ConfigService) {}

  private baseUrl = `${this.configService.get('ACCOUNTING_BASE_URL')}/accounting`;
  private erpUrl = `${this.baseUrl}/erp`;
  private organizationUrl = `${this.baseUrl}/organization`;
  private businessLevelUrl = `${this.baseUrl}/business-level`;
  private entityUrl = `${this.baseUrl}/entity`;
  private businessHierarchyUrl = `${this.baseUrl}/business-hierarchy`;

  private getPath(config: httpConfig): string {
    return config[this.mockEnv ? 'localPath' : 'path'];
  }

  // ERP endpoints
  public getErps(orgId: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/organization/${orgId}`,
      localPath: `/get-erps-${orgId}.json`,
    };

    return this.getPath(config);
  }

  public getErpById(id: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/${id}`,
      localPath: '/get-erp-by-id.json',
    };

    return this.getPath(config);
  }

  public updateErp(id: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/${id}`,
      localPath: '/update-erp.json',
    };

    return this.getPath(config);
  }

  public activateErp(id: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/${id}/activate`,
      localPath: '/patch-erp.json',
    };

    return this.getPath(config);
  }

  public deactivateErp(id: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/${id}/deactivate`,
      localPath: '/patch-erp.json',
    };

    return this.getPath(config);
  }

  // organization endpoints
  public createOrganization(): string {
    const config: httpConfig = {
      path: this.organizationUrl,
      localPath: '/create-organization.json',
    };

    return this.getPath(config);
  }

  public getOrganizations(): string {
    const config: httpConfig = {
      path: this.organizationUrl,
      localPath: '/get-organizations.json',
    };

    return this.getPath(config);
  }

  public getOrganizationById(id: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${id}`,
      localPath: '/get-organization-by-id.json',
    };

    return this.getPath(config);
  }

  public updateOrganization(id: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${id}`,
      localPath: '/update-organization.json',
    };

    return this.getPath(config);
  }

  public deactivateOrganization(id: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${id}/deactivate`,
      localPath: '/patch-organization.json',
    };

    return this.getPath(config);
  }

  public activateOrganization(id: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${id}/activate`,
      localPath: '/patch-organization.json',
    };

    return this.getPath(config);
  }

  public updateOrganizationAddress(orgId: string, addressId: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${orgId}/address/${addressId}`,
      localPath: '/update-organization-address.json',
    };

    return this.getPath(config);
  }

  public activateOrganizationAddress(orgId: string, addressId: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${orgId}/address/${addressId}/activate`,
      localPath: '/patch-organization.json',
    };

    return this.getPath(config);
  }

  public deactivateOrganizationAddress(orgId: string, addressId: string): string {
    const config: httpConfig = {
      path: `${this.organizationUrl}/${orgId}/address/${addressId}/deactivate`,
      localPath: '/patch-organization.json',
    };

    return this.getPath(config);
  }

  // Entity endpoints
  public getEntitiesByErpId(erpId: string) {
    const config = {
      path: `${this.entityUrl}/erp/${erpId}`,
      localPath: '/get-entities-by-erp-id.json',
    };

    return this.getPath(config);
  }

  public getEntityByEntityId(entityId: string) {
    const config = {
      path: `${this.entityUrl}/${entityId}`,
      localPath: `/get-entity-by-entity-id-${entityId}.json`,
    };

    return this.getPath(config);
  }

  public getEntitiesByBusinessLevel(erpId: string, businessLevel: string) {
    const config = {
      path: `${this.entityUrl}/erp/${erpId}/business-level/${businessLevel}`,
      localPath: '/get-entities-by-business-level.json',
    };

    return this.getPath(config);
  }

  public getChildEntitiesByChildLevel(entityId: string, erpId: string, childLevel: string) {
    const config = {
      path: `${this.entityUrl}/${entityId}/erp/${erpId}/child-level/${childLevel}`,
      localPath: `/get-child-entities-by-child-level-${entityId}-${childLevel}.json`,
    };

    return this.getPath(config);
  }

  public getAllChildEntities(entityId: string, erpId: string) {
    const config = {
      path: `${this.entityUrl}/${entityId}/erp/${erpId}/all-children`,
      localPath: `/get-all-child-entities-${entityId}.json`,
    };

    return this.getPath(config);
  }

  public updateEntity(entityId: string): string {
    const config: httpConfig = {
      path: `${this.entityUrl}/${entityId}`,
      localPath: '/update-entity.json',
    };

    return this.getPath(config);
  }

  public activateEntity(entityId: string): string {
    const config: httpConfig = {
      path: `${this.entityUrl}/${entityId}/activate`,
      localPath: '/patch-entity.json',
    };

    return this.getPath(config);
  }

  public deactivateEntity(entityId: string): string {
    const config: httpConfig = {
      path: `${this.entityUrl}/${entityId}/deactivate`,
      localPath: '/patch-entity.json',
    };

    return this.getPath(config);
  }

  public updateEntityAddress(entityId: string, addressId: string): string {
    const config: httpConfig = {
      path: `${this.entityUrl}/${entityId}/address/${addressId}`,
      localPath: '/update-entity-address.json',
    };

    return this.getPath(config);
  }

  public activateEntityAddress(entityId: string, addressId: string): string {
    const config: httpConfig = {
      path: `${this.entityUrl}/${entityId}/address/${addressId}/activate`,
      localPath: '/patch-entity.json',
    };

    return this.getPath(config);
  }

  public deactivateEntityAddress(entityId: string, addressId: string): string {
    const config: httpConfig = {
      path: `${this.entityUrl}/${entityId}/address/${addressId}/deactivate`,
      localPath: '/patch-entity.json',
    };

    return this.getPath(config);
  }

  //business hierarchy
  getBusinessHierarchyCount(): string {
    const config: httpConfig = {
      path: `${this.businessHierarchyUrl}/counts`,
      localPath: `/get-business-hierarchy-count.json`,
    };
    return this.getPath(config);
  }

  //Business-Level endpoints
  public getBuisnessLevelByErpId(erpId: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/${erpId}/business-level`,
      localPath: '/get-business-levels-by-erp-id.json',
    };
    return this.getPath(config);
  }

  public createBusinessLevel(erpId: string): string {
    const config: httpConfig = {
      path: `${this.erpUrl}/${erpId}/business-level`,
      localPath: '/create-business-level.json',
    };
    return this.getPath(config);
  }

  public getBusinessLevel(businessLevelId: string): string {
    const config: httpConfig = {
      path: `${this.businessLevelUrl}/${businessLevelId}`,
      localPath: '/get-business-level-by-id.json',
    };
    return this.getPath(config);
  }

  public updateBusinessLevel(businessLevelId: string): string {
    const config: httpConfig = {
      path: `${this.businessLevelUrl}/${businessLevelId}`,
      localPath: '/update-business-level.json',
    };
    return this.getPath(config);
  }
}
