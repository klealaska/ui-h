export interface IProductEntitlement {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
  unitOfMeasure: string;
  sourceSystem: string;
}

export interface IProductEntitlementMapped {
  id: string;
  name: string;
  status: 'Active' | 'Deactivated' | 'Dark Launch' | 'Maintenance';
}

export interface IProductEntitlementAssigned extends IProductEntitlementMapped {
  isDisabled: boolean;
}
