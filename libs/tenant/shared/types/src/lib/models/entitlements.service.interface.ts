import { Observable } from 'rxjs';
import { IProductEntitlementMapped } from './product-entitlement.interface';
import { ITenantEntitlementMapped } from './tenant-entitlement-mapped.interface';

export interface IEntitlementsService {
  getEntitlementsData(): Observable<IProductEntitlementMapped[]>;
  getEntitlementsByTenantId(id: string): Observable<ITenantEntitlementMapped[]>;
}
