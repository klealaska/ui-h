import { TestBed } from '@angular/core/testing';
import {
  hasAllTheClaimsTokenStub,
  hasNoClaimsTokenStub,
  managerTokenStub,
  singleOrgTokenStub,
  hasAllTheRolesTokenStub,
  singleOrgSomeEscalationsStub,
  uploadAndSubmitTokenStub,
  hasCustomerRoleTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  CustomerEscalationTypes,
  EscalationCategoryTypes,
  IndexerEscalationTypes,
  IndexerQAEscalationType,
} from '@ui-coe/avidcapture/shared/types';

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

  describe('canViewAdmin', () => {
    describe('when token does NOT have canViewAdmin claim', () => {
      it('should set canViewAdmin to false', () =>
        expect(ClaimsQueries.canViewAdmin(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewAdmin to false', () =>
        expect(ClaimsQueries.canViewAdmin(null)).toBeFalsy());
    });
  });

  describe('canViewDashboard', () => {
    describe('when token has canViewDashboard claim', () => {
      it('should set canViewDashboard to true', () =>
        expect(ClaimsQueries.canViewDashboard(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewDashboard claim', () => {
      it('should set canViewDashboard to false', () =>
        expect(ClaimsQueries.canViewDashboard(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewDashboard to false', () =>
        expect(ClaimsQueries.canViewDashboard(null)).toBeFalsy());
    });
  });

  describe('canViewPending', () => {
    describe('when token has canViewPending claim', () => {
      it('should set canViewPending to true', () =>
        expect(ClaimsQueries.canViewPending(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewPending claim', () => {
      it('should set canViewPending to false', () =>
        expect(ClaimsQueries.canViewPending(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewPending to false', () =>
        expect(ClaimsQueries.canViewPending(null)).toBeFalsy());
    });
  });

  describe('canViewResearch', () => {
    describe('when token has canViewResearch claim', () => {
      it('should set canViewResearch to true', () =>
        expect(ClaimsQueries.canViewResearch(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewResearch claim', () => {
      it('should set canViewResearch to false', () =>
        expect(ClaimsQueries.canViewResearch(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewResearch to false', () =>
        expect(ClaimsQueries.canViewResearch(null)).toBeFalsy());
    });
  });

  describe('canViewArchive', () => {
    describe('when token has canViewArchive claim', () => {
      it('should set canViewArchive to true', () =>
        expect(ClaimsQueries.canViewArchive(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewArchive claim', () => {
      it('should set canViewArchive to false', () =>
        expect(ClaimsQueries.canViewArchive(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewArchive to false', () =>
        expect(ClaimsQueries.canViewArchive(null)).toBeFalsy());
    });
  });

  describe('canViewRecycleBin', () => {
    describe('when token has canViewRecycleBin claim', () => {
      it('should set canViewRecycleBin to true', () =>
        expect(ClaimsQueries.canViewRecycleBin(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewRecycleBin claim', () => {
      it('should set canViewRecycleBin to false', () =>
        expect(ClaimsQueries.canViewRecycleBin(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewRecycleBin to false', () =>
        expect(ClaimsQueries.canViewRecycleBin(null)).toBeFalsy());
    });
  });

  describe('canUseAdvancedFilter', () => {
    describe('when token has canUseAdvancedFilter claim', () => {
      it('should set canUseAdvancedFilter to true', () =>
        expect(ClaimsQueries.canUseAdvancedFilter(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canUseAdvancedFilter claim', () => {
      it('should set canUseAdvancedFilter to false', () =>
        expect(ClaimsQueries.canUseAdvancedFilter(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canUseAdvancedFilter to false', () =>
        expect(ClaimsQueries.canUseAdvancedFilter(null)).toBeFalsy());
    });
  });

  describe('editWorkflow', () => {
    describe('when token has editWorkflow claim', () => {
      it('should set editWorkflow to true', () =>
        expect(ClaimsQueries.editWorkflow(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have editWorkflow claim', () => {
      it('should set editWorkflow to false', () =>
        expect(ClaimsQueries.editWorkflow(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set editWorkflow to false', () =>
        expect(ClaimsQueries.editWorkflow(null)).toBeFalsy());
    });
  });

  describe('canViewNavigationBar', () => {
    describe('when token has canViewNavigationBar claim', () => {
      it('should set canViewNavigationBar to true', () =>
        expect(ClaimsQueries.canViewNavigationBar(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewNavigationBar claim', () => {
      it('should set canViewNavigationBar to false', () =>
        expect(ClaimsQueries.canViewNavigationBar(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewNavigationBar to false', () =>
        expect(ClaimsQueries.canViewNavigationBar(null)).toBeFalsy());
    });
  });

  describe('canViewAllBuyers', () => {
    describe('when token has canViewAllBuyers claim', () => {
      it('should set canViewAllBuyers to true', () =>
        expect(ClaimsQueries.canViewAllBuyers(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewAllBuyers claim', () => {
      it('should set canViewAllBuyers to false', () =>
        expect(ClaimsQueries.canViewAllBuyers(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewAllBuyers to false', () =>
        expect(ClaimsQueries.canViewAllBuyers(null)).toBeFalsy());
    });
  });

  describe('canUpload', () => {
    describe('when token has canUpload claim', () => {
      it('should set canUpload to true', () =>
        expect(ClaimsQueries.canUpload(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canUpload claim', () => {
      it('should set canUpload to false', () =>
        expect(ClaimsQueries.canUpload(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canUpload to false', () => expect(ClaimsQueries.canUpload(null)).toBeFalsy());
    });
  });

  describe('canDownloadPdf', () => {
    describe('when token has canDownloadPdf claim', () => {
      it('should set canDownloadPdf to true', () =>
        expect(ClaimsQueries.canDownloadPdf(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canDownloadPdf claim', () => {
      it('should set canDownloadPdf to false', () =>
        expect(ClaimsQueries.canDownloadPdf(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canDownloadPdf to false', () =>
        expect(ClaimsQueries.canDownloadPdf(null)).toBeFalsy());
    });
  });

  describe('canSwapImage', () => {
    describe('when token has canSwapImage claim', () => {
      it('should set canSwapImage to true', () =>
        expect(ClaimsQueries.canSwapImage(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canSwapImage claim', () => {
      it('should set canSwapImage to false', () =>
        expect(ClaimsQueries.canSwapImage(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canSwapImage to false', () =>
        expect(ClaimsQueries.canSwapImage(null)).toBeFalsy());
    });
  });

  describe('canViewClientGuidelines', () => {
    describe('when token has canViewClientGuidelines claim', () => {
      it('should set canViewClientGuidelines to true', () =>
        expect(ClaimsQueries.canViewClientGuidelines(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewClientGuidelines claim', () => {
      it('should set canViewClientGuidelines to false', () =>
        expect(ClaimsQueries.canViewClientGuidelines(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewClientGuidelines to false', () =>
        expect(ClaimsQueries.canViewClientGuidelines(null)).toBeFalsy());
    });
  });

  describe('canViewAvidInvoice', () => {
    describe('when token has canViewAvidInvoice claim', () => {
      it('should set canViewAvidInvoice to true', () =>
        expect(ClaimsQueries.canViewAvidInvoice(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewAvidInvoice claim', () => {
      it('should set canViewAvidInvoice to false', () =>
        expect(ClaimsQueries.canViewAvidInvoice(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token has Upload and Submit Role', () => {
      it('should set canViewAvidInvoice to true', () =>
        expect(ClaimsQueries.canViewAvidInvoice(uploadAndSubmitTokenStub)).toBeTruthy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewAvidInvoice to false', () =>
        expect(ClaimsQueries.canViewAvidInvoice(null)).toBeFalsy());
    });
  });

  describe('canViewAvidInbox', () => {
    describe('when token has canViewAvidInbox claim', () => {
      it('should set canViewAvidInbox to true', () =>
        expect(ClaimsQueries.canViewAvidInbox(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token has upload and submit role', () => {
      it('should set canViewAvidInbox to true', () =>
        expect(ClaimsQueries.canViewAvidInbox(uploadAndSubmitTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canViewAvidInbox claim', () => {
      it('should set canViewAvidInbox to false', () =>
        expect(ClaimsQueries.canViewAvidInbox(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canViewAvidInbox to false', () =>
        expect(ClaimsQueries.canViewAvidInbox(null)).toBeFalsy());
    });
  });

  describe('canRecycleDocument', () => {
    describe('when token has canRecycleDocument claim', () => {
      it('should set canRecycleDocument to true', () =>
        expect(ClaimsQueries.canRecycleDocument(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canRecycleDocument claim', () => {
      it('should set canRecycleDocument to false', () =>
        expect(ClaimsQueries.canRecycleDocument(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canRecycleDocument to false', () =>
        expect(ClaimsQueries.canRecycleDocument(null)).toBeFalsy());
    });
  });

  describe('canRejectToSender', () => {
    describe('when token has Customer role', () => {
      it('should set canRejectToSender to true', () =>
        expect(ClaimsQueries.canRejectToSender(hasCustomerRoleTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canRejectToSender claim', () => {
      it('should set canRejectToSender to false', () =>
        expect(ClaimsQueries.canRejectToSender(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canRejectToSender to false', () =>
        expect(ClaimsQueries.canRejectToSender(null)).toBeFalsy());
    });
  });

  describe('canCreateAccount', () => {
    describe('when token has canCreateAccount claim', () => {
      it('should set canCreateAccount to true', () =>
        expect(ClaimsQueries.canCreateAccount(hasAllTheClaimsTokenStub)).toBeTruthy());
    });

    describe('when token does NOT have canCreateAccount claim', () => {
      it('should set canCreateAccount to false', () =>
        expect(ClaimsQueries.canCreateAccount(hasNoClaimsTokenStub)).toBeFalsy());
    });

    describe('when token does NOT EXIST', () => {
      it('should set canCreateAccount to false', () =>
        expect(ClaimsQueries.canCreateAccount(null)).toBeFalsy());
    });
  });

  describe('canSeeSaveButton', () => {
    describe('When user has one of those Roles SprManager, Customer', () => {
      it('should set canSeeSaveButton to true ', () => {
        expect(ClaimsQueries.canSeeSaveButton(hasAllTheClaimsTokenStub)).toBeTruthy();
      });
    });

    describe('When user has upload and submit role', () => {
      it('should set canSeeSaveButton to true ', () => {
        expect(ClaimsQueries.canSeeSaveButton(uploadAndSubmitTokenStub)).toBeTruthy();
      });
    });

    describe('When user does not has one of those Roles  SprManager, Customer', () => {
      it('should set canSeeSaveButton to false ', () => {
        expect(ClaimsQueries.canSeeSaveButton(hasAllTheRolesTokenStub)).toBeFalsy();
      });
    });
  });

  describe('canSeeMoreActions', () => {
    describe('When user has one of those Roles SprManager, Customer', () => {
      it('should set canSeeMoreActions to true ', () => {
        expect(ClaimsQueries.canSeeMoreActions(hasAllTheClaimsTokenStub)).toBeTruthy();
      });
    });

    describe('When user has upload and submit role', () => {
      it('should set canSeeMoreActions to true ', () => {
        expect(ClaimsQueries.canSeeMoreActions(uploadAndSubmitTokenStub)).toBeTruthy();
      });
    });

    describe('When user does not has one of those Roles  SprManager, Customer', () => {
      it('should set canSeeMoreActionsButton to false ', () => {
        expect(ClaimsQueries.canSeeMoreActions(hasAllTheRolesTokenStub)).toBeFalsy();
      });
    });
  });

  describe('canSeeExposedFilters', () => {
    describe('When user has one of those Roles SprManager, Customer', () => {
      it('should set canSeeExposedFilters to true ', () => {
        expect(ClaimsQueries.canSeeExposedFilters(hasAllTheClaimsTokenStub)).toBeTruthy();
      });
    });

    describe('When user does not has one of those Roles  SprManager, Customer', () => {
      it('should set canSeeExposedFilters to false ', () => {
        expect(ClaimsQueries.canSeeExposedFilters(hasAllTheRolesTokenStub)).toBeFalsy();
      });
    });
  });

  describe('canViewGetNextDocument', () => {
    describe('When user has one of those Roles InternalOps, Manager, QualityControl, Customer', () => {
      it('should set canViewGetNextDocument to true ', () => {
        expect(ClaimsQueries.canViewGetNextDocument(hasAllTheClaimsTokenStub)).toBeTruthy();
      });
    });

    describe('When user does not has one of those Roles InternalOps, Manager, QualityControl, Customer', () => {
      it('should set canViewGetNextDocument to true ', () => {
        expect(ClaimsQueries.canViewGetNextDocument(hasAllTheRolesTokenStub)).toBeFalsy();
      });
    });
  });

  describe('markAsList', () => {
    describe('when token has all markAs claims', () => {
      it('should have all markAs options', () => {
        expect(ClaimsQueries.markAsList(hasAllTheClaimsTokenStub)).toEqual([
          EscalationCategoryTypes.DataExceptionAU,
          EscalationCategoryTypes.ScanningOpsQC,
          EscalationCategoryTypes.IndexerQa,
          EscalationCategoryTypes.IndexingOpsQc,
          EscalationCategoryTypes.RecycleBin,
          EscalationCategoryTypes.DuplicateResearch,
          EscalationCategoryTypes.ImageIssue,
          EscalationCategoryTypes.NonInvoiceDocument,
          EscalationCategoryTypes.RejectToSender,
          EscalationCategoryTypes.ShipToResearch,
          EscalationCategoryTypes.SupplierResearch,
        ]);
      });
    });

    describe('when token has customer role', () => {
      it('should have only customer options', () => {
        expect(ClaimsQueries.markAsList(singleOrgTokenStub)).toEqual([
          EscalationCategoryTypes.RecycleBin,
          EscalationCategoryTypes.DuplicateResearch,
          EscalationCategoryTypes.ImageIssue,
          EscalationCategoryTypes.NonInvoiceDocument,
          EscalationCategoryTypes.RejectToSender,
          EscalationCategoryTypes.ShipToResearch,
          EscalationCategoryTypes.SupplierResearch,
        ]);
      });
    });

    describe('when token has customer role and no ship-to research', () => {
      it('should have only customer options and no ship-to research', () => {
        expect(ClaimsQueries.markAsList(singleOrgSomeEscalationsStub)).toEqual([
          EscalationCategoryTypes.RecycleBin,
          EscalationCategoryTypes.DuplicateResearch,
          EscalationCategoryTypes.ImageIssue,
          EscalationCategoryTypes.NonInvoiceDocument,
          EscalationCategoryTypes.RejectToSender,
          EscalationCategoryTypes.SupplierResearch,
        ]);
      });
    });

    describe('when token has NO markAs claims', () => {
      it('should have all markAs options', () => {
        expect(ClaimsQueries.markAsList(hasNoClaimsTokenStub)).toEqual([]);
      });
    });

    describe('when token does NOT EXIST', () => {
      it('should return empty array', () => expect(ClaimsQueries.markAsList(null)).toEqual([]));
    });
  });

  describe('escalationCategoryList', () => {
    describe('when token is null', () => {
      it('should return all escalationCategoryTypes', () => {
        expect(ClaimsQueries.escalationCategoryList(null)).toEqual(
          Object.values(EscalationCategoryTypes).map(x => `-${x}`)
        );
      });
    });

    describe('when token has customer role', () => {
      it('should return all escalationCategoryTypes', () => {
        expect(ClaimsQueries.escalationCategoryList(singleOrgTokenStub)).toEqual([
          ...Object.values(IndexerEscalationTypes).map(x => `-${x}`),
          ...Object.values(IndexerQAEscalationType).map(x => `-${x}`),
        ]);
      });
    });

    describe('when token has customer role and no ship-to research', () => {
      it('should return all escalationCategoryTypes except ship-to research', () => {
        const escalations = [
          ...Object.values(IndexerEscalationTypes).map(x => `-${x}`),
          ...Object.values(IndexerQAEscalationType).map(x => `-${x}`),
          `-${EscalationCategoryTypes.ShipToResearch}`,
        ];
        expect(ClaimsQueries.escalationCategoryList(singleOrgSomeEscalationsStub)).toEqual(
          escalations
        );
      });
    });

    describe('when token has InternalOps role', () => {
      it('should return no escalationCategoryTypes', () => {
        expect(ClaimsQueries.escalationCategoryList(hasAllTheClaimsTokenStub)).toEqual([]);
      });
    });

    describe('when token has Manager role only', () => {
      it('should return some escalationCategoryTypes', () => {
        expect(ClaimsQueries.escalationCategoryList(managerTokenStub)).toEqual([
          ...Object.values(CustomerEscalationTypes).map(x => `-${x}`),
          ...Object.values(IndexerEscalationTypes).map(x => `-${x}`),
        ]);
      });
    });

    describe('canEditPredictedValues', () => {
      describe('when token has internalops role', () => {
        it('should set canEditPredictedValues to true', () =>
          expect(ClaimsQueries.canEditPredictedValues(hasAllTheClaimsTokenStub)).toBeTruthy());
      });

      describe('when token does NOT have internalops role', () => {
        it('should set canEditPredictedValues to false', () =>
          expect(ClaimsQueries.canEditPredictedValues(hasNoClaimsTokenStub)).toBeFalsy());
      });

      describe('when token does NOT EXIST', () => {
        it('should set canEditPredictedValues to false', () =>
          expect(ClaimsQueries.canEditPredictedValues(null)).toBeFalsy());
      });
    });

    describe('canUnlockDocumentManually', () => {
      describe('when token has internalops role', () => {
        it('should set canUnlockDocumentManually to true', () =>
          expect(ClaimsQueries.canUnlockDocumentManually(hasAllTheClaimsTokenStub)).toBeTruthy());
      });

      describe('when token does NOT have internalops role', () => {
        it('should set canUnlockDocumentManually to false', () =>
          expect(ClaimsQueries.canUnlockDocumentManually(hasNoClaimsTokenStub)).toBeFalsy());
      });

      describe('when token does NOT EXIST', () => {
        it('should set canUnlockDocumentManually to false', () =>
          expect(ClaimsQueries.canUnlockDocumentManually(null)).toBeFalsy());
      });
    });
  });
});
