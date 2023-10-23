import { AppName, UserAccount } from '@ui-coe/shared/util/auth';
import { of } from 'rxjs';
import { ChoiceSelection } from '../app/core/enums';
import {
  Auth,
  Choice,
  ComplexType,
  Connector,
  ConnectorItem,
  ConnectorSummary,
  Customer,
  Execution,
  GroupSettings,
  HostnameSettings,
  JsonSchema,
  OnPremAgent,
  Operation,
  OperationType,
  Organization,
  OrganizationAccountingSystem,
  OrganizationOption,
  Platform,
  Property,
  PropertyGroup,
  Registration,
  RegistrationEnablement,
  Schedule,
  SchemaSettingsValue,
  SettingValue,
  UserProfile,
} from '../app/models';
import { AppConfig } from '../assets/config/app.config.model';
import { UserRoles } from '../app/core/enums/user-roles';

// State Stubs
export const stateContextStub = {
  getState: jest.fn(),
  setState: jest.fn(),
  patchState: jest.fn(),
  dispatch: jest.fn(),
};

// API Services Stubs
export const authServiceStub = {
  getUserInfo: jest.fn(),
  acquireTokenPopup: jest.fn(),
  getScopesForEndpoint: jest.fn(),
  getAccessToken: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
};

export const configServiceStub = {
  get: jest.fn(),
};

export const userServiceStub = {
  getProfile: jest.fn(),
  getPhoto: jest.fn(),
};

export const platformServiceStub = {
  getAll: jest.fn(),
  getOperationTypes: jest.fn(),
  getById: jest.fn(),
};

export const customerServiceStub = {
  getAll: jest.fn(),
  getById: jest.fn(),
  addCustomer: jest.fn(),
  getCustomerWithToken: jest.fn(),
  getRegistrationSettings: jest.fn(),
  getSettings: jest.fn(),
  saveSettings: jest.fn(),
  saveRegistrationSettings: jest.fn(),
  getAgentList: jest.fn(),
  activateAgent: jest.fn(),
  deactivateAgent: jest.fn(),
  agentRegistration: jest.fn(),
};

export const connectorServiceStub = {
  getAll: jest.fn(),
  search: jest.fn(),
  getSummaryList: jest.fn(),
  getConnectorSettings: jest.fn(),
  getLogo: jest.fn(() => of({})),
  getOperations: jest.fn(),
  getCustomers: jest.fn(),
  getOperationTypes: jest.fn(),
  getById: jest.fn(),
};

export const authCacheConnectorStub = {
  getAuth: jest.fn(),
  saveAuth: jest.fn(),
};

export const operationServiceStub = {
  getByCustomer: jest.fn(),
  getById: jest.fn(),
  getDetails: jest.fn(),
};

export const platformDataServiceStub = {
  searchOrganizations: jest.fn(),
  getOrganizationAccountingSystems: jest.fn(),
};

export const registrationServiceStub = {
  addRegistration: jest.fn(),
  getRegistrationsDetail: jest.fn(),
  getEnablements: jest.fn(),
  saveEnablements: jest.fn(),
  postMappingFile: jest.fn(),
  getById: jest.fn(),
};

export const syncServiceStub = {
  postExecution: jest.fn(),
};

export const executionServiceStub = {
  getEvents: jest.fn(),
  getArtifacts: jest.fn(),
};

export const scheduleServiceStub = {
  getSchedules: jest.fn(),
  updateSchedule: jest.fn(),
  addSchedule: jest.fn(),
  getTimeZones: jest.fn(),
};

export const navigationChevronServiceStub = {
  getNavigationChevron: jest.fn(),
};

export const locationStub = {
  back: jest.fn(),
};

export const dialogStub = {
  open: jest.fn(),
};

export const schemaHelperStub = {
  validatePropertyValue: jest.fn(),
};

export const storeStub = {
  dispatch: jest.fn(() => of()),
  select: jest.fn(() => of()),
  selectSnapshot: jest.fn(),
};

export const httpClientStub = {
  get: jest.fn(),
};

export const dialogRefStub = {
  close: jest.fn(),
};

export const domSanitizerStub = {
  bypassSecurityTrustUrl: jest.fn(),
};

export const toastServiceStub = {
  open: jest.fn(),
};

export const routerStub = {
  navigate: jest.fn(),
};

// Returned Values Stubs
/* sub: string;
name: string;
email: string;
preferred_username: string;
auth_time: number;
given_name: string; // firstname
family_name: string; // lastname
locale: string;
zoneinfo: string;
updated_at: number;
email_verified: boolean; */

// export const userAccountStub: UserAccount = {
// /*   accountIdentifier: '',
//   homeAccountIdentifier: '',
//   userName: 'avidTest',
//   name: 'Avid Xer',
//   idToken: { ['idToken']: '12345' },
//   idTokenClaims: { ['idTokenClaims']: '1' },
//   sid: '',
//   environment: 'test', */
// };

export const userProfileStub: UserProfile = {
  businessPhones: [''],
  displayName: '',
  givenName: '',
  id: '',
  jobTitle: '',
  mail: '',
  mobilePhone: '',
  officeLocation: '',
  preferredLanguage: '',
  surname: '',
  userPrincipalName: '',
};

export const platformStub: Platform = {
  configUrl: 'avidxchange.com/document',
  connectorId: 1685,
  externalKey: 'SUITE',
  id: 1,
  name: 'AvidSuite',
};

export const organizationStub: Organization = {
  id: 1501488,
  isActive: true,
  name: 'Associates SERVICES',
};

export const organizationOptionStub: OrganizationOption = {
  id: 1501488,
  displayName: 'Associates SERVICES (1501488)',
  name: 'Associates SERVICES',
};

export const connectorSummaryStub: ConnectorSummary = {
  displayName: 'ATCONNECTOR',
  id: 1,
  isActive: true,
};

export const organizationAccountingSystemsStub: OrganizationAccountingSystem = {
  id: 389,
  isActive: true,
  isEnrolled: false,
  name: 'CTI',
  organizationId: 120,
  organizationName: 'MRI Demo with PO',
};

export const customerStub: Customer = {
  createdBy: 'baf4b465-bfce-413f-b728-33f8e8dc85c6',
  createdDate: '2020-11-16T17:19:14.56',
  externalKey: 'AL-007',
  id: 24,
  isActive: false,
  modifiedBy: 'baf4b465-bfce-413f-b728-33f8e8dc85c6',
  modifiedDate: '2020-11-16T17:19:14.56',
  name: 'Adam Levine5MKAtest459',
  platformId: 1,
  platformName: 'AvidSuite',
};

export const connectorStub: Connector = {
  authorName: 'AvidXchange',
  connectorTypeId: 1,
  connectorTypeName: 'Agent Connector',
  createdBy: 'baf4b465-bfce-413f-b728-33f8e8dc85c6',
  createdDate: '2020-11-25T01:45:21.067',
  description: 'Connector for Automation Tests',
  displayName: 'ATCONNECTOR',
  id: 1,
  isActive: true,
  logoUrl: 'https://ax-ae1-dv-axcnnct-management-api.azurewebsites.net/Connectors/1/Logo',
  modifiedBy: 'N/A',
  modifiedDate: '2021-08-16T18:20:31.157',
  name: 'AUTOTESTCONNECTOR',
  schemaUrl:
    'https://ax-ae1-dv-axcnnct-management-api.azurewebsites.net/Connectors/1/Settings-default',
  settingsDefaultUrl: null,
  version: 'TC0',
  website: 'http://www.avidxchange.com',
};

export const operationStub: Operation = {
  connectorId: 3808,
  connectorName: 'MRI',
  deletes: 0,
  detailUrl: null,
  endDate: '2021-07-20T19:38:01.587',
  errors: 0,
  executionId: 26680,
  fileUploadId: null,
  id: 31011,
  inserts: 0,
  isExecutionPreview: false,
  noUpdates: 0,
  operationStatusTypeId: 5,
  operationStatusTypeName: 'Error',
  artifactUrl: null,
  operationTypeId: 1245185,
  operationTypeName: 'GlobalEnterpriseCodes',
  registrationDescription: 'MRIAVCDev02AccSys6',
  registrationId: 6960,
  startDate: '2021-07-20T19:37:57.597',
  updates: 0,
};

export const operationTypeStub: OperationType = {
  id: 131073,
  name: 'Operation Test',
};

export const registrationStub: Registration = {
  connectorHostModelId: 1,
  connectorId: 1,
  connectorName: 'MRI',
  createdBy: 'KGirija@avidxchange.com',
  createdDate: '2021-07-20T19:29:33.397',
  customerId: 31376,
  customerName: 'AVCIntDev02',
  description: 'ATCO CLONE PROD',
  externalKey: '87745',
  id: 6959,
  isActive: true,
  modifiedBy: 'KGirija@avidxchange.com',
  modifiedDate: '2021-07-20T19:29:33.397',
  subscription: null,
  topic: null,
  connector: connectorStub,
};

export const connectorItemStub: ConnectorItem = {
  authorName: 'AvidXchange',
  connectorTypeId: 1,
  connectorTypeName: 'Agent Connector',
  createdBy: 'baf4b465-bfce-413f-b728-33f8e8dc85c6',
  createdDate: '2020-11-25T01:45:21.067',
  description: 'Connector for Automation Tests',
  displayName: 'ATCONNECTOR',
  id: 1,
  isActive: true,
  logoUrl: 'https://ax-ae1-dv-axcnnct-management-api.azurewebsites.net/Connectors/1/Logo',
  modifiedBy: 'N/A',
  modifiedDate: '2021-08-16T18:20:31.157',
  name: 'AUTOTESTCONNECTOR',
  schemaUrl:
    'https://ax-ae1-dv-axcnnct-management-api.azurewebsites.net/Connectors/1/Settings-default',
  settingsDefaultUrl: null,
  version: 'TC0',
  website: 'http://www.avidxchange.com',
  registrations: [registrationStub],
};

export const propertyStub: Property = {
  ChoiceType: null,
  ComplexType: null,
  DefaultValue: null,
  Description: 'The username of the account that is allowed to access the MRI API.',
  DisplayName: 'Username',
  FormatError: 'Please enter your MRI user name.',
  FormatMask: null,
  IsArray: false,
  IsRequired: true,
  IsSecret: false,
  MaxLength: 2147483647,
  MaxValue: 2147483647,
  MinLength: 0,
  MinValue: 0,
  Name: 'Username',
  OperationTypes: null,
  Type: 'text',
  AuthProfile: '',
};

export const authPropertyStub: Auth = {
  Value: 'Authorized on Test',
  RedirectUrl: 'Test',
  Finalized: false,
};

export const userRolesStub: any = {
  userRoles: [UserRoles.PortalAdmin, UserRoles.CustomerAdmin],
};

export const choiceStub: Choice = {
  Delimeter: '',
  Name: 'test',
  Options: [],
  Selection: ChoiceSelection.Single,
};

export const complexStub: ComplexType = {
  Name: 'test',
  Properties: [],
};

export const propertyGroupStub: PropertyGroup = {
  Name: 'test',
  Properties: [propertyStub],
  DisplayName: 'Test Group',
  Description: '',
  IsHostSpecific: false,
};

export const jsonSchemaStub: JsonSchema = {
  Choices: [choiceStub],
  ComplexTypes: [complexStub],
  PropertyGroups: [propertyGroupStub],
  Auth: authPropertyStub,
  Name: 'Settings Text',
};

export const hostnamePropertyStub: HostnameSettings = {
  name: 'test',
  value: {
    description: 'name',
    enabled: true,
  },
};

export const settingsValueStub: SettingValue = {
  name: 'test',
  value: 'test',
};

export const hostnamePropertyGroupStub: GroupSettings = {
  name: 'platform:host-metadata',
  isHostSpecific: false,
  properties: [hostnamePropertyStub],
};

export const onPremAgentsStub: OnPremAgent = {
  paging: {
    pageSize: 50,
    pageNumber: 1,
    pages: 1,
    pageItems: 20,
    totalItems: 20,
    queryTimeStamp: '2023-04-18T16:31:08.1001079Z',
  },
  items: [
    {
      id: 20,
      customerId: 32325,
      agentSID: 'e5b298b2-f55d-bcbb-9d0c-a08f0cbe6471',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32325',
      subscription: 'SID-e5b298b2-f55d-bcbb-9d0c-a08f0cbe6471',
      createdDate: '2023-03-01T13:24:27.827',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-01T13:24:27.827',
    },
    {
      id: 21,
      customerId: 32325,
      agentSID: '376e4945-9b4b-22ca-062e-b7f8b2308455',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32321',
      subscription: 'SID-376e4945-9b4b-22ca-062e-b7f8b2308421',
      createdDate: '2023-03-01T19:05:18.84',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-01T19:05:18.84',
    },
    {
      id: 22,
      customerId: 32325,
      agentSID: '355e15ce-70be-43ea-5105-dadec8c99b00',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32322',
      subscription: 'SID-355e15ce-70be-43ea-5105-dadec8c99b22',
      createdDate: '2023-03-01T20:55:22.003',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-02T23:34:25.367',
    },
    {
      id: 23,
      customerId: 32325,
      agentSID: '6e473c3a-0c04-52ef-b250-63c1cb04c497',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'Ae1ItWCont277.AvidXchange.com',
      topic: 'Customer-32323',
      subscription: 'SID-6e473c3a-0c04-52ef-b250-63c1cb04c423',
      createdDate: '2023-03-02T12:44:02.273',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-06T17:45:17.187',
    },
    {
      id: 24,
      customerId: 32325,
      agentSID: 'd6fa45e9-4a65-b90b-85bd-4a02aed93d9d',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32324',
      subscription: 'SID-d6fa45e9-4a65-b90b-85bd-4a02aed93d9d',
      createdDate: '2023-03-02T16:41:03.203',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-07T16:04:33.603',
    },
    {
      id: 26,
      customerId: 32325,
      agentSID: '569cc608-d9ba-a8b9-8180-f275c988ab8d',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32326',
      subscription: 'SID-569cc608-d9ba-a8b9-8180-f275c988ab8d',
      createdDate: '2023-03-07T19:52:34.99',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-14T19:40:31.05',
    },
    {
      id: 27,
      customerId: 32325,
      agentSID: 'f799a057-0ab0-798d-da6a-4df39a915038',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32327',
      subscription: 'SID-f799a057-0ab0-798d-da6a-4df39a915038',
      createdDate: '2023-03-07T19:58:07.147',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-22T13:28:10.757',
    },
    {
      id: 28,
      customerId: 32325,
      agentSID: 'cd6988f7-8011-a669-f618-7b1476aa38c5',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'Ae1ItWCont233.AvidXchange.com',
      topic: 'Customer-32328',
      subscription: 'SID-cd6988f7-8011-a669-f618-7b1476aa38c5',
      createdDate: '2023-03-08T13:43:40.157',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-09T14:29:23.113',
    },
    {
      id: 29,
      customerId: 32325,
      agentSID: 'd25e2fbf-4b25-e18f-73ef-3e9a9634f4bb',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'localhost',
      topic: 'Customer-32329',
      subscription: 'SID-d25e2fbf-4b25-e18f-73ef-3e9a9634f4bb',
      createdDate: '2023-03-15T04:14:32.89',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-15T04:14:32.89',
    },
    {
      id: 30,
      customerId: 32325,
      agentSID: '60cb46f4-d41f-2353-6d6a-7fb989f6e687',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'localhost',
      topic: 'Customer-32330',
      subscription: 'SID-60cb46f4-d41f-2353-6d6a-7fb989f6e687',
      createdDate: '2023-03-15T04:15:52.167',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-15T04:15:52.167',
    },
    {
      id: 31,
      customerId: 32325,
      agentSID: '9ee68c52-0228-0754-aeee-8f98d986a701',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32331',
      subscription: 'SID-9ee68c52-0228-0754-aeee-8f98d986a701',
      createdDate: '2023-03-15T05:16:10.677',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-15T05:16:10.677',
    },
    {
      id: 37,
      customerId: 32325,
      agentSID: '0a075a41-c71e-e444-014a-643a92b7b3fd',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32337',
      subscription: 'SID-0a075a41-c71e-e444-014a-643a92b7b3fd',
      createdDate: '2023-03-21T15:05:45.553',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-28T04:29:52.78',
    },
    {
      id: 66,
      customerId: null,
      agentSID: 'a71dfeed-0001-0001-0001-000000000001',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'AvidConnect East',
      topic: 'axcnnct-integrationjobs',
      subscription: 'axcnnct-cloud',
      createdDate: '2000-01-01T00:00:00',
      createdBy: 'AvidXchange',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2000-01-01T00:00:00',
    },
    {
      id: 67,
      customerId: null,
      agentSID: 'a71dfeed-0001-0001-0002-000000000001',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'AvidConnect West',
      topic: 'axcnnct-integrationjobs',
      subscription: 'axcnnct-cloud',
      createdDate: '2000-01-01T00:00:00',
      createdBy: 'AvidXchange',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2000-01-01T00:00:00',
    },
    {
      id: 69,
      customerId: 32325,
      agentSID: 'e41740b7-7689-0b51-f9c1-e8c8e65e4f92',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'Ae1ItWCont233.AvidXchange.com',
      topic: 'Customer-32369',
      subscription: 'SID-e41740b7-7689-0b51-f9c1-e8c8e65e4f92',
      createdDate: '2023-03-27T11:10:58.96',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-28T12:19:32.607',
    },
    {
      id: 70,
      customerId: 32325,
      agentSID: '04846a5f-9563-6bc6-f0a4-2f5974118781',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32370',
      subscription: 'SID-04846a5f-9563-6bc6-f0a4-2f5974118781',
      createdDate: '2023-03-30T12:02:28.627',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-31T20:23:40.933',
    },
    {
      id: 71,
      customerId: 32325,
      agentSID: 'a0c466bc-55d0-ed10-8aa6-c3d68d4bb6a9',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'Ae1ItWCont277.AvidXchange.com',
      topic: 'Customer-32371',
      subscription: 'SID-a0c466bc-55d0-ed10-8aa6-c3d68d4bb6a9',
      createdDate: '2023-03-31T17:06:05.21',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-03-31T17:06:05.21',
    },
    {
      id: 72,
      customerId: 32325,
      agentSID: '2d55ae95-25ae-4ec0-0ffa-ebb604d1b6ff',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'Ae1ItWCont277.AvidXchange.com',
      topic: 'Customer-32372',
      subscription: 'SID-2d55ae95-25ae-4ec0-0ffa-ebb604d1b6ff',
      createdDate: '2023-03-31T17:53:48.397',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-04-03T14:59:27.78',
    },
    {
      id: 73,
      customerId: 32325,
      agentSID: '99499bd9-6e52-ff19-2bc8-fb1805489092',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'Ae1ItWCont233.AvidXchange.com',
      topic: 'Customer-32373',
      subscription: 'SID-99499BD9-6E52-FF19-2BC8-FB1805489092',
      createdDate: '2023-04-03T11:27:20.58',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-04-03T16:14:38.623',
    },
    {
      id: 74,
      customerId: 32374,
      agentSID: '6428644b-47a7-d232-6a2b-8a876165633a',
      isDeactivated: false,
      isLockedOut: false,
      hostName: 'G6KQRQ2.AvidXchange.com',
      topic: 'Customer-32325',
      subscription: 'SID-6428644b-47a7-d232-6a2b-8a876165633a',
      createdDate: '2023-04-03T19:41:36.723',
      createdBy: 'AVCIntDev001-ASQA@regtest.avidbill.net',
      deactivatedDate: null,
      deactivatedBy: null,
      lastAccess: '2023-04-03T19:41:36.723',
    },
  ],
};

export const groupSettingsStub: GroupSettings = {
  name: 'test',
  isHostSpecific: false,
  properties: [settingsValueStub],
};

export const settingsStub: SchemaSettingsValue = {
  hostname: null,
  propertyGroups: [groupSettingsStub],
};

export const registrationEnablementStub: RegistrationEnablement = {
  isActive: true,
  isApibased: true,
  operationTypeId: 131073,
  operationTypeName: 'Operation Test',
  registrationEnablementUrl: 'https://ax-ae1-dv-axcnnct-management-api.com',
  registrationId: 6991,
};

export const executionStub: Execution = {
  executionTriggerTypeId: 2,
  isPreview: false,
  operations: [],
};

export const artifactStub: ArrayBuffer = new ArrayBuffer(0);

export const scheduleStub: Schedule = {
  createdBy: 'HRamirez@avidxchange.com',
  createdDate: '2021-10-26T14:46:21.93',
  cronText: '0 0 10/2 * * ?',
  customerId: 31384,
  description: '',
  id: 2917,
  isActive: false,
  modifiedBy: 'HRamirez@avidxchange.com',
  modifiedDate: '2021-11-03T14:10:35.333',
  operationTypes: [{ id: 1245185, name: 'GlobalEnterpriseCodes' }],
  registrationId: 6991,
  startDate: '2021-10-26T00:00:00',
  timeZone: 'Central Standard Time',
};

export const appConfigStub: AppConfig = {
  avidAuthBaseUri: '',
  avidAuthLoginUrl: '',
  avidAuthOktaUrl: '',
  apiBaseUrl: '',
  production: false,
  appName: '' as AppName,
  redirectUrl: '',
  avidAuthLogoutUrl: '',
};
