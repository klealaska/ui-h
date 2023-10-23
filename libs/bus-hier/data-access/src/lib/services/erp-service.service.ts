import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEditEntityBody } from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class ErpService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private _erpApiBaseUrl = `${this.configService.get('busHierarchyApiBaseUrl')}/erp`;

  public getErpById(id: string) {
    return this.httpClient.get(`${this._erpApiBaseUrl}/${id}`);
  }

  public activateErp(id: string) {
    return this.httpClient.patch(`${this._erpApiBaseUrl}/${id}/activate`, {});
  }

  public deactivateErp(id: string) {
    return this.httpClient.patch(`${this._erpApiBaseUrl}/${id}/deactivate`, {});
  }

  public editERP(id: string, body: IEditEntityBody) {
    return this.httpClient.put(`${this._erpApiBaseUrl}/${id}`, {
      erpName: body.name,
      erpCode: body.code,
    });
  }
}
