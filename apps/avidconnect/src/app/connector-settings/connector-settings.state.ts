/* eslint-disable no-debugger */
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConnectorService } from '../core/services/connector.service';
import { CustomerService } from '../core/services/customer.service';
import { produce } from 'immer';
import {
  Auth,
  AvidException,
  Choice,
  ComplexType,
  Errors,
  GroupSettings,
  JsonSchema,
  OnPremAgent,
  PropertyError,
  PropertyGroup,
  SchemaSettingsValue,
  SettingValue,
} from '../models';
import * as actions from './connector-settings.actions';
import { Location } from '@angular/common';
import { ToastService } from '../core/services/toast.service';
import { AuthProfileService } from '../core/services/auth-profile.service';
import { ToastStatus } from '../core/enums';
import { CoreState } from '../core/state/core.state';

export interface ConnectorSettingsStateModel {
  jsonSchema: JsonSchema;
  groupsSettingValues: GroupSettings[];
  changedSettings: GroupSettings[];
  isHostSpecific: boolean;
  onPremAgents: OnPremAgent;
  errors: Errors;
}

const defaults: ConnectorSettingsStateModel = {
  jsonSchema: null,
  groupsSettingValues: [],
  changedSettings: [],
  isHostSpecific: false,
  onPremAgents: null,
  errors: {},
};

const onPremActivatePropGroup: PropertyGroup = {
  Name: 'ActivatedMachines',
  DisplayName: 'On-Prem Activation',
  IsHostSpecific: true,
  Description:
    'Review the machines that have been set up with the AvidConnect Agent and add additional machines.',
  OperationTypes: null,
  Properties: [
    {
      Name: null,
      DisplayName: null,
      Description: null,
      Type: 'agent',
      IsArray: null,
      ChoiceType: null,
      ComplexType: null,
      AuthProfile: null,
      MinValue: null,
      MaxValue: null,
      MaxLength: null,
      MinLength: null,
      FormatMask: null,
      FormatError: null,
      IsRequired: null,
      IsSecret: null,
      DefaultValue: null,
      OperationTypes: null,
    },
  ],
};

const agentPropertyGroup: PropertyGroup = {
  Name: 'AgentRegistration',
  DisplayName: 'Agents',
  IsHostSpecific: false,
  Description: 'Associate agents to the accounting system instance.',
  OperationTypes: null,
  Properties: [
    {
      Name: null,
      DisplayName: null,
      Description: null,
      Type: 'agent',
      IsArray: null,
      ChoiceType: null,
      ComplexType: null,
      AuthProfile: null,
      MinValue: null,
      MaxValue: null,
      MaxLength: null,
      MinLength: null,
      FormatMask: null,
      FormatError: null,
      IsRequired: null,
      IsSecret: null,
      DefaultValue: null,
      OperationTypes: null,
    },
  ],
};

@State<ConnectorSettingsStateModel>({
  name: 'connectorSettings',
  defaults,
})
@Injectable()
export class ConnectorSettingsState {
  constructor(
    private connectorService: ConnectorService,
    private customerService: CustomerService,
    private location: Location,
    private toast: ToastService,
    private store: Store,
    private authProfileService: AuthProfileService
  ) {}

  @Selector()
  static jsonSchema(state: ConnectorSettingsStateModel): JsonSchema {
    return state.jsonSchema;
  }

  @Selector()
  static groupsSettingValues(state: ConnectorSettingsStateModel): GroupSettings[] {
    return state.groupsSettingValues;
  }

  @Selector()
  static propertyGroups(state: ConnectorSettingsStateModel): PropertyGroup[] {
    return state.isHostSpecific
      ? state.jsonSchema.PropertyGroups.filter(group => group.IsHostSpecific)
      : state.jsonSchema.PropertyGroups;
  }

  @Selector()
  static propertyGroup(state: ConnectorSettingsStateModel): (name: string) => PropertyGroup {
    return (name: string) => state.jsonSchema.PropertyGroups.find(group => group.Name === name);
  }

  @Selector()
  static changedSettings(state: ConnectorSettingsStateModel): GroupSettings[] {
    return state.changedSettings;
  }

  @Selector()
  static onPremAgents(state: ConnectorSettingsStateModel): OnPremAgent {
    return state.onPremAgents;
  }

  @Selector()
  static errors(state: ConnectorSettingsStateModel): any {
    return state.errors;
  }

  @Selector()
  static hostnames(state: ConnectorSettingsStateModel): SettingValue[] {
    return (
      state.groupsSettingValues.find(group => group.name === 'platform:host-metadata')
        ?.properties || []
    );
  }

  @Selector()
  static getChoiceProperty(state: ConnectorSettingsStateModel): (name: string) => Choice {
    return (name: string) => state.jsonSchema.Choices?.find(choice => choice.Name === name);
  }

  @Selector()
  static getComplexTypeProperty(state: ConnectorSettingsStateModel): (name: string) => ComplexType {
    return (name: string) => state.jsonSchema.ComplexTypes?.find(choice => choice.Name === name);
  }

  @Selector()
  static getAuthProperty(state: ConnectorSettingsStateModel): Auth {
    return state.jsonSchema.Auth;
  }

  @Action(actions.GetConnectorSettings)
  getConnectorSettings({
    patchState,
  }: StateContext<ConnectorSettingsStateModel>): Observable<JsonSchema> {
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    const connectorId = this.store.selectSnapshot<number>(CoreState.connectorId);
    const params = registrationId ? { registrationId } : null;

    return this.connectorService.getConnectorSettings(connectorId, params).pipe(
      tap(schema => {
        const jsonSchema = Object.assign({}, schema);
        if (!params) {
          jsonSchema.PropertyGroups.push(onPremActivatePropGroup);
        } else {
          jsonSchema.PropertyGroups.push(agentPropertyGroup);
        }
        patchState({ jsonSchema });
      }),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        patchState({ jsonSchema: null });
        throw err;
      })
    );
  }

  @Action(actions.GetSettings)
  getSettings({
    patchState,
  }: StateContext<ConnectorSettingsStateModel>): Observable<
    SchemaSettingsValue[] | SchemaSettingsValue
  > {
    const customerId = this.store.selectSnapshot<number>(CoreState.customerId);
    const registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);

    if (registrationId) {
      patchState({ isHostSpecific: false });
      return this.customerService.getRegistrationSettings(customerId, registrationId).pipe(
        tap(result => {
          const groupsSettingValues = result.find(s => s.hostname === null).propertyGroups;
          patchState({ groupsSettingValues });
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          patchState({ groupsSettingValues: [] });
          throw err;
        })
      );
    } else {
      patchState({ isHostSpecific: true });

      return this.customerService.getSettings(customerId).pipe(
        tap(result => {
          const groupsSettingValues = result.propertyGroups;
          patchState({ groupsSettingValues });
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          patchState({ groupsSettingValues: [] });
          throw err;
        })
      );
    }
  }

  @Action(actions.GetOnPremAgents)
  getOnPremAgents(
    { patchState }: StateContext<ConnectorSettingsStateModel>,
    { customerId }: actions.GetOnPremAgents
  ): Observable<OnPremAgent> {
    return this.customerService.getAgentList(customerId).pipe(
      tap(onPremAgents => patchState({ onPremAgents })),
      catchError((err: AvidException) => {
        this.toast.open('Failure getting agents list', ToastStatus.Error);
        throw err.reason;
      })
    );
  }

  @Action(actions.ActivateAgent)
  activateAgent(
    ctx: StateContext<ConnectorSettingsStateModel>,
    { customerId, userCode }: actions.ActivateAgent
  ): Observable<any> {
    return this.customerService.activateAgent(customerId, userCode).pipe(
      catchError((err: AvidException) => {
        this.toast.open('Machine activation failed', ToastStatus.Error);
        throw err.reason;
      })
    );
  }

  @Action(actions.DeactivateAgent)
  deactivateAgent(
    ctx: StateContext<ConnectorSettingsStateModel>,
    { agentId, customerId }: actions.DeactivateAgent
  ): Observable<any> {
    return this.customerService.deactivateAgent(agentId, customerId).pipe(
      tap(() => {
        this.store.dispatch(new actions.GetOnPremAgents(customerId));
      }),
      catchError((err: AvidException) => {
        this.toast.open('Machine Deactivation Failed', ToastStatus.Error);
        throw err.reason;
      })
    );
  }

  @Action(actions.PostHostnameSettings)
  postHostnameSettings(
    { dispatch }: StateContext<ConnectorSettingsStateModel>,
    { registrationId, hostnames }: actions.PostHostnameSettings
  ): Observable<number> {
    const groupSetting: GroupSettings = {
      name: 'platform:host-metadata',
      isHostSpecific: false,
      properties: hostnames,
    };
    const customerId = this.store.selectSnapshot<number>(CoreState.customerId);

    return this.customerService
      .saveRegistrationSettings(customerId, registrationId, [groupSetting])
      .pipe(
        tap(() => {
          this.toast.open('Success! Hostname settings saved', ToastStatus.Success);
          dispatch(new actions.GetSettings());
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          throw err.reason;
        })
      );
  }

  @Action(actions.PostConnectorSettings)
  postConnectorSettings(
    _: StateContext<ConnectorSettingsStateModel>,
    { registrationId, groupSetting }: actions.PostConnectorSettings
  ): Observable<number> {
    const customerId = this.store.selectSnapshot<number>(CoreState.customerId);

    if (registrationId) {
      return this.customerService
        .saveRegistrationSettings(customerId, registrationId, groupSetting)
        .pipe(
          tap(() => {
            this.toast.open(
              `Success!  Accounting system settings have been updated.`,
              ToastStatus.Success
            );
          }),
          catchError((err: AvidException) => {
            this.toast.open(err.reason, ToastStatus.Error);
            throw err.reason;
          })
        );
    } else {
      return this.customerService.saveSettings(customerId, groupSetting).pipe(
        tap(() => {
          this.toast.open(`Success!  Settings have been updated.`, ToastStatus.Success);
        }),
        catchError((err: AvidException) => {
          this.toast.open(err.reason, ToastStatus.Error);
          throw err.reason;
        })
      );
    }
  }

  @Action(actions.UpdateChangedSettings)
  updateChangedSettings(
    { setState, getState, dispatch }: StateContext<ConnectorSettingsStateModel>,
    { propertyGroupName, settings }: actions.UpdateChangedSettings
  ): void {
    const state = produce(getState(), draft => {
      const groupSetting = draft.changedSettings.find(group => group.name === propertyGroupName);

      if (groupSetting) {
        const property = groupSetting.properties.find(prop => prop.name === settings.name);

        if (property) {
          property.value = settings.value;
        } else {
          groupSetting.properties = [...groupSetting.properties, settings];
        }
      } else {
        draft.changedSettings.push({
          name: propertyGroupName,
          isHostSpecific: false,
          hostname: null,
          properties: [settings],
        });
      }
    });

    setState(state);

    dispatch(new actions.MapChangedSettings());
  }

  @Action(actions.MapChangedSettings)
  mapChangedSettings({ getState, setState }: StateContext<ConnectorSettingsStateModel>): void {
    const state = produce(getState(), draft => {
      draft.changedSettings.forEach(changedGroup => {
        const settingsGroup = draft.groupsSettingValues.find(
          group => group.name === changedGroup.name
        );

        changedGroup?.properties.forEach((property: SettingValue) => {
          const settings = settingsGroup?.properties.find(prop => prop.name === property.name);
          settings.value = property.value;
        });
      });
    });

    setState(state);
  }

  @Action(actions.ClearChangedSettings)
  clearChangedSettings({ patchState }: StateContext<ConnectorSettingsStateModel>): void {
    patchState({ changedSettings: [] });
  }

  @Action(actions.SetErrorMessage)
  setErrorMessage(
    { getState, setState }: StateContext<ConnectorSettingsStateModel>,
    { propertyGroupName, propertyName, errorMessage, complexPropertyName }: actions.SetErrorMessage
  ): void {
    let error: PropertyError = {
      [propertyName]: errorMessage,
    };

    if (complexPropertyName) {
      error = {
        [complexPropertyName]: error,
      };
    }

    const state = produce(getState(), draft => {
      if (
        complexPropertyName &&
        draft.errors[propertyGroupName] &&
        draft.errors[propertyGroupName][complexPropertyName] &&
        typeof draft.errors[propertyGroupName][complexPropertyName] === 'string'
      ) {
        draft.errors[propertyGroupName] = { ...draft.errors[propertyGroupName], ...error };
      } else if (
        complexPropertyName &&
        draft.errors[propertyGroupName] &&
        draft.errors[propertyGroupName][complexPropertyName]
      ) {
        const complexPropertyErrors = draft.errors[propertyGroupName][complexPropertyName];
        complexPropertyErrors[propertyName] = errorMessage;
        draft.errors[propertyGroupName] = { ...draft.errors[propertyGroupName] };
      } else {
        draft.errors[propertyGroupName] = { ...draft.errors[propertyGroupName], ...error };
      }
    });

    setState(state);
  }

  @Action(actions.ClearErrorMessage)
  clearErrorMessage(
    { getState, setState }: StateContext<ConnectorSettingsStateModel>,
    { propertyGroupName, propertyName, complexType }: actions.ClearErrorMessage
  ): void {
    const state = produce(getState(), draft => {
      const groupErrors = draft.errors[propertyGroupName];

      if (groupErrors) {
        complexType
          ? delete groupErrors[complexType.propertyName][propertyName]
          : delete groupErrors[propertyName];
      }

      if (!Object.keys(groupErrors || {}).length) {
        delete draft.errors[propertyGroupName];
      }
    });

    setState(state);
  }

  @Action(actions.InitializeAuth)
  InitializeAuth(
    { setState, patchState, getState }: StateContext<ConnectorSettingsStateModel>,
    profile: string
  ) {
    const jsonSchemaDraft = produce(getState(), draft => {
      draft.jsonSchema;
    }).jsonSchema;

    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    const url = this.authProfileService.initializeAuth(registrationId, profile);
    const jsonSchema = { ...jsonSchemaDraft };
    jsonSchema.Auth = { Value: '', RedirectUrl: url, Finalized: false };
    patchState({ jsonSchema });
  }

  @Action(actions.CheckAuth)
  AuthCheck(
    { setState, patchState, getState }: StateContext<ConnectorSettingsStateModel>,
    profile: string
  ) {
    const registrationId = this.store.selectSnapshot(CoreState.registrationId);
    const jsonSchemaDraft = produce(getState(), draft => {
      draft.jsonSchema;
    }).jsonSchema;

    return this.authProfileService.checkAuth(registrationId, profile).pipe(
      tap(result => {
        if (result) {
          this.toast.open('Authentication Succeeded', ToastStatus.Success);
          const auth = {
            Value: 'Authorized on' + new Date().toString(),
            Finalized: result,
          } as Auth;
          const jsonSchema = { ...jsonSchemaDraft };
          jsonSchema.Auth = auth;
          patchState({ jsonSchema });
        }
      }),
      catchError((err: AvidException) => {
        this.toast.open(err.reason, ToastStatus.Error);
        patchState({ jsonSchema: null });
        throw err;
      })
    );
  }

  @Action(actions.ClearErrors)
  clearErrors({ patchState }: StateContext<ConnectorSettingsStateModel>): void {
    patchState({ errors: {} });
  }
}
