export enum UserRoles {
  PortalAdmin = 'PortalAdmin',
  CustomerCareLeadership = 'CustomerCareLeadership',
  Engineering = 'Engineering',
  IndexingSponsorManager = 'IndexingSponsorManager',
}

export const UserPermissions = {
  ...UserRoles,
};
