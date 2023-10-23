export enum UserDocumentPermissions {
  AdvancedFilter = 'uq.af',
  CustomerFilter = 'uq.cf',
  Upload = 'inv.ul',
  Download = 'inv.dl',
  SwapImage = 'inv.si',
  CanCreateAccount = 'adm.sa',
  EditWorkflow = 'inv.wf',
  CanViewNavigationBar = 'nav.sb',
}

export enum UserAdminPermissions {
  CanCreateUser = 'CanCreateUser', // N/A right now
  CanManageRoles = 'CanManageRoles', // N/A right now
  CanViewAdmin = 'CanViewAdmin', // N/A right now
  SponsorUser = 'adm.su',
}

export enum UserMarkAsPermissions {
  DataException = 'inv.de',
  ScanningOps = 'inv.so',
  DuplicateResearch = 'inv.dr',
  ImageIssue = 'inv.ii',
  NonInvoiceDocument = 'inv.ni',
  RecycleBinMarkAs = 'inv.rb',
  ShipToResearch = 'inv.st',
  SupplierResearch = 'inv.sr',
  IndexerQa = 'inv.iq',
  IndexingOps = 'inv.io',
}

export enum UserQueuePermissions {
  Dashboard = 'uq.db',
  Pending = 'uq.pp',
  Research = 'uq.rq',
  RecycleBin = 'uq.rb',
  Archive = 'uq.aq',
  Reports = 'uq.rp',
}

export enum UserRoles {
  InternalOps = 'SponsorMgr',
  Indexer = 'SponsorUsers',
  Manager = 'ABS Training and Leads',
  QualityControl = 'Quality Control',
  Customer = 'Customer',
  UploadAndSubmit = 'Inbox - Upload & Submit',
  GlobalExceptionManager = 'Inbox - Global Exception Manager',
  AllPerms = 'Inbox - All',
}

export const UserPermissions = {
  ...UserQueuePermissions,
  ...UserAdminPermissions,
  ...UserDocumentPermissions,
  ...UserMarkAsPermissions,
};
