import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { AggregateBodyRequest, Environment } from '@ui-coe/avidcapture/shared/types';
import { firstValueFrom, from, interval, Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';

import * as coreActions from '../+state/core.actions';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  hubConnection: HubConnection;
  staleLockSubscription: Subscription;
  staleLockIntervalTime = 120000; // set to 2 min
  isStaleLockRunning = false;

  constructor(private store: Store, @Inject('environment') private environment: Environment) {}

  createConnection(): HubConnection {
    const token = this.store.selectSnapshot(state => state.core.token);
    const url = `${this.environment.apiBaseUri}xdcHub`;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.onclose(this.onCloseConnection);

    // We must register events before starting connection
    this.registerOnServerEvents();
    this.startConnection();

    return this.hubConnection;
  }

  stopConnection(): void {
    this.hubConnection.stop();
  }

  refreshConnection(): void {
    this.stopConnection();
    this.store.dispatch(new coreActions.UpdateWebSocketConnection(this.createConnection()));
  }

  async sendLockMessage(username: string, documentId: string, buyerId: string): Promise<void> {
    const currentPage = this.store.selectSnapshot(state => state.core.currentPage);
    const source$ = from(
      this.hubConnection.invoke('Lock', username, documentId, currentPage, buyerId)
    ).pipe(retry({ count: 2, delay: 2000 }));

    await firstValueFrom(source$).catch(err => {
      throw err;
    });
  }

  async sendUnlockMessage(documentId: string, buyerId: string): Promise<void> {
    const currentPage = this.store.selectSnapshot(state => state.core.currentPage);
    const source$ = from(
      this.hubConnection.invoke('Unlock', documentId, currentPage, buyerId)
    ).pipe(retry({ count: 2, delay: 2000 }));

    await firstValueFrom(source$).catch(err => {
      throw err;
    });

    this.staleLockSubscription.unsubscribe();
    this.isStaleLockRunning = false;
    this.removeExpiredLocks();
  }

  startLockHeartbeat(documentId: string, buyerId: string): void {
    if (!this.isStaleLockRunning) {
      this.isStaleLockRunning = true;
      this.staleLockSubscription = interval(this.staleLockIntervalTime).subscribe(() => {
        this.hubConnection.invoke('UpdateLock', documentId, buyerId);
      });
    }
  }

  async removeExpiredLocks(): Promise<void> {
    await this.hubConnection.invoke('ExpireLocks');
  }

  async getQueueCount(
    aggregateRequest: AggregateBodyRequest,
    queueSocketName: string
  ): Promise<void> {
    await this.hubConnection.invoke(
      'GetAggregate',
      JSON.stringify(aggregateRequest),
      queueSocketName
    );
  }

  async addToGroup(buyerIds: string[]): Promise<void> {
    for (const buyerId of buyerIds) {
      await this.hubConnection.invoke('AddToGroup', buyerId);
    }
  }

  async removeFromGroup(buyerId: string): Promise<void> {
    await this.hubConnection.invoke('RemoveFromGroup', buyerId);
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('onResearchQueueCount', (result: string) => {
      const count = JSON.parse(result);
      this.store.dispatch(new coreActions.UpdateEscalationDocumentCount(count[0]['count']));
    });

    this.hubConnection.on('onPendingQueueCount', (result: string) => {
      const count = JSON.parse(result);
      this.store.dispatch(new coreActions.UpdatePendingDocumentCount(count[0]['count']));
    });

    this.hubConnection.on('onUploadsQueueCount', (result: string) => {
      const count = JSON.parse(result);
      this.store.dispatch(new coreActions.UpdateUploadsDocumentCount(count[0]['count']));
    });

    this.hubConnection.on('onRecycleBinQueueCount', (result: string) => {
      const count = JSON.parse(result);
      this.store.dispatch(new coreActions.UpdateRecycleBinDocumentCount(count[0]['count']));
    });
  }

  private async startConnection(): Promise<void> {
    const source$ = from(this.hubConnection.start()).pipe(retry({ count: 2, delay: 2000 }));

    await firstValueFrom(source$)
      .then(() => {
        this.store.dispatch(new coreActions.ConfigureWebSocketGroups());
        this.removeExpiredLocks();
      })
      .catch(err => {
        throw err;
      });
  }

  private onCloseConnection(err?: Error): void {
    if (err && this.hubConnection.state === HubConnectionState.Disconnected) throw err;
  }
}
