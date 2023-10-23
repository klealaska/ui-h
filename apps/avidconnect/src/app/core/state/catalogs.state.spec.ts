import { of, throwError } from 'rxjs';
import {
  connectorServiceStub,
  connectorStub,
  organizationAccountingSystemsStub,
  organizationOptionStub,
  organizationStub,
  platformDataServiceStub,
  platformServiceStub,
  platformStub,
  stateContextStub,
} from '../../../test/test-stubs';
import { CatalogsState } from './catalogs.state';

describe('CatalogsState', () => {
  const catalogsState = new CatalogsState(
    platformServiceStub as any,
    connectorServiceStub as any,
    platformDataServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    const CatalogsStateStub = {
      platforms: [platformStub],
      organizations: [organizationStub],
      organizationOptions: [organizationOptionStub],
      connectorLookup: [connectorStub],
      organizationAccountingSystems: [organizationAccountingSystemsStub],
      isLoadingCatalogs: false,
    };
    it('should select platforms from state', () =>
      expect(CatalogsState.platforms(CatalogsStateStub as any)).toBe(CatalogsStateStub.platforms));

    it('should select organizations from state', () =>
      expect(CatalogsState.organizations(CatalogsStateStub as any)).toBe(
        CatalogsStateStub.organizations
      ));

    it('should select organizationOptions from state', () =>
      expect(CatalogsState.organizationOptions(CatalogsStateStub as any)).toBe(
        CatalogsStateStub.organizationOptions
      ));

    it('should select organizationAccountingSystems from state', () =>
      expect(CatalogsState.organizationAccountingSystems(CatalogsStateStub as any)).toBe(
        CatalogsStateStub.organizationAccountingSystems
      ));

    it('should select connectorLookup from state', () =>
      expect(CatalogsState.connectorLookup(CatalogsStateStub as any)).toBe(
        CatalogsStateStub.connectorLookup
      ));

    it('should select isLoadingCatalogs from state', () =>
      expect(CatalogsState.isLoadingCatalogs(CatalogsStateStub as any)).toBe(
        CatalogsStateStub.isLoadingCatalogs
      ));
  });

  describe('Action: QueryPlatforms', () => {
    const platforms = [platformStub];
    describe('when getAll returns data', () => {
      beforeEach(() => {
        platformServiceStub.getAll.mockReturnValue(of({ items: platforms }));
        catalogsState.queryPlatforms(stateContextStub).subscribe();
      });

      it('should patchState platforms with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { platforms }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        platformServiceStub.getAll.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState platforms with empty array', () => {
        catalogsState.queryPlatforms(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { platforms: [] });
          }
        );
      });
    });
  });

  describe('Action: QueryConnectorsLookup', () => {
    const connectorLookup = [connectorStub];
    describe('when getAll returns data', () => {
      beforeEach(() => {
        connectorServiceStub.search.mockReturnValue(of({ items: connectorLookup }));
        catalogsState
          .queryConnectorsLookup(stateContextStub, {
            name: 'test',
            platformId: 0,
            includeInactive: false,
          })
          .subscribe();
      });

      it('should patchState connectorLookup with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { connectorLookup }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        connectorServiceStub.search.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState connectorSummary with empty array', () => {
        catalogsState
          .queryConnectorsLookup(stateContextStub, {
            name: 'test',
            platformId: 0,
            includeInactive: false,
          })
          .subscribe(
            () => {
              return;
            },
            () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                connectorSummary: [],
              });
            }
          );
      });
    });
  });

  describe('Action: QueryPlatformOrganizations', () => {
    describe('when search returns data', () => {
      beforeEach(() => {
        jest
          .spyOn(stateContextStub, 'getState')
          .mockReturnValue({ organizations: [organizationStub] });
        catalogsState.queryPlatformOrganizations(stateContextStub, { name: 'Associates' });
      });

      it('should patchState organizationOptions with data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          organizationOptions: [organizationOptionStub],
        }));
    });
  });

  describe('Action: GetPlatformOrganizations', () => {
    const organizations = [organizationStub];
    describe('when search returns data', () => {
      beforeEach(() => {
        platformDataServiceStub.searchOrganizations.mockReturnValue(of({ items: organizations }));
        jest.spyOn(stateContextStub, 'getState').mockReturnValue({ organizations: [] });
        catalogsState.getPlatformOrganizations(stateContextStub, { platformId: 1 }).subscribe();
      });

      it('should patchState organizations with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { organizations }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        platformDataServiceStub.searchOrganizations.mockReturnValue(
          throwError({ errorCode: '404' })
        );
        jest.spyOn(stateContextStub, 'getState').mockReturnValue({ organizations: [] });
      });

      it('should patchState organizations with empty array', () => {
        catalogsState.getPlatformOrganizations(stateContextStub, { platformId: 1 }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              organizations: [],
            });
          }
        );
      });
    });
  });

  describe('Action: QueryOrganizationAccountingSystems', () => {
    const organizationAccountingSystems = [organizationAccountingSystemsStub];
    describe('when getOrganizationAccountingSystems returns data', () => {
      beforeEach(() => {
        platformDataServiceStub.getOrganizationAccountingSystems.mockReturnValue(
          of({ items: organizationAccountingSystems })
        );
        catalogsState
          .queryOrganizationAccountingSystems(stateContextStub, {
            organizationId: '00001',
            platformId: 1,
            includeInactive: false,
          })
          .subscribe();
      });

      it('should patchState organizations with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          organizationAccountingSystems,
        }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        platformDataServiceStub.getOrganizationAccountingSystems.mockReturnValue(
          throwError({ errorCode: '404' })
        );
      });

      it('should patchState organizations with empty array', () => {
        catalogsState
          .queryOrganizationAccountingSystems(stateContextStub, {
            organizationId: '00001',
            platformId: 1,
            includeInactive: false,
          })
          .subscribe(
            () => {
              return;
            },
            () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                organizationAccountingSystems: [],
              });
            }
          );
      });
    });
  });

  describe('Action: LoadingCatalogsState', () => {
    beforeEach(() => {
      catalogsState.loadingCatalogsState(stateContextStub, {
        isLoadingCatalogs: true,
      });
    });

    it('should patchState isLoadingCatalogs with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoadingCatalogs: true,
      }));
  });

  describe('Action: ClearOrganizationAccountingSystems', () => {
    beforeEach(() => {
      catalogsState.clearOrganizationAccountingSystems(stateContextStub);
    });

    it('should patchState organizationAccountingSystems with an empty array value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        organizationAccountingSystems: [],
      }));
  });
});
