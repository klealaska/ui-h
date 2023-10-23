import { of, throwError } from 'rxjs';
import {
  connectorServiceStub,
  operationTypeStub,
  platformServiceStub,
  registrationEnablementStub,
  registrationServiceStub,
  stateContextStub,
  storeStub,
  toastServiceStub,
} from '../../test/test-stubs';
import { DataSelectionState } from './data-selection.state';
import * as actions from './data-selection.actions';
import { ToastStatus } from '../core/enums';

describe('DataSelectionState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    const DataSelectionStateStub = {
      operationTypes: [operationTypeStub],
      registrationEnablements: [registrationEnablementStub],
      isLoading: false,
    };

    it('should select operationTypes from state', () =>
      expect(DataSelectionState.operationTypes(DataSelectionStateStub as any)).toBe(
        DataSelectionStateStub.operationTypes
      ));

    it('should select registrationEnablements from state', () =>
      expect(DataSelectionState.registrationEnablements(DataSelectionStateStub as any)).toBe(
        DataSelectionStateStub.registrationEnablements
      ));

    it('should select isLoading from state', () =>
      expect(DataSelectionState.isLoading(DataSelectionStateStub as any)).toBe(
        DataSelectionStateStub.isLoading
      ));
  });

  const DataSelectionStateStub = new DataSelectionState(
    platformServiceStub as any,
    connectorServiceStub as any,
    registrationServiceStub as any,
    storeStub as any,
    toastServiceStub as any
  );

  describe('Action: GetOperationTypes ', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('when services return data', () => {
      const operationTypes = [operationTypeStub];

      beforeEach(() => {
        jest.spyOn(platformServiceStub, 'getOperationTypes').mockReturnValue(of(operationTypes));
        jest.spyOn(connectorServiceStub, 'getOperationTypes').mockReturnValue(of(operationTypes));

        DataSelectionStateStub.getOperationTypes(stateContextStub).subscribe();
      });

      it('should patchState operationTypes with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          operationTypes,
          isLoading: false,
        }));

      it('should dispatch GetRegistrationEnablements action', () =>
        expect(stateContextStub.dispatch).toHaveBeenCalledWith(
          new actions.GetRegistrationEnablements()
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(platformServiceStub, 'getOperationTypes')
          .mockReturnValue(throwError({ errorCode: '404' }));
        jest
          .spyOn(connectorServiceStub, 'getOperationTypes')
          .mockReturnValue(throwError({ errorCode: '404' }));

        DataSelectionStateStub.getOperationTypes(stateContextStub).subscribe();
      });

      it('should clear operationTypes data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          operationTypes: [],
          isLoading: false,
        }));
    });
  });

  describe('Actions: GetRegistrationEnablements', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('when getEnablements returns data', () => {
      const registrationEnablements = [registrationEnablementStub];

      describe('when there is no platform operation Types', () => {
        beforeEach(() => {
          jest
            .spyOn(registrationServiceStub, 'getEnablements')
            .mockReturnValue(of(registrationEnablements));
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({ operationTypes: [] });
          DataSelectionStateStub.getRegistrationEnablements(stateContextStub).subscribe();
        });

        it('should patchState registrationEnablementStub with empty array ', () =>
          expect(stateContextStub.patchState).toHaveBeenCalledWith({
            registrationEnablements: [],
          }));
      });

      describe('when there is platform operation Types', () => {
        beforeEach(() => {
          jest
            .spyOn(registrationServiceStub, 'getEnablements')
            .mockReturnValue(of(registrationEnablements));
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({
            operationTypes: [operationTypeStub],
          });
          DataSelectionStateStub.getRegistrationEnablements(stateContextStub).subscribe();
        });

        it('should patchState registrationEnablementStub with  items data ', () =>
          expect(stateContextStub.patchState).toHaveBeenCalledWith({
            registrationEnablements,
          }));
      });

      describe('when there is platform operation Types, but no registration enablements', () => {
        beforeEach(() => {
          jest.spyOn(registrationServiceStub, 'getEnablements').mockReturnValue(of([]));
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({
            operationTypes: [operationTypeStub],
          });
          DataSelectionStateStub.getRegistrationEnablements(stateContextStub).subscribe();
        });

        it('should patchState registrationEnablementStub with new operation type data ', () =>
          expect(stateContextStub.patchState).toHaveBeenCalledWith({
            registrationEnablements: [
              {
                ...registrationEnablementStub,
                isActive: false,
                registrationId: 1,
                registrationEnablementUrl: '',
              },
            ],
          }));
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(registrationServiceStub, 'getEnablements')
          .mockReturnValue(throwError({ errorCode: 404 }));

        DataSelectionStateStub.getRegistrationEnablements(stateContextStub).subscribe();
      });

      it('should patchState registrationEnablementStub withempty array ', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          registrationEnablements: [],
          isLoading: false,
        }));
    });
  });

  describe('Action: UpdateRegistrationEnablement', () => {
    const registrationEnablement = registrationEnablementStub;
    beforeEach(() => {
      DataSelectionStateStub.updateRegistrationEnablement(stateContextStub, {
        registrationEnablement,
      });
    });

    it('shhould receive a registration enablement', () => {
      expect(registrationEnablement).toBeDefined();
    });

    it('should update reigistration enablements', () => {
      expect(stateContextStub.setState).toHaveBeenCalled();
    });
  });

  describe('Action: SaveRegistrationEnablements', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValue(1);
      jest.spyOn(registrationServiceStub, 'saveEnablements').mockReturnValue(of(null));
      jest.spyOn(stateContextStub, 'getState').mockReturnValue({ registrationEnablements: [] });
      DataSelectionStateStub.saveRegistrationEnablements(stateContextStub).subscribe();
    });

    it('should dispatch GetRegistrationEnablements action', () => {
      expect(stateContextStub.dispatch).toHaveBeenCalledWith(
        new actions.GetRegistrationEnablements()
      );
    });
  });

  describe('Action: PostMappingFile', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
    });

    describe('when postMappingFile succeed', () => {
      beforeEach(() => {
        jest.spyOn(registrationServiceStub, 'postMappingFile').mockReturnValue(of(null));
        DataSelectionStateStub.postMappingFile(stateContextStub, {
          operationTypeId: 1,
          file: { name: 'file' } as any,
        }).subscribe();
      });

      it('should open success toast message', () => {
        expect(toastServiceStub.open).toHaveBeenCalledWith(
          'Success!  file has been uploaded.',
          ToastStatus.Success
        );
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(registrationServiceStub, 'postMappingFile')
          .mockReturnValue(throwError({ errorCode: 500, reason: 'error' }));
        DataSelectionStateStub.postMappingFile(stateContextStub, {
          operationTypeId: 1,
          file: {} as any,
        }).subscribe();
      });

      it('should open error toast message', () => {
        expect(toastServiceStub.open).toHaveBeenCalledWith('error', ToastStatus.Error);
      });
    });
  });

  describe('Action: ClearDataSelection ', () => {
    beforeEach(() => {
      DataSelectionStateStub.clearDataSelection(stateContextStub);
    });

    it('should clear operation types and registration enablements from state', () => {
      expect(stateContextStub.patchState).toHaveBeenCalledWith({
        operationTypes: [],
        registrationEnablements: [],
      });
    });
  });
});
