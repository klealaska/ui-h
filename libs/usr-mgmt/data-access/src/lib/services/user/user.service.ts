import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IListWrapper } from '@ui-coe/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { ICreateEditUser, IUser, UserLifecycleOperations } from '@ui-coe/usr-mgmt/shared/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private configService: ConfigService, private readonly httpClient: HttpClient) {}

  private readonly _usrMgmtApiBaseUrl = `${this.configService.get('usrMgmtApiBaseUrl')}/users`;

  public getUsers(): Observable<IListWrapper<IUser>> {
    return this.httpClient.get<IListWrapper<IUser>>(this._usrMgmtApiBaseUrl);
  }

  public createUser(body: ICreateEditUser): Observable<IUser> {
    return this.httpClient.post<IUser>(this._usrMgmtApiBaseUrl, body);
  }

  public editUser(id: string, body: ICreateEditUser): Observable<IUser> {
    return this.httpClient.patch<IUser>(`${this._usrMgmtApiBaseUrl}/${id}`, body);
  }
  public deactivateUser(userId: string): Observable<IUser> {
    return this.httpClient.post<IUser>(
      `${this._usrMgmtApiBaseUrl}/${userId}/lifecycle-operations`,
      {
        name: UserLifecycleOperations.DEACTIVATE,
      }
    );
  }
}
