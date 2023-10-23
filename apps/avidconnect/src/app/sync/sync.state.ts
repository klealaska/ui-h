import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { RegistrationService } from '../core/services/registration.service';
import { AvidException, OperationType, Platform, RegistrationEnablement } from '../models';
import * as actions from './sync.actions';
import { forkJoin, Observable } from 'rxjs';
import { CoreState } from '../core/state/core.state';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PlatformService } from '../core/services/platform.service';
import { SyncService } from '../core/services/sync.service';
import { ToastService } from '../core/services/toast.service';
import { ToastStatus } from '../core/enums';

export interface SyncUploadedFile {
  fileId: string;
  fileName: string;
  isUploading: boolean;
}

export interface SyncStateModel {
  registrationEnablements: RegistrationEnablement[];
  isLoading: boolean;
  uploadedFiles: { [key: string]: SyncUploadedFile };
  operations: Set<string>;
}

const defaults: SyncStateModel = {
  registrationEnablements: [],
  isLoading: false,
  uploadedFiles: {},
  operations: new Set(),
};

@State<SyncStateModel>({ name: 'sync', defaults })
@Injectable()
export class SyncState {
  constructor(
    private platformService: PlatformService,
    private registrationService: RegistrationService,
    private syncService: SyncService,
    private store: Store,
    private toast: ToastService
  ) {}

  @Selector()
  static registrationEnablements(state: SyncStateModel): RegistrationEnablement[] {
    return state.registrationEnablements;
  }

  @Selector()
  static activeRegisrtationEnablements(state: SyncStateModel): RegistrationEnablement[] {
    return state.registrationEnablements.filter(enablement => enablement.isActive);
  }

  @Selector()
  static isLoading(state: SyncStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static operations(state: SyncStateModel): string[] {
    return [...state.operations];
  }

  @Selector()
  static uploadedFiles(state: SyncStateModel): {
    [key: string]: SyncUploadedFile;
  } {
    return state.uploadedFiles;
  }

  @Action(actions.GetRegistrationEnablements)
  getRegistrationEnablements({ patchState }: StateContext<SyncStateModel>): Observable<{
    platformOperationTypes: OperationType[];
    registrationEnablements: RegistrationEnablement[];
  }> {
    const customerId = this.store.selectSnapshot(CoreState.customerId);
    const platform = this.store.selectSnapshot<Platform>(CoreState.platform);
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    patchState({ isLoading: true });

    return forkJoin({
      platformOperationTypes: this.platformService.getOperationTypes(platform.id),
      registrationEnablements: this.registrationService.getEnablements(customerId, registrationId),
    }).pipe(
      tap(({ platformOperationTypes, registrationEnablements }) => {
        const enablements = registrationEnablements.map(enablement => {
          const operationType = platformOperationTypes.find(
            operationType => operationType.id === enablement.operationTypeId
          );

          return { ...enablement, operationTypeName: operationType?.name ?? '' };
        });

        patchState({
          registrationEnablements: enablements.filter(q => q.operationTypeName.length > 0),
          isLoading: false,
        });
      }),
      catchError(err => {
        patchState({ registrationEnablements: [], isLoading: false });
        throw err;
      })
    );
  }

  @Action(actions.PostExecution)
  postExecution(
    { patchState }: StateContext<SyncStateModel>,
    { execution }: actions.PostExecution
  ): Observable<number> {
    patchState({ isLoading: true });

    return this.syncService.postExecution(execution).pipe(
      tap(() => {
        const message = execution.isPreview ? 'Preview mode executed' : 'Sync Submitted';
        this.toast.open(message, ToastStatus.Success);
      }),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        throw err;
      }),
      finalize(() => this.store.dispatch(new actions.ResetState()))
    );
  }

  @Action(actions.PostFileUpload)
  uploadFile(
    { patchState, getState }: StateContext<SyncStateModel>,
    { file, operationTypeName }: actions.PostFileUpload
  ) {
    const platform = this.store.selectSnapshot(CoreState.platform);
    const customer = this.store.selectSnapshot(CoreState.customer);

    patchState({
      uploadedFiles: {
        ...getState().uploadedFiles,
        [operationTypeName]: { fileId: null, fileName: file.name, isUploading: true },
      },
    });

    return this.syncService.postFileUpload(customer.externalKey, platform.externalKey, file).pipe(
      tap((fileId: string) => {
        this.toast.open('File Uploaded Successfully', ToastStatus.Success);
        patchState({
          uploadedFiles: {
            ...getState().uploadedFiles,
            [operationTypeName]: { fileId, fileName: file.name, isUploading: false },
          },
        });
        this.store.dispatch(new actions.AddOperation(operationTypeName));
      }),
      catchError((err: AvidException) => {
        this.toast.open(`File Upload Failed: ${err?.reason}`, ToastStatus.Error);
        this.store.dispatch(new actions.RemoveFileId(operationTypeName));
        throw err;
      })
    );
  }

  @Action(actions.RemoveFileId)
  removeFileId(
    { patchState, getState }: StateContext<SyncStateModel>,
    { operationTypeName }: actions.RemoveFileId
  ) {
    patchState({
      uploadedFiles: { ...getState().uploadedFiles, [operationTypeName]: null },
    });
  }

  @Action(actions.AddOperation)
  addOperation(
    { patchState, getState }: StateContext<SyncStateModel>,
    { operationTypeName }: actions.AddOperation
  ) {
    patchState({
      operations: new Set([...getState().operations, operationTypeName]),
    });
  }

  @Action(actions.RemoveOperation)
  removeOperation(
    { patchState, getState }: StateContext<SyncStateModel>,
    { operationTypeName }: actions.AddOperation
  ) {
    const operations = new Set(getState().operations);
    operations.delete(operationTypeName);
    patchState({ operations });
    this.store.dispatch([new actions.RemoveFileId(operationTypeName)]);
  }

  @Action(actions.ResetState)
  resetState({ setState }: StateContext<SyncStateModel>) {
    setState(defaults);
  }
}
