// JSON Schema models are Uppercase properties, App models remain lowercase
import { Paging } from './response';

export interface PropertyGroup {
  Name: string;
  DisplayName: string;
  Description: string;
  IsHostSpecific: boolean;
  OperationTypes?: null;
  Properties: Property[];
}

export interface Property {
  ChoiceType?: string;
  ComplexType: string;
  DefaultValue: any;
  Description: string;
  DisplayName: string;
  FormatError: string;
  FormatMask: string;
  IsArray: boolean;
  IsRequired: boolean;
  IsSecret: boolean;
  MaxLength: number;
  MaxValue: number;
  MinLength: number;
  MinValue: number;
  Name: string;
  OperationTypes: null;
  Type: string;
  AuthProfile?: string;
}

export interface Choice {
  Name: string;
  Delimeter: string;
  Selection: string;
  Options: ChoiceOption[];
}

export interface Auth {
  Value: string;
  RedirectUrl: string;
  Finalized: boolean;
}

export interface ChoiceOption {
  Name: string;
  Value: string;
}

export interface ComplexType {
  Name: string;
  Properties: Property[];
}

export interface PropertyComplexRef {
  name: string;
  propertyName: string;
}

export interface JsonSchema {
  PropertyGroups: PropertyGroup[];
  Choices: Choice[];
  ComplexTypes: ComplexType[];
  Auth: Auth;
  Name: string;
}

export interface SchemaSettingsValue {
  hostname?: string;
  propertyGroups: GroupSettings[];
}

export interface GroupSettings {
  hostname?: string;
  isHostSpecific: boolean;
  name: string;
  properties: SettingValue[];
}

export class SettingValue {
  name: string;
  value: any;
}

export class HostnameSettings extends SettingValue {
  constructor() {
    super();
    this.name = '';

    this.value = {
      description: '',
      enabled: true,
    };
  }
}

export interface PropertySettingValue extends SettingValue {
  property: Property;
}

export interface ComplexSettingValue {
  complexType?: PropertyComplexRef;
  field: Property;
  settings: SettingValue;
  propertyGroupName?: string;
}
export interface Errors {
  [key: string]: PropertyError;
}

export interface PropertyError {
  [key: string]: PropertyError | string;
}

export interface OnPremAgent {
  items: OnPremAgentItem[];
  paging: Paging;
}

export interface OnPremAgentItem {
  agentSID: string;
  createdBy: string;
  createdDate: string;
  customerId: number;
  deactivatedBy: string;
  deactivatedDate: string;
  hostName: string;
  id: number;
  isDeactivated: boolean;
  isLockedOut: boolean;
  lastAccess: string;
  subscription: string;
  topic: string;
}
