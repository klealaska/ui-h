import { of, throwError } from 'rxjs';
import {
  executionStub,
  platformServiceStub,
  platformStub,
  registrationEnablementStub,
  registrationServiceStub,
  stateContextStub,
  storeStub,
  syncServiceStub,
  toastServiceStub,
} from '../../test/test-stubs';
import { AvidStatus } from '../core/enums';
import { SyncState, SyncStateModel } from './sync.state';

describe('SyncState', () => {
  const SyncStateModelStub: SyncStateModel = {
    isLoading: false,
    registrationEnablements: [registrationEnablementStub],
    uploadedFiles: { test: { fileId: '123', fileName: 'abc', isUploading: false } },
    operations: new Set(['test']),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select isLoading from state', () =>
      expect(SyncState.isLoading(SyncStateModelStub as any)).toBe(SyncStateModelStub.isLoading));

    it('should select registrationEnablements from state', () =>
      expect(SyncState.registrationEnablements(SyncStateModelStub as any)).toBe(
        SyncStateModelStub.registrationEnablements
      ));

    it('should select activeRegisrtationEnablements from state', () =>
      expect(SyncState.activeRegisrtationEnablements(SyncStateModelStub as any)).toStrictEqual([
        registrationEnablementStub,
      ]));

    it('should select operations from state', () =>
      expect(SyncState.operations(SyncStateModelStub as any)).toEqual([
        ...SyncStateModelStub.operations,
      ]));

    it('should select uploadedFiles from state', () =>
      expect(SyncState.uploadedFiles(SyncStateModelStub as any)).toBe(
        SyncStateModelStub.uploadedFiles
      ));
  });

  const SyncStateStub = new SyncState(
    platformServiceStub as any,
    registrationServiceStub as any,
    syncServiceStub as any,
    storeStub as any,
    toastServiceStub as any
  );

  describe('Action: GetRegistrationEnablements', () => {
    beforeEach(() => {
      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValue(1)
        .mockReturnValueOnce(platformStub)
        .mockReturnValue(1);
    });
    describe('when service returns data', () => {
      beforeEach(() => {
        platformServiceStub.getOperationTypes.mockReturnValue(
          of([{ id: 131073, name: 'Operation Test' }])
        );
        registrationServiceStub.getEnablements.mockReturnValue(of([registrationEnablementStub]));

        SyncStateStub.getRegistrationEnablements(stateContextStub).subscribe();
      });

      it('should patchState operations with response data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          registrationEnablements: [registrationEnablementStub],
          isLoading: false,
        }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        platformServiceStub.getOperationTypes.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState operations with empty valuey', () => {
        SyncStateStub.getRegistrationEnablements(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              registrationEnablements: [],
              isLoading: false,
            });
          }
        );
      });
    });
  });

  describe('Action: PostExecution', () => {
    const execution = executionStub;

    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('when succesfully call post execution', () => {
      beforeEach(() => {
        jest.spyOn(syncServiceStub, 'postExecution').mockReturnValue(of(1));
        SyncStateStub.postExecution(stateContextStub, { execution }).subscribe();
      });

      it('should open toast message', () =>
        expect(toastServiceStub.open).toHaveBeenCalledWith('Sync Submitted', AvidStatus.Success));
    });

    describe('when succesfully call post execution', () => {
      beforeEach(() => {
        jest.spyOn(syncServiceStub, 'postExecution').mockReturnValue(of(1));
        SyncStateStub.postExecution(stateContextStub, {
          execution: { ...execution, isPreview: true },
        }).subscribe();
      });

      it('should open toast message', () =>
        expect(toastServiceStub.open).toHaveBeenCalledWith(
          'Preview mode executed',
          AvidStatus.Success
        ));
    });

    describe('when there is an error on customer post', () => {
      beforeEach(() => {
        syncServiceStub.postExecution.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should open error oast message', () => {
        SyncStateStub.postExecution(stateContextStub, { execution }).subscribe({
          error: () => {
            expect(toastServiceStub.open).toHaveBeenCalledWith('', AvidStatus.Error);
          },
        });
      });
    });
  });

  describe('Action: RemoveFileId', () => {
    it('should set the file info for an operation to null', () => {
      jest.spyOn(stateContextStub, 'getState').mockReturnValueOnce(SyncStateModelStub);

      SyncStateStub.removeFileId(stateContextStub, { operationTypeName: 'test' });

      expect(stateContextStub.patchState).toHaveBeenCalledWith({
        uploadedFiles: {
          test: null,
        },
      });
    });
  });

  describe('Action: AddOperation', () => {
    it('should add a new operation', () => {
      jest.spyOn(stateContextStub, 'getState').mockReturnValueOnce(SyncStateModelStub);

      SyncStateStub.addOperation(stateContextStub, { operationTypeName: 'test2' });

      expect(stateContextStub.patchState).toHaveBeenCalledWith({
        operations: new Set(['test', 'test2']),
      });
    });

    it('should not add duplicates', () => {
      jest
        .spyOn(stateContextStub, 'getState')
        .mockReturnValueOnce({ operations: new Set(['test', 'test2']) });

      SyncStateStub.addOperation(stateContextStub, { operationTypeName: 'test2' });

      expect(stateContextStub.patchState).toHaveBeenCalledWith({
        operations: new Set(['test', 'test2']),
      });
    });
  });

  describe('Action: RemoveOperation', () => {
    it('should remove an operation', () => {
      jest.spyOn(stateContextStub, 'getState').mockReturnValueOnce(SyncStateModelStub);

      SyncStateStub.removeOperation(stateContextStub, { operationTypeName: 'test' });

      expect(stateContextStub.patchState).toHaveBeenCalledWith({
        operations: new Set(),
      });
    });
  });

  describe('Action: ResetState', () => {
    it('should reset the state to default values', () => {
      jest.spyOn(stateContextStub, 'getState').mockReturnValueOnce(SyncStateModelStub);

      SyncStateStub.resetState(stateContextStub);

      expect(stateContextStub.setState).toHaveBeenCalledWith({
        registrationEnablements: [],
        isLoading: false,
        uploadedFiles: {},
        operations: new Set(),
      });
    });
  });
});
