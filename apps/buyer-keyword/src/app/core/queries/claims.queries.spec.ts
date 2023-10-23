import { TestBed } from '@angular/core/testing';
import { UserPermissions } from '../../shared/enums';
import { ClaimsQueries } from './claims.queries';

describe('ClaimsQueries', () => {
  let queries: ClaimsQueries;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimsQueries],
    });
    queries = TestBed.inject(ClaimsQueries);
  });

  it('should be created', () => {
    expect(queries).toBeTruthy();
  });

  describe('canViewMassVoid', () => {
    describe('when roles has portalAdmin', () => {
      it('should set canViewMassVoid to true', () =>
        expect(ClaimsQueries.canViewMassVoid([UserPermissions.PortalAdmin])).toBeTruthy());
    });

    describe('when roles has engineer', () => {
      it('should set canViewMassVoid to true', () =>
        expect(ClaimsQueries.canViewMassVoid([UserPermissions.Engineering])).toBeTruthy());
    });

    describe('when roles does not has any role', () => {
      it('should set canViewMassVoid to false', () =>
        expect(
          ClaimsQueries.canViewMassVoid([UserPermissions.IndexingSponsorManager])
        ).toBeFalsy());
    });

    describe('when engineer role has spaces', () => {
      it('should set canViewMassVoid to true', () =>
        expect(ClaimsQueries.canViewMassVoid([` ${UserPermissions.Engineering} `])).toBeTruthy());
    });
  });

  describe('canViewAttributeFunctions', () => {
    describe('when roles has portalAdmin', () => {
      it('should set canViewAttributeFunctions to true', () =>
        expect(
          ClaimsQueries.canViewAttributeFunctions([UserPermissions.CustomerCareLeadership])
        ).toBeTruthy());
    });

    describe('when roles has engineer', () => {
      it('should set canViewAttributeFunctions to true', () =>
        expect(
          ClaimsQueries.canViewAttributeFunctions([UserPermissions.Engineering])
        ).toBeTruthy());
    });

    describe('when roles has PortalAdmin', () => {
      it('should set canViewAttributeFunctions to false', () =>
        expect(ClaimsQueries.canViewAttributeFunctions([UserPermissions.PortalAdmin])).toBeFalsy());
    });

    describe('when engineer role has spaces', () => {
      it('should set canViewAttributeFunctions to true', () =>
        expect(
          ClaimsQueries.canViewAttributeFunctions([` ${UserPermissions.Engineering} `])
        ).toBeTruthy());
    });
  });

  describe('canViewThreshold', () => {
    describe('when roles has portalAdmin', () => {
      it('should set canViewThreshold to true', () =>
        expect(ClaimsQueries.canViewThreshold([UserPermissions.Engineering])).toBeTruthy());
    });

    describe('when roles has sponsorManager', () => {
      it('should set canViewThreshold to true', () =>
        expect(
          ClaimsQueries.canViewThreshold([UserPermissions.IndexingSponsorManager])
        ).toBeTruthy());
    });

    describe('when roles does not has any role', () => {
      it('should set canViewThreshold to false', () =>
        expect(ClaimsQueries.canViewThreshold([UserPermissions.PortalAdmin])).toBeFalsy());
    });

    describe('when engineer role has spaces', () => {
      it('should set canViewThreshold to true', () =>
        expect(ClaimsQueries.canViewThreshold([` ${UserPermissions.Engineering} `])).toBeTruthy());
    });
  });

  describe('canViewBuyerGoLive', () => {
    describe('when roles has portalAdmin', () => {
      it('should set canViewBuyerGoLive to true', () =>
        expect(ClaimsQueries.canViewBuyerGoLive([UserPermissions.PortalAdmin])).toBeTruthy());
    });

    describe('when roles has sponsorManager', () => {
      it('should set canViewBuyerGoLive to true', () =>
        expect(ClaimsQueries.canViewBuyerGoLive([UserPermissions.Engineering])).toBeTruthy());
    });

    describe('when roles has sponsorManager', () => {
      it('should set canViewBuyerGoLive to true', () =>
        expect(
          ClaimsQueries.canViewBuyerGoLive([UserPermissions.CustomerCareLeadership])
        ).toBeTruthy());
    });

    describe('when roles does not has any role', () => {
      it('should set canViewBuyerGoLive to false', () =>
        expect(
          ClaimsQueries.canViewBuyerGoLive([UserPermissions.IndexingSponsorManager])
        ).toBeFalsy());
    });

    describe('when engineer role has spaces', () => {
      it('should set canViewBuyerGoLive to true', () =>
        expect(
          ClaimsQueries.canViewBuyerGoLive([` ${UserPermissions.Engineering} `])
        ).toBeTruthy());
    });
  });
});
