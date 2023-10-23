import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import * as actions from './core.actions';

describe('Core Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('SetToken', () => {
    beforeEach(() => store.dispatch(new actions.SetToken()));

    it('should dispatch SetToken action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetToken());
    });
  });

  describe('QueryUserAccount', () => {
    beforeEach(() => store.dispatch(new actions.QueryUserAccount()));

    it('should dispatch QueryUserAccount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryUserAccount());
    });
  });

  describe('QueryUserRoles', () => {
    beforeEach(() => store.dispatch(new actions.QueryUserRoles()));

    it('should dispatch QueryUserRoles action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryUserRoles());
    });
  });

  describe('QueryOrgNames', () => {
    beforeEach(() => store.dispatch(new actions.QueryOrgNames()));

    it('should dispatch QueryOrgNames action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryOrgNames());
    });
  });

  describe('QueryAllOrgNames', () => {
    beforeEach(() => store.dispatch(new actions.QueryAllOrgNames()));

    it('should dispatch QueryAllOrgNames action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryAllOrgNames());
    });
  });

  describe('HandleSponsorUser', () => {
    beforeEach(() => store.dispatch(new actions.HandleSponsorUser()));

    it('should dispatch HandleSponsorUser action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.HandleSponsorUser());
    });
  });

  describe('Logout', () => {
    beforeEach(() => store.dispatch(new actions.Logout()));

    it('should dispatch Logout action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.Logout());
    });
  });

  describe('HttpRequestActive', () => {
    beforeEach(() => store.dispatch(new actions.HttpRequestActive()));

    it('should dispatch HttpRequestActive action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.HttpRequestActive());
    });
  });

  describe('HttpRequestComplete', () => {
    beforeEach(() => store.dispatch(new actions.HttpRequestComplete()));

    it('should dispatch HttpRequestComplete action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.HttpRequestComplete());
    });
  });

  describe('QueryDocumentCardSetCounts', () => {
    beforeEach(() => store.dispatch(new actions.QueryDocumentCardSetCounts()));

    it('should dispatch QueryDocumentCardSetCounts action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryDocumentCardSetCounts());
    });
  });

  describe('StartWebSockets', () => {
    beforeEach(() => store.dispatch(new actions.StartWebSockets()));

    it('should dispatch StartWebSockets action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.StartWebSockets());
    });
  });

  describe('UpdateWebSocketConnection', () => {
    const hubConnectionMock = {} as any;

    beforeEach(() => store.dispatch(new actions.UpdateWebSocketConnection(hubConnectionMock)));

    it('should dispatch UpdateWebSocketConnection action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateWebSocketConnection(hubConnectionMock)
      );
    });
  });

  describe('StartLockHeartbeat', () => {
    beforeEach(() => store.dispatch(new actions.StartLockHeartbeat('1', '25')));

    it('should dispatch StartLockHeartbeat action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.StartLockHeartbeat('1', '25'));
    });
  });

  describe('RemoveExpiredLocks', () => {
    beforeEach(() => store.dispatch(new actions.RemoveExpiredLocks()));

    it('should dispatch RemoveExpiredLocks action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveExpiredLocks());
    });
  });

  describe('UpdatePendingDocumentCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdatePendingDocumentCount(0)));

    it('should dispatch UpdatePendingDocumentCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdatePendingDocumentCount(0));
    });
  });

  describe('UpdateEscalationDocumentCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdateEscalationDocumentCount(0)));

    it('should dispatch UpdateEscalationDocumentCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateEscalationDocumentCount(0)
      );
    });
  });

  describe('UpdateUploadsDocumentCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdateUploadsDocumentCount(0)));

    it('should dispatch UpdateUploadsDocumentCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateUploadsDocumentCount(0));
    });
  });

  describe('SendLockMessage', () => {
    beforeEach(() => store.dispatch(new actions.SendLockMessage('mockName', '1', '25')));

    it('should dispatch SendLockMessage action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SendLockMessage('mockName', '1', '25')
      );
    });
  });

  describe('SendUnlockMessage', () => {
    beforeEach(() => store.dispatch(new actions.SendUnlockMessage('1', '25')));

    it('should dispatch SendUnlockMessage action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SendUnlockMessage('1', '25'));
    });
  });

  describe('StartChameleon', () => {
    beforeEach(() => store.dispatch(new actions.StartChameleon()));

    it('should dispatch StartChameleon action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.StartChameleon());
    });
  });

  describe('AddMenuOptions', () => {
    const menuOptionsMock = {} as any;

    beforeEach(() => store.dispatch(new actions.AddMenuOptions(menuOptionsMock)));

    it('should dispatch AddMenuOptions action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.AddMenuOptions(menuOptionsMock)
      );
    });
  });

  describe('RemoveMenuOptions', () => {
    const menuOptionsMock = {} as any;

    beforeEach(() => store.dispatch(new actions.RemoveMenuOptions(menuOptionsMock)));

    it('should dispatch RemoveMenuOptions action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.RemoveMenuOptions(menuOptionsMock)
      );
    });
  });

  describe('QueryAllFeatureFlags', () => {
    beforeEach(() => store.dispatch(new actions.QueryAllFeatureFlags()));

    it('should dispatch QueryAllFeatureFlags action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryAllFeatureFlags());
    });
  });

  describe('SetCurrentPage', () => {
    beforeEach(() => store.dispatch(new actions.SetCurrentPage('')));

    it('should dispatch SetCurrentPage action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetCurrentPage(''));
    });
  });

  describe('RefreshToken', () => {
    beforeEach(() => store.dispatch(new actions.RefreshToken()));

    it('should dispatch RefreshToken action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RefreshToken());
    });
  });

  describe('AddFilteredBuyer', () => {
    const buyerStub = { id: '25', name: 'AvidXchange Inc.' };

    beforeEach(() => store.dispatch(new actions.AddFilteredBuyer(buyerStub)));

    it('should dispatch AddFilteredBuyer action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.AddFilteredBuyer(buyerStub));
    });
  });

  describe('RemoveFilteredBuyer', () => {
    const buyerStub = { id: '25', name: 'AvidXchange Inc.' };

    beforeEach(() => store.dispatch(new actions.RemoveFilteredBuyer(buyerStub)));

    it('should dispatch RemoveFilteredBuyer action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.RemoveFilteredBuyer(buyerStub));
    });
  });

  describe('OpenFilteredBuyersModal', () => {
    beforeEach(() => store.dispatch(new actions.OpenFilteredBuyersModal()));

    it('should dispatch OpenFilteredBuyersModal action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.OpenFilteredBuyersModal());
    });
  });

  describe('SetResearchPageEscalationCategoryList', () => {
    beforeEach(() => store.dispatch(new actions.SetResearchPageEscalationCategoryList([])));

    it('should dispatch SetResearchPageEscalationCategoryList action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetResearchPageEscalationCategoryList([])
      );
    });
  });

  describe('GetPaymentTerms', () => {
    beforeEach(() => store.dispatch(new actions.GetPaymentTerms()));

    it('should dispatch GetPaymentTerms action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.GetPaymentTerms());
    });
  });

  describe('UpdatePendingQueueCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdatePendingQueueCount()));

    it('should dispatch UpdatePendingQueueCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdatePendingQueueCount());
    });
  });

  describe('UpdateResearchQueueCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdateResearchQueueCount()));

    it('should dispatch UpdateResearchQueueCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateResearchQueueCount());
    });
  });

  describe('UpdateUploadsQueueCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdateUploadsQueueCount()));

    it('should dispatch UpdateUploadsQueueCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateUploadsQueueCount());
    });
  });

  describe('UpdateRecycleBinQueueCount', () => {
    beforeEach(() => store.dispatch(new actions.UpdateRecycleBinQueueCount()));

    it('should dispatch UpdateRecycleBinQueueCount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateRecycleBinQueueCount());
    });
  });

  describe('UnlockDocument', () => {
    beforeEach(() => store.dispatch(new actions.UnlockDocument('', '')));

    it('should dispatch UnlockDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UnlockDocument('', ''));
    });
  });
});
