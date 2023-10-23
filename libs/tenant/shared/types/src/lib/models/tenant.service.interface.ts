import { Observable } from 'rxjs';
import { ICreateTenant } from './create-tenant.interface';
import { IGetTenant } from './get-tenant.interface';
import { ITenant, ITenantMapped } from './tenant.interface';

export interface ITenantService {
  getTenantData(): Observable<IGetTenant<ITenantMapped>>;
  getTenantById(id: string): Observable<ITenant>;
  postTenantData(body: ICreateTenant): Observable<ITenant>;
}
