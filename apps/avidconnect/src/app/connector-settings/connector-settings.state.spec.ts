import { of, throwError } from 'rxjs';
import {
  authServiceStub,
  choiceStub,
  complexStub,
  connectorServiceStub,
  customerServiceStub,
  groupSettingsStub,
  hostnamePropertyGroupStub,
  hostnamePropertyStub,
  jsonSchemaStub,
  locationStub,
  propertyGroupStub,
  settingsStub,
  stateContextStub,
  storeStub,
  toastServiceStub,
  authPropertyStub,
  onPremAgentsStub,
} from '../../test/test-stubs';
import { ToastStatus } from '../core/enums';
import { GroupSettings, JsonSchema, OnPremAgent, PropertyError } from '../models';
import { ConnectorSettingsState } from './connector-settings.state';
import * as actions from './connector-settings.actions';
import DoneCallback = jest.DoneCallback;

describe('ConnectorSettingsState', () => {
  const ConnectorSettingsStateStub = new ConnectorSettingsState(
    connectorServiceStub as any,
    customerServiceStub as any,
    locationStub as any,
    toastServiceStub as any,
    storeStub as any,
    authServiceStub as any
  );

  describe('Selectors', () => {
    const ConnectorSettingsStateStub = {
      jsonSchema: jsonSchemaStub as JsonSchema,
      groupsSettingValues: [hostnamePropertyGroupStub] as GroupSettings[],
      changedSettings: [groupSettingsStub] as GroupSettings[],
      errors: {} as PropertyError,
      isHostSpecific: false,
      onPremAgents: onPremAgentsStub as OnPremAgent,
    };

    it('should select jsonSchema from state', () =>
      expect(ConnectorSettingsState.jsonSchema(ConnectorSettingsStateStub as any)).toBe(
        ConnectorSettingsStateStub.jsonSchema
      ));

    it('should select groupsSettingValues from state', () =>
      expect(ConnectorSettingsState.groupsSettingValues(ConnectorSettingsStateStub as any)).toBe(
        ConnectorSettingsStateStub.groupsSettingValues
      ));

    describe('propertyGroups', () => {
      describe('isHostSpecific = true', () => {
        it('should select propertyGroups from state', () => {
          ConnectorSettingsStateStub.isHostSpecific = true;
          expect(ConnectorSettingsState.propertyGroups(ConnectorSettingsStateStub as any)).toEqual(
            []
          );
        });
      });

      describe('isHostSpecific = false', () => {
        it('should select propertyGroups from state', () => {
          ConnectorSettingsStateStub.isHostSpecific = false;
          expect(ConnectorSettingsState.propertyGroups(ConnectorSettingsStateStub as any)).toEqual(
            []
          );
        });
      });
    });

    it('should select propertyGroup from state', () =>
      expect(ConnectorSettingsState.propertyGroup(ConnectorSettingsStateStub as any)('test')).toBe(
        propertyGroupStub
      ));

    it('should select changedSettings from state', () =>
      expect(ConnectorSettingsState.changedSettings(ConnectorSettingsStateStub as any)).toBe(
        ConnectorSettingsStateStub.changedSettings
      ));

    it('should select errors from state', () =>
      expect(ConnectorSettingsState.errors(ConnectorSettingsStateStub as any)).toBe(
        ConnectorSettingsStateStub.errors
      ));

    it('should select hostnames from state', () =>
      expect(ConnectorSettingsState.hostnames(ConnectorSettingsStateStub as any)).toBe(
        hostnamePropertyGroupStub.properties
      ));

    it('should select an empty array of hostnames ', () =>
      expect(ConnectorSettingsState.hostnames({ groupsSettingValues: [] } as any)).toEqual([]));

    it('should select choice property from state from given name', () =>
      expect(
        ConnectorSettingsState.getChoiceProperty(ConnectorSettingsStateStub as any)('test')
      ).toBe(choiceStub));
    it('should auth property from state from given name', () =>
      expect(ConnectorSettingsState.getAuthProperty(ConnectorSettingsStateStub as any)).toBe(
        authPropertyStub
      ));
    it('should select complex property from state from given name', () =>
      expect(
        ConnectorSettingsState.getComplexTypeProperty(ConnectorSettingsStateStub as any)('test')
      ).toBe(complexStub));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Action: GetConnectorSettings', () => {
    describe('when service returns data', () => {
      beforeEach(() => {
        connectorServiceStub.getConnectorSettings.mockReturnValue(of(jsonSchemaStub));
        ConnectorSettingsStateStub.getConnectorSettings(stateContextStub).subscribe();
      });

      it('should patchState jsonSchema with response data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ jsonSchema: jsonSchemaStub }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        connectorServiceStub.getConnectorSettings.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState jsonSchema with null valuey', () => {
        ConnectorSettingsStateStub.getConnectorSettings(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { jsonSchema: null });
          }
        );
      });
    });
  });

  describe('Action: GetOnPremAgents', () => {
    it('should populate state with data on a successful response', (done: DoneCallback) => {
      jest.spyOn(customerServiceStub, 'getAgentList').mockReturnValue(of(onPremAgentsStub));
      ConnectorSettingsStateStub.getOnPremAgents(stateContextStub, { customerId: 3358 }).subscribe(
        (res: OnPremAgent) => {
          expect(stateContextStub.patchState).toHaveBeenCalledWith({ onPremAgents: res });
          done();
        }
      );
    });

    it('should display a toast when there is an error', (done: DoneCallback) => {
      jest
        .spyOn(customerServiceStub, 'getAgentList')
        .mockReturnValueOnce(throwError({ errorCode: '404' }));
      ConnectorSettingsStateStub.getOnPremAgents(stateContextStub, { customerId: 3358 }).subscribe({
        error: () => {
          expect(toastServiceStub.open).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('Action: ActivateAgent', () => {
    it('should activate an agent successfully', (done: DoneCallback) => {
      jest.spyOn(customerServiceStub, 'activateAgent').mockReturnValue(of({}));
      ConnectorSettingsStateStub.activateAgent(stateContextStub, {
        customerId: 3358,
        userCode: '1111 1111 1111 1111',
      }).subscribe(() => {
        expect(toastServiceStub.open).not.toHaveBeenCalled();
        done();
      });
    });

    it('should display the toast on an error', (done: DoneCallback) => {
      jest
        .spyOn(customerServiceStub, 'activateAgent')
        .mockReturnValue(throwError({ errorCode: '404' }));
      ConnectorSettingsStateStub.activateAgent(stateContextStub, {
        customerId: 3358,
        userCode: '1111 1111 1111 1111',
      }).subscribe({
        error: () => {
          expect(toastServiceStub.open).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('Action: DeactivateAgent', () => {
    it('should deactivate an agent successfully', (done: DoneCallback) => {
      jest.spyOn(customerServiceStub, 'deactivateAgent').mockReturnValue(of({}));
      ConnectorSettingsStateStub.deactivateAgent(stateContextStub, {
        agentId: 1234,
        customerId: 3358,
      }).subscribe(() => {
        expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.GetOnPremAgents(3358));
        expect(toastServiceStub.open).not.toHaveBeenCalled();
        done();
      });
    });

    it('should display the toast on an error', (done: DoneCallback) => {
      jest
        .spyOn(customerServiceStub, 'deactivateAgent')
        .mockReturnValue(throwError({ errorCode: '404' }));
      ConnectorSettingsStateStub.deactivateAgent(stateContextStub, {
        agentId: 1234,
        customerId: 3358,
      }).subscribe({
        error: () => {
          expect(toastServiceStub.open).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('Action: GetSettings', () => {
    describe('when registrationId is given', () => {
      describe('when service returns data', () => {
        beforeEach(() => {
          jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce(1).mockReturnValueOnce(3);
          customerServiceStub.getRegistrationSettings.mockReturnValue(of([settingsStub]));
          ConnectorSettingsStateStub.getSettings(stateContextStub).subscribe();
        });

        it('should patchState settings with response data', () =>
          expect(stateContextStub.patchState).toHaveBeenCalledWith({ isHostSpecific: false }));
      });

      describe('when receiving an error', () => {
        beforeEach(() => {
          jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce(1).mockReturnValueOnce(3);
          customerServiceStub.getRegistrationSettings.mockReturnValue(
            throwError({ errorCode: '404' })
          );
        });

        it('should patchState settings with null value', () => {
          ConnectorSettingsStateStub.getSettings(stateContextStub).subscribe(
            () => {
              return;
            },
            () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                groupsSettingValues: null,
              });
            }
          );
        });
      });
    });

    describe('when registrationId is not defined', () => {
      describe('when service returns data', () => {
        beforeEach(() => {
          customerServiceStub.getSettings.mockReturnValue(of([settingsStub]));
          ConnectorSettingsStateStub.getSettings(stateContextStub).subscribe();
        });

        it('should patchState settings with response data', () =>
          expect(stateContextStub.patchState).toHaveBeenCalledWith({ isHostSpecific: true }));
      });

      describe('when receiving an error', () => {
        beforeEach(() => {
          customerServiceStub.getSettings.mockReturnValue(throwError({ errorCode: '404' }));
        });

        it('should patchState settings with null valuey', () => {
          ConnectorSettingsStateStub.getSettings(stateContextStub).subscribe(
            () => {
              return;
            },
            () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                groupsSettingValues: null,
              });
            }
          );
        });
      });
    });
  });

  describe('Action: PostHostnameSettings', () => {
    const customerId = 1;
    const registrationId = 1;
    const hostnames = [hostnamePropertyStub];

    describe('when succesfully call post registration settings', () => {
      beforeEach(() => {
        jest.spyOn(customerServiceStub, 'saveRegistrationSettings').mockReturnValue(of(null));
        ConnectorSettingsStateStub.postHostnameSettings(stateContextStub, {
          registrationId,
          customerId,
          hostnames,
        }).subscribe();
      });

      it('should show toast with success message', () =>
        expect(toastServiceStub.open).toHaveBeenNthCalledWith(
          1,
          'Success! Hostname settings saved',
          ToastStatus.Success
        ));
    });

    describe('when there is an error on customer post', () => {
      beforeEach(() => {
        customerServiceStub.saveRegistrationSettings.mockReturnValue(
          throwError({ errorCode: '404' })
        );
      });

      it('should handle error callback', () => {
        ConnectorSettingsStateStub.postHostnameSettings(stateContextStub, {
          customerId,
          registrationId,
          hostnames,
        }).subscribe({
          error: () => {
            expect(customerServiceStub.saveRegistrationSettings).toThrow();
          },
        });
      });
    });
  });

  describe('Action: PostConnectorSettings', () => {
    describe('when registrationId is given', () => {
      const registrationId = 1;
      const groupSetting = [groupSettingsStub];

      describe('when succesfully call post registration settings', () => {
        beforeEach(() => {
          jest.spyOn(customerServiceStub, 'saveRegistrationSettings').mockReturnValue(of(null));
          ConnectorSettingsStateStub.postConnectorSettings(stateContextStub, {
            registrationId,
            groupSetting,
          }).subscribe();
        });

        it('should show toast with success message', () =>
          expect(toastServiceStub.open).toHaveBeenNthCalledWith(
            1,
            'Success!  Accounting system settings have been updated.',
            ToastStatus.Success
          ));
      });

      describe('when there is an error on customer post', () => {
        beforeEach(() => {
          customerServiceStub.saveRegistrationSettings.mockReturnValue(
            throwError({ errorCode: '404' })
          );
        });

        it('should handle error callback', () => {
          ConnectorSettingsStateStub.postConnectorSettings(stateContextStub, {
            registrationId,
            groupSetting,
          }).subscribe({
            error: () => {
              expect(customerServiceStub.saveRegistrationSettings).toThrow();
            },
          });
        });
      });
    });

    describe('when registrationId is not defined', () => {
      const registrationId = null;
      const groupSetting = [groupSettingsStub];

      describe('when succesfully call post customer settings', () => {
        beforeEach(() => {
          jest.spyOn(customerServiceStub, 'saveSettings').mockReturnValue(of(null));
          ConnectorSettingsStateStub.postConnectorSettings(stateContextStub, {
            registrationId,
            groupSetting,
          }).subscribe();
        });

        it('should show toast with success message', () =>
          expect(toastServiceStub.open).toHaveBeenNthCalledWith(
            1,
            'Success!  Settings have been updated.',
            ToastStatus.Success
          ));
      });

      describe('when there is an error on settings post', () => {
        beforeEach(() => {
          customerServiceStub.saveSettings.mockReturnValue(throwError({ errorCode: '404' }));
        });

        it('should handle error callback', () => {
          ConnectorSettingsStateStub.postConnectorSettings(stateContextStub, {
            registrationId,
            groupSetting,
          }).subscribe({
            error: () => {
              expect(customerServiceStub.saveSettings).toThrow();
            },
          });
        });
      });
    });
  });

  describe('Action: UpdateChangedSettings', () => {
    describe('if GroupSetting exist', () => {
      beforeEach(() => {
        jest.spyOn(stateContextStub, 'getState').mockReturnValue({
          changedSettings: [groupSettingsStub],
        });
      });
      describe('if Property exist on group setting', () => {
        beforeEach(() => {
          ConnectorSettingsStateStub.updateChangedSettings(stateContextStub, {
            propertyGroupName: 'test',
            settings: { name: 'test', value: 'new value' },
          });
        });
        it('should override property value', () => {
          expect(stateContextStub.setState).toHaveBeenCalledWith({
            changedSettings: [
              {
                ...groupSettingsStub,
                properties: [{ ...groupSettingsStub.properties[0], value: 'new value' }],
              },
            ],
          });
        });

        it('should dispatch MapChangedSettings action', () => {
          expect(stateContextStub.dispatch).toHaveBeenCalledWith(new actions.MapChangedSettings());
        });
      });

      describe('if Property does not exist', () => {
        const settings = { name: 'newProperty', value: 'new value' };

        beforeEach(() => {
          ConnectorSettingsStateStub.updateChangedSettings(stateContextStub, {
            propertyGroupName: 'test',
            settings,
          });
        });
        it('should add new property to groupSettings', () => {
          expect(stateContextStub.setState).toHaveBeenCalledWith({
            changedSettings: [
              {
                ...groupSettingsStub,
                properties: [...groupSettingsStub.properties, settings],
              },
            ],
          });
        });
      });
    });

    describe('if GroupSetting does not exist', () => {
      const settings = { name: 'test', value: 'test' };

      beforeEach(() => {
        jest.spyOn(stateContextStub, 'getState').mockReturnValue({
          changedSettings: [],
        });

        ConnectorSettingsStateStub.updateChangedSettings(stateContextStub, {
          propertyGroupName: 'test',
          settings,
        });
      });

      it('should add new GroupSetting', () => {
        expect(stateContextStub.setState).toHaveBeenCalledWith({
          changedSettings: [
            {
              ...groupSettingsStub,
              hostname: null,
            },
          ],
        });
      });
    });
  });

  describe('Action: MapChangedSettings', () => {
    beforeEach(() => {
      jest.spyOn(stateContextStub, 'getState').mockReturnValue({
        changedSettings: [groupSettingsStub],
        groupsSettingValues: [groupSettingsStub],
      });
      ConnectorSettingsStateStub.mapChangedSettings(stateContextStub);
    });

    it('should map changed settings into groupsSettingValues state', () => {
      expect(stateContextStub.setState).toHaveBeenCalledWith({
        changedSettings: [groupSettingsStub],
        groupsSettingValues: [groupSettingsStub],
      });
    });
  });

  describe('Action: ClearChangedSettings', () => {
    beforeEach(() => {
      ConnectorSettingsStateStub.clearChangedSettings(stateContextStub);
    });

    it('should clear changedSettings array', () => {
      expect(stateContextStub.patchState).toHaveBeenCalledWith({ changedSettings: [] });
    });
  });

  describe('Action: SetErrorMessage', () => {
    describe('if it is complexPropertyName', () => {
      const errorMessage = {
        propertyGroupName: 'groupName',
        propertyName: 'property',
        errorMessage: 'property is invalid',
        complexPropertyName: 'complexType',
      };

      describe('if complex error message already exist and error type is string', () => {
        beforeEach(() => {
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({
            errors: { groupName: { complexType: 'value' } },
          });
          ConnectorSettingsStateStub.setErrorMessage(stateContextStub, errorMessage);
        });

        it('should set complex type property error message in errors state object', () => {
          expect(stateContextStub.setState).toHaveBeenCalledWith({
            errors: {
              [errorMessage.propertyGroupName]: {
                [errorMessage.complexPropertyName]: {
                  [errorMessage.propertyName]: errorMessage.errorMessage,
                },
              },
            },
          });
        });
      });

      describe('if complex error message already exist', () => {
        beforeEach(() => {
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({
            errors: { groupName: { complexType: { property: 'value' } } },
          });
          ConnectorSettingsStateStub.setErrorMessage(stateContextStub, errorMessage);
        });

        it('should update complex type property error message in errors state object', () => {
          expect(stateContextStub.setState).toHaveBeenCalledWith({
            errors: {
              [errorMessage.propertyGroupName]: {
                [errorMessage.complexPropertyName]: {
                  [errorMessage.propertyName]: errorMessage.errorMessage,
                },
              },
            },
          });
        });
      });

      describe('if complex error message does not exist', () => {
        beforeEach(() => {
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({
            errors: {},
          });
          ConnectorSettingsStateStub.setErrorMessage(stateContextStub, errorMessage);
        });

        it('should set complex type property error message in errors state object', () => {
          expect(stateContextStub.setState).toHaveBeenCalledWith({
            errors: {
              [errorMessage.propertyGroupName]: {
                [errorMessage.complexPropertyName]: {
                  [errorMessage.propertyName]: errorMessage.errorMessage,
                },
              },
            },
          });
        });
      });
    });

    describe('if it is not complexPropertyName', () => {
      const errorMessage = {
        propertyGroupName: 'groupName',
        propertyName: 'property',
        errorMessage: 'property is invalid',
      };

      beforeEach(() => {
        jest.spyOn(stateContextStub, 'getState').mockReturnValue({
          errors: {},
        });
        ConnectorSettingsStateStub.setErrorMessage(stateContextStub, errorMessage);
      });

      it('should set new error message in errors state object', () => {
        expect(stateContextStub.setState).toHaveBeenCalledWith({
          errors: {
            [errorMessage.propertyGroupName]: {
              [errorMessage.propertyName]: errorMessage.errorMessage,
            },
          },
        });
      });
    });
  });

  describe('Action: ClearErrorMessage', () => {
    const errorMessage = {
      propertyGroupName: 'groupName',
      propertyName: 'property',
      errorMessage: 'property is invalid',
    } as any;

    describe('if error exists', () => {
      describe('if it is not complex type property', () => {
        beforeEach(() => {
          jest.spyOn(stateContextStub, 'getState').mockReturnValue({
            errors: { groupName: { property: 'error' } },
          });
          ConnectorSettingsStateStub.clearErrorMessage(stateContextStub, errorMessage);
        });

        it('should delete error message from errors object', () => {
          expect(stateContextStub.setState).toHaveBeenCalledWith({
            errors: {},
          });
        });
      });
    });
  });

  describe('Action: ClearErrors', () => {
    beforeEach(() => {
      ConnectorSettingsStateStub.clearErrors(stateContextStub);
    });

    it('should clear errors object', () => {
      expect(stateContextStub.patchState).toHaveBeenCalledWith({ errors: {} });
    });
  });
});
