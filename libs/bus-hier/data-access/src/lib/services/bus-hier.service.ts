import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IGetTree,
  IOrgsErpsTreeMapped,
  IRequest,
  ITreeMapped,
} from '@ui-coe/bus-hier/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class BusHierService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}
  private _baseUrl = `${this.configService.get('busHierarchyApiBaseUrl')}`;

  public getTree(params: IRequest<IGetTree>): Observable<ITreeMapped> {
    let httpParams: HttpParams = new HttpParams({ fromObject: { ...params.payload } });

    if (!params.payload.entityId) {
      httpParams = httpParams.delete('entityId');
    }

    return this.httpClient.get<ITreeMapped>(`${this._baseUrl}/business-hierarchy/navigation`, {
      params: httpParams,
    });
  }

  public getOrgsAndErps(): Observable<IOrgsErpsTreeMapped> {
    return this.httpClient.get<IOrgsErpsTreeMapped>(`${this._baseUrl}/business-hierarchy/list`);
  }
}
