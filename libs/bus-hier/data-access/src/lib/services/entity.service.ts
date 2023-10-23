import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAddress,
  IEditEntityBody,
  IMappedEntity,
  IMappedEntityAddress,
} from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { IMappedEntitiesResponse } from '@ui-coe/bus-hier/shared/types';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private _entityApiBaseUrl = `${this.configService.get('busHierarchyApiBaseUrl')}/entity`;

  public getEntityById(id: string): Observable<IMappedEntity> {
    return this.httpClient.get<IMappedEntity>(`${this._entityApiBaseUrl}/${id}`);
  }

  public getEntities(
    erpId: string,
    level: number,
    parentEntityId: string
  ): Observable<IMappedEntitiesResponse> {
    const httpParams: HttpParams = new HttpParams().set('limit', '100');
    //* if we have a parentEntityId
    //* then an entity has been selected in a parent tree node
    //* therefore we need to make a call to get only the children
    //* at a given child level for that entity
    //* else we need to get all entities at a given business level
    const url = parentEntityId
      ? `${this._entityApiBaseUrl}/${parentEntityId}/erp/${erpId}/child-level/${level}`
      : `${this._entityApiBaseUrl}/erp/${erpId}/business-level/${level}`;
    return this.httpClient.get<IMappedEntitiesResponse>(url, {
      params: httpParams,
    });
  }

  public editEntity(id: string, body: IEditEntityBody) {
    return this.httpClient.put(`${this._entityApiBaseUrl}/${id}`, {
      entityName: body.name,
      entityCode: body.code,
    });
  }

  public activeEntity(id: string) {
    return this.httpClient.patch(`${this._entityApiBaseUrl}/${id}/activate`, {});
  }

  public deactiveEntity(id: string) {
    return this.httpClient.patch(`${this._entityApiBaseUrl}/${id}/deactivate`, {});
  }

  public deactiveEntityAddress(id: string, addressId: string) {
    return this.httpClient.patch(
      `${this._entityApiBaseUrl}/${id}/address/${addressId}/deactivate`,
      {}
    );
  }

  public activeEntityAddress(id: string, addressId: string) {
    return this.httpClient.patch(
      `${this._entityApiBaseUrl}/${id}/address/${addressId}/activate`,
      {}
    );
  }

  public editEntityAddress(id: string, body: IAddress) {
    return this.httpClient.put<IMappedEntityAddress>(
      `${this._entityApiBaseUrl}/${id}/address/${body.addressId}`,
      body
    );
  }
}
