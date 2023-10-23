import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HubConnectionState } from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { getAggregateBodyRequest } from '@ui-coe/avidcapture/shared/test';
import { AppPages } from '@ui-coe/avidcapture/shared/types';
import { AuthService } from '@ui-coe/shared/util/auth';
import { Subscription } from 'rxjs';

import * as coreActions from '../+state/core.actions';
import { SocketService } from './socket.service';

const storeStub: any = {
  dispatch: jest.fn(),
  selectSnapshot: jest.fn(),
};
const hubConnectionSpy: any = {
  start: jest.fn(() => (hubConnectionSpy.state = HubConnectionState.Connected)),
  stop: jest.fn(),
  on: jest.fn(),
  invoke: jest.fn(),
  state: HubConnectionState.Connected,
};
const authServiceStub = {
  getAccessToken: jest.fn(),
};
const environmentStub = {
  apiBaseUri: 'http://idcapi.avidxchange.com/',
} as any;

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });
    service = TestBed.inject(SocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createConnection()', () => {
    beforeEach(() => {
      storeStub.selectSnapshot.mockImplementation(cb =>
        cb({
          core: {
            token: 'mockToken',
          },
        })
      );
      hubConnectionSpy.start.call(() => Promise.resolve());
      service.hubConnection = hubConnectionSpy;
      service.stopConnection();
    });

    it('should create a hub Connection and start connection', () => {
      service.createConnection();

      expect(hubConnectionSpy.start).toHaveBeenCalled();
    });
  });

  describe('stopConnection()', () => {
    describe('when stopping connection is successful', () => {
      beforeEach(() => {
        hubConnectionSpy.stop.call(() => Promise.resolve());
        service.hubConnection = hubConnectionSpy;
        service.stopConnection();
      });

      it('should call hubConnection.stop', () => expect(hubConnectionSpy.stop).toHaveBeenCalled());
    });

    describe('when stopping connection fails', () => {
      beforeEach(() => {
        hubConnectionSpy.stop.call(() => Promise.reject('TEST Error'));
        service.hubConnection = hubConnectionSpy;
        service.stopConnection();
      });

      it('should call hubConnection.stop', () => expect(hubConnectionSpy.stop).toHaveBeenCalled());
    });
  });

  describe('refreshConnection()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'createConnection').mockImplementation(() => ({} as any));
      service.hubConnection = hubConnectionSpy;
      service.refreshConnection();
    });

    it('should stop the hub connection', () =>
      expect(hubConnectionSpy.stop).toHaveBeenCalledTimes(1));

    it('should dispatch UpdateWebSocketConnection with the new connection', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new coreActions.UpdateWebSocketConnection({} as any)
      ));
  });

  describe('sendLockMessage()', () => {
    it('should call hubConnection.invoke', async () => {
      storeStub.selectSnapshot.mockImplementation(cb =>
        cb({
          core: {
            currentPage: AppPages.Queue,
          },
        })
      );
      service.hubConnection = hubConnectionSpy;
      hubConnectionSpy.invoke.mockResolvedValue();

      await service.sendLockMessage('username', 'docId', '25');

      expect(hubConnectionSpy.invoke).toHaveBeenNthCalledWith(
        1,
        'Lock',
        'username',
        'docId',
        AppPages.Queue,
        '25'
      );
    });
  });

  describe('sendUnlockMessage()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'removeExpiredLocks').mockImplementation();
      storeStub.selectSnapshot.mockImplementation(cb =>
        cb({
          core: {
            currentPage: AppPages.Queue,
          },
        })
      );
      service.hubConnection = hubConnectionSpy;
      service.staleLockSubscription = new Subscription();
    });

    it('should call hubConnection.invoke Unlock', async () => {
      await service.sendUnlockMessage('docId', '25');

      expect(service.removeExpiredLocks).toHaveBeenCalledTimes(1);
      expect(hubConnectionSpy.invoke).toHaveBeenNthCalledWith(
        1,
        'Unlock',
        'docId',
        AppPages.Queue,
        '25'
      );
    });
  });

  describe('getQueueCount()', () => {
    beforeEach(() => {
      service.hubConnection = hubConnectionSpy;
      service.getQueueCount(getAggregateBodyRequest({ buyerId: [] }), 'mockSocketRequest');
    });

    it('should call hubConnection.invoke GetAggregate', () =>
      expect(service.hubConnection.invoke).toHaveBeenNthCalledWith(
        1,
        'GetAggregate',
        JSON.stringify(getAggregateBodyRequest({ buyerId: [] })),
        'mockSocketRequest'
      ));
  });

  describe('addToGroup()', () => {
    beforeEach(() => {
      service.hubConnection = hubConnectionSpy;
      service.addToGroup(['1']);
    });

    it('should call hubConnection.invoke AddToGroup', () =>
      expect(service.hubConnection.invoke).toHaveBeenNthCalledWith(1, 'AddToGroup', '1'));
  });

  describe('removeFromGroup()', () => {
    beforeEach(() => {
      service.hubConnection = hubConnectionSpy;
      service.removeFromGroup('1');
    });

    it('should call hubConnection.invoke RemoveFromGroup', () =>
      expect(service.hubConnection.invoke).toHaveBeenNthCalledWith(1, 'RemoveFromGroup', '1'));
  });

  describe('startLockHeartbeat()', () => {
    describe('isStaleLockRunning is value is false', () => {
      beforeEach(fakeAsync(() => {
        hubConnectionSpy.invoke.call(() => Promise.resolve());
        service.hubConnection = hubConnectionSpy;
        service.startLockHeartbeat('docId', '25');
        tick(service.staleLockIntervalTime);

        discardPeriodicTasks();
      }));

      it('should set isStaleLockRunning to true once updateLock hub service started', () =>
        expect(service.isStaleLockRunning).toBeTruthy());

      it('should call hubConnection.invoke', () =>
        expect(service.hubConnection.invoke).toHaveBeenCalledWith('UpdateLock', 'docId', '25'));
    });

    describe('isStaleLockRunning set to true', () => {
      beforeEach(() => {
        service.isStaleLockRunning = true;
        service.startLockHeartbeat('docId', '25');
      });

      it('should NOT call hubConnection.invoke', () =>
        expect(hubConnectionSpy.invoke).not.toHaveBeenCalled());
    });
  });

  describe('removeExpiredLocks()', () => {
    beforeEach(() => {
      service.hubConnection = hubConnectionSpy;
      service.removeExpiredLocks();
    });

    it('should call hubConnection.invoke ExpireLocks', () =>
      expect(service.hubConnection.invoke).toHaveBeenNthCalledWith(1, 'ExpireLocks'));
  });

  describe('private registerOnServerEvents()', () => {
    beforeEach(() => {
      storeStub.selectSnapshot.mockImplementation(cb =>
        cb({
          core: {
            currentPage: AppPages.Queue,
          },
        })
      );

      hubConnectionSpy.on
        .mockImplementationOnce((obj, cb) => {
          cb('[{ "count": 4 }]');
        })
        .mockImplementationOnce((obj, cb) => {
          cb('[{ "count": 4 }]');
        })
        .mockImplementationOnce((obj, cb) => {
          cb('[{ "count": 4 }]');
        })
        .mockImplementationOnce((obj, cb) => {
          cb('[{ "count": 4 }]');
        });
      service.hubConnection = hubConnectionSpy;
      service['registerOnServerEvents']();
    });

    it('should call hubConnection.on', () => expect(hubConnectionSpy.on).toHaveBeenCalledTimes(4));

    it('should dispatch UpdateSummaryCardCount action', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new coreActions.UpdateEscalationDocumentCount(4)
      ));

    it('should dispatch UpdateSummaryCardCount action', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(
        2,
        new coreActions.UpdatePendingDocumentCount(4)
      ));

    it('should dispatch UpdateSummaryCardCount action', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(
        3,
        new coreActions.UpdateUploadsDocumentCount(4)
      ));
  });

  describe('private startConnection()', () => {
    describe('when starting connection is successful', () => {
      beforeEach(() => {
        jest.spyOn(service, 'removeExpiredLocks').mockImplementation();
        hubConnectionSpy.start.mockResolvedValue(null);
        service.hubConnection = hubConnectionSpy;
        service['startConnection']();
      });

      it('should call hubConnection.start', () =>
        expect(hubConnectionSpy.start).toHaveBeenCalledTimes(1));

      it('should call removeExpiredLocks function after successful connection', () =>
        expect(service.removeExpiredLocks).toHaveBeenCalledTimes(1));
    });

    describe('when starting connection fails', () => {
      beforeEach(() => {
        hubConnectionSpy.start.call(() => Promise.reject('TEST Error'));
        service.hubConnection = hubConnectionSpy;
        service['startConnection']();
      });

      it('should call hubConnection.start', () =>
        expect(hubConnectionSpy.start).toHaveBeenCalled());
    });
  });
});
