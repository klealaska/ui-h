import { GroupSettings, HostnameSettings, PropertyComplexRef, SettingValue } from '../models';

export class GetConnectorSettings {
  static readonly type = '[ConnectorSettings] GetConnectorSettings';
}

export class GetSettings {
  static readonly type = '[ConnectorSettings] GetSettings';
}

export class GetOnPremAgents {
  static readonly type = '[ConnectorSettings] GetOnPremAgents';
  constructor(public customerId: number) {}
}

export class ActivateAgent {
  static readonly type = '[ConnectorSettings] Activate New Agent';
  constructor(public customerId: number, public userCode: string) {}
}

export class DeactivateAgent {
  static readonly type = '[ConnectorSettings] Deactivate Agent';
  constructor(public agentId: number, public customerId: number) {}
}

export class UpdateChangedSettings {
  static readonly type = '[ConnectorSettings] UpdateChangedSettings';
  constructor(public propertyGroupName: string, public settings: SettingValue) {}
}

export class ClearChangedSettings {
  static readonly type = '[ConnectorSettings] ClearChangedSettings';
}

export class MapChangedSettings {
  static readonly type = '[ConnectorSettings] MapChangedSettings';
}

export class PostHostnameSettings {
  static readonly type = '[ConnectorSettings] PostHostnameSettings';
  constructor(
    public customerId: number,
    public registrationId: number,
    public hostnames: HostnameSettings[]
  ) {}
}

export class PostConnectorSettings {
  static readonly type = '[ConnectorSettings] PostConnectorSettings';
  constructor(public groupSetting: GroupSettings[], public registrationId?: number) {}
}

export class SetErrorMessage {
  static readonly type = '[ConnectorSettings] SetErrorMessage';
  constructor(
    public propertyGroupName: string,
    public propertyName: string,
    public errorMessage: string,
    public complexPropertyName?: string
  ) {}
}

export class ClearErrorMessage {
  static readonly type = '[ConnectorSettings] ClearErrorMessage';
  constructor(
    public propertyGroupName: string,
    public propertyName: string,
    public complexType?: PropertyComplexRef
  ) {}
}

export class InitializeAuth {
  static readonly type = '[ConnectorSettings] InitializeAuth';
  constructor(public profile: string) {}
}

export class CheckAuth {
  static readonly type = '[ConnectorSettings] CheckAuth';
  constructor(public profile: string) {}
}

export class ClearErrors {
  static readonly type = '[ConnectorSettings] ClearErrors';
}
