import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IAddress,
  IEditEntityBody,
  IMappedOrganizationAddress,
} from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private _organizationApiBaseUrl = `${this.configService.get(
    'busHierarchyApiBaseUrl'
  )}/organization`;

  public getOrganization(id: string) {
    return this.httpClient.get(`${this._organizationApiBaseUrl}/${id}`);
  }

  public deactivateOrganization(id: string) {
    return this.httpClient.patch(`${this._organizationApiBaseUrl}/${id}/deactivate`, {});
  }

  public activateOrganization(id: string) {
    return this.httpClient.patch(`${this._organizationApiBaseUrl}/${id}/activate`, {});
  }

  public editOrganization(id: string, body: IEditEntityBody) {
    return this.httpClient.put(`${this._organizationApiBaseUrl}/${id}`, {
      organizationName: body.name,
      organizationCode: body.code,
    });
  }

  public editOrganizationAddress(id: string, body: IAddress) {
    return this.httpClient.put<IMappedOrganizationAddress>(
      `${this._organizationApiBaseUrl}/${id}/address/${body.addressId}`,
      body
    );
  }

  public activateOrganizationAddress(id: string, addressId: string) {
    return this.httpClient.patch(
      `${this._organizationApiBaseUrl}/${id}/address/${addressId}/activate`,
      {}
    );
  }

  public deactivateOrganizationAddress(id: string, addressId: string) {
    return this.httpClient.patch(
      `${this._organizationApiBaseUrl}/${id}/address/${addressId}/deactivate`,
      {}
    );
  }
}
