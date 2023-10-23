import { TestBed } from '@angular/core/testing';
import {
  getBuyersStub,
  hasAllTheClaimsTokenStub,
  noPendingQueueClaim,
  pendingQueueAndDashboardClaimsTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentCardText, SecurityAttributes } from '@ui-coe/avidcapture/shared/types';

import { CoreSelectors } from './core.selectors';

describe('CoreSelectors', () => {
  let selector: CoreSelectors;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSelectors],
    });
    selector = TestBed.inject(CoreSelectors);
  });

  it('should be created', () => {
    expect(selector).toBeTruthy();
  });

  it('should select userDisplayName from state via userAccount', () => {
    expect(CoreSelectors.userDisplayName({ userAccount: { name: 'mock' } } as any)).toBe('Mock');
  });

  it('should select userDisplayName from state via userAccount and Pascal case each name', () => {
    expect(CoreSelectors.userDisplayName({ userAccount: { name: 'MOCK TEST' } } as any)).toBe(
      'Mock Test'
    );
  });

  it('should select userDisplayName from state via userAccount and Pascal case each name', () => {
    expect(CoreSelectors.userDisplayName({ userAccount: { name: 'mock VAN TESTer' } } as any)).toBe(
      'Mock Van Tester'
    );
  });

  it('should select currentUsername via userName from state when okta is NOT active', () => {
    expect(
      CoreSelectors.currentUsername({ userAccount: { preferred_username: 'mock' } } as any)
    ).toBe('mock');
  });

  it('should set undefined for currentUsername when userAccount is null', () => {
    expect(CoreSelectors.currentUsername({ userAccount: null } as any)).toBeUndefined();
  });

  it('should select isLoading from state', () =>
    expect(CoreSelectors.isLoading({ isLoading: false } as any)).toBeFalsy());

  it('should select documentCount from state', () =>
    expect(CoreSelectors.pendingDocumentCount({ documentCount: 1 } as any)).toBe(1));

  it('should set documentCount to 0 when document count is less than 0', () =>
    expect(CoreSelectors.pendingDocumentCount({ documentCount: -1 } as any)).toBe(0));

  it('should select escalationCount from state', () =>
    expect(CoreSelectors.researchDocumentCount({ escalationCount: 1 } as any)).toBe(1));

  it('should set escalationCount to 0 when escalation document count is less than 0', () =>
    expect(CoreSelectors.researchDocumentCount({ escalationCount: -1 } as any)).toBe(0));

  it('should select myUploadsCount from state', () =>
    expect(CoreSelectors.myUploadsDocumentCount({ myUploadsCount: 1 } as any)).toBe(1));

  it('should select recycleBinCount from state', () =>
    expect(CoreSelectors.recycleBinDocumentCount({ recycleBinCount: 1 } as any)).toBe(1));

  it('should set myUploadsCount to 0 when uploads document count is less than 0', () =>
    expect(CoreSelectors.myUploadsDocumentCount({ myUploadsCount: -1 } as any)).toBe(0));

  it('should return an empty array for documentCards when token is NULL', () => {
    expect(
      CoreSelectors.documentCards({
        token: null,
      } as any)
    ).toEqual([]);
  });

  it('should return an array of document cards with escalationCount, buyerCount, & documentCount', () => {
    const expectedValue = [
      {
        count: 24,
        text: DocumentCardText.TotalInvoices,
        icon: 'description',
      },
      {
        count: 1,
        text: DocumentCardText.Escalations,
        icon: 'warning',
      },
      {
        count: 1,
        text: DocumentCardText.Customers,
        icon: 'group',
      },
    ];

    expect(
      CoreSelectors.documentCards({
        escalationCount: 1,
        buyerCount: 1,
        documentCount: 24,
        token: hasAllTheClaimsTokenStub,
      } as any)
    ).toEqual(expectedValue);
  });

  it('should not return documentCount when user is missing PendingQueue claim', () => {
    const expectedValue = [
      {
        count: 1,
        text: DocumentCardText.Escalations,
        icon: 'warning',
      },
    ];

    expect(
      CoreSelectors.documentCards({
        escalationCount: 1,
        buyerCount: 1,
        token: noPendingQueueClaim,
      } as any)
    ).toEqual(expectedValue);
  });

  it('should exclude customer count if user is a customer user', () => {
    const expectedValue = [
      {
        count: 24,
        text: DocumentCardText.TotalInvoices,
        icon: 'description',
      },
      {
        count: 1,
        text: DocumentCardText.Escalations,
        icon: 'warning',
      },
    ];

    expect(
      CoreSelectors.documentCards({
        buyerCount: 1,
        documentCount: 24,
        escalationCount: 1,
        token: pendingQueueAndDashboardClaimsTokenStub,
      } as any)
    ).toEqual(expectedValue);
  });

  it('should show customer count if user is a customer user', () => {
    const expectedValue = [
      {
        count: 24,
        text: DocumentCardText.TotalInvoices,
        icon: 'description',
      },
      {
        count: 1,
        icon: 'warning',
        text: 'Research',
      },
      {
        count: 1,
        text: DocumentCardText.Customers,
        icon: 'group',
      },
    ];

    expect(
      CoreSelectors.documentCards({
        buyerCount: 1,
        escalationCount: 1,
        documentCount: 24,
        token: hasAllTheClaimsTokenStub,
      } as any)
    ).toEqual(expectedValue);
  });

  it('should select userMenuOptions from state', () =>
    expect(CoreSelectors.userMenuOptions({ userMenuOptions: [] } as any)).toEqual([]));

  it('should select featureFlags from state', () =>
    expect(CoreSelectors.featureFlags({ featureFlags: [] } as any)).toEqual([]));

  it('should select userRoles from state', () =>
    expect(
      CoreSelectors.userRoles({
        userRoles: [SecurityAttributes.Admin],
      } as any)
    ).toEqual([SecurityAttributes.Admin]));

  it('should select token from state', () =>
    expect(CoreSelectors.token({ token: null } as any)).toBeNull());

  it('should select orgId from state when orgId exist on token', () =>
    expect(
      CoreSelectors.orgIds({
        orgIds: ['25'],
      } as any)
    ).toEqual(['25']));

  it('should select orgNames from state', () =>
    expect(
      CoreSelectors.orgNames({
        orgNames: getBuyersStub(),
      } as any)
    ).toEqual(getBuyersStub()));

  it('should select filteredBuyers from state', () =>
    expect(
      CoreSelectors.filteredBuyers({
        filteredBuyers: getBuyersStub(),
      } as any)
    ).toEqual(getBuyersStub()));
});
