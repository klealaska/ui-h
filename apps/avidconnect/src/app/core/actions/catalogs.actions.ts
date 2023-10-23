export class QueryPlatforms {
  static readonly type = '[CatalogsState] QueryPlatforms';
}

export class QueryConnectorsLookup {
  static readonly type = '[CatalogsState] QueryConnectorsLookup';
  constructor(public name: string, public platformId: number = 0, public includeInactive = false) {}
}

export class QueryPlatformOrganizations {
  static readonly type = '[CatalogsState] QueryPlatformOrganizations';
  constructor(public name: string) {}
}

export class GetPlatformOrganizations {
  static readonly type = '[CatalogsState] QueryPlatformOrganizations';
  constructor(public platformId: number) {}
}

export class QueryOrganizationAccountingSystems {
  static readonly type = '[CatalogsState] QueryOrganizationAccountingSystems';
  constructor(
    public organizationId: string,
    public platformId: number,
    public includeInactive = false
  ) {}
}

export class ClearOrganizationAccountingSystems {
  static readonly type = '[CatalogsState] ClearOrganizationAccountingSystems';
}

export class LoadingCatalogsState {
  static readonly type = '[CatalogsState] LoadingCatalogsState';
  constructor(public isLoadingCatalogs: boolean) {}
}
