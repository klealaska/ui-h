import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBusinessLevelDetails, IEditBusinessLevelName } from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessLevelService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}
  private _baseUrl = `${this.configService.get('busHierarchyApiBaseUrl')}/business-level`;

  public updateBusinessLevelName(
    params: IEditBusinessLevelName
  ): Observable<IBusinessLevelDetails> {
    return this.httpClient.put<IBusinessLevelDetails>(
      `${this._baseUrl}/${params.businessLevelId}`,
      params.body
    );
  }
}
