export interface IProductEntitlementAPI {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
  unit_of_measure: string;
  source_system: string;
}
