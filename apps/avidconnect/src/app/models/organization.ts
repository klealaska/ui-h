export interface Organization {
  id: number;
  isActive: boolean;
  name: string;
}

export interface OrganizationAccountingSystem {
  id: number;
  isActive: boolean;
  isEnrolled: boolean;
  name: string;
  organizationId: number;
  organizationName: string;
}

export interface OrganizationOption {
  name: string;
  displayName: string;
  id: number;
}
