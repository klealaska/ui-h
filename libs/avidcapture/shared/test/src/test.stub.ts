/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormBuilder } from '@angular/forms';
import {
  Activity,
  AdvancedFilter,
  AdvancedFiltersKeys,
  AggregateBodyRequest,
  AggregatedData,
  Buyer,
  CompositeDocument,
  CustomerAccount,
  Document,
  DocumentLabelKeys,
  Environment,
  Escalation,
  EscalationCategoryTypes,
  Field,
  FieldBase,
  Hotkey,
  HotKeyDescription,
  HotKeyKey,
  IndexedData,
  IndexedLabel,
  IngestionTypes,
  InvoiceTypes,
  LabelValue,
  LookupCustomerAccount,
  LookupOrderedBy,
  LookupProperty,
  LookupSupplier,
  LookupWorkflow,
  PdfJsRequest,
  SearchApplyFunction,
  SearchBodyRequest,
  SearchContext,
  SearchReduceFunction,
  SortDirection,
  UnindexedData,
  UnindexedPage,
} from '@ui-coe/avidcapture/shared/types';
import {
  Autocomplete,
  AxAgGridCellComponent,
  GridColumn,
  TableColumnDef,
  User,
} from '@ui-coe/shared/ui';
import { UserAccount } from '@ui-coe/shared/util/auth';

// update this import
// import { environment } from '../environments/environment';

export const columnDataStub: GridColumn[] = [
  {
    sortIndex: 1,
    colId: 'lockedBy',
    sort: null,
    headerName: '',
    field: '',
    maxWidth: 40,
    sortable: false,
    imageCell: {
      valueGetter: () => ({}),
    },
    tooltipCell: {
      valueGetter: () => ({}),
    },
  },
  {
    sortIndex: 2,
    colId: 'buyerName',
    sort: null,
    field: 'buyer',
    cellRendererParams: {
      clicked: () => ({}),
    },
    linkCell: {
      valueGetter: () => ({}),
      bold: true,
      isLocked: () => false,
    },
  },
  {
    sortIndex: 3,
    colId: 'dateReceived',
    sort: null,
    headerName: 'Upload Date',
    field: 'DateReceived',
    sortable: true,
    type: 'dateColumn',
  },
  {
    sortIndex: 4,
    colId: 'escalationCategory',
    sort: null,
    field: 'escalationCategory',
    imageCell: {
      valueGetter: () => ({}),
    },
    hide: true,
  },
  {
    sortIndex: 5,
    colId: 'ingestionType',
    sort: null,
    headerName: 'Delivery Method',
    field: 'source',
    sortable: true,
  },
  {
    sortIndex: 6,
    colId: 'recycle',
    sort: null,
    field: 'recycle',
    imageCell: {
      valueGetter: () => ({}),
    },
    hide: true,
  },
];

export const researchColumnDataStub: GridColumn[] = [
  {
    sortIndex: 1,
    colId: 'lockedBy',
    sort: null,
    headerName: '',
    field: 'lockedBy',
    maxWidth: 40,
    sortable: false,
    imageCell: {
      valueGetter: () => ({}),
    },
    tooltipCell: {
      valueGetter: () => ({}),
    },
  },
  {
    sortIndex: 2,
    colId: 'fileName',
    sort: null,
    field: 'fileName',
    cellRendererParams: {
      clicked: () => ({}),
    },
    linkCell: {
      valueGetter: () => ({}),
      bold: true,
      isLocked: () => false,
    },
    tooltipCell: {
      valueGetter: () => '',
    },
  },
  {
    sortIndex: 3,
    colId: 'invoiceNumber',
    sort: null,
    headerName: 'Invoice Number',
    field: 'invoiceNumber',
    sortable: true,
  },
  {
    sortIndex: 4,
    colId: 'sourceEmail',
    sort: null,
    headerName: 'Sender Email',
    field: 'sourceEmail',
    sortable: true,
  },
  {
    sortIndex: 5,
    colId: 'buyerName',
    sort: null,
    headerName: 'Customer',
    field: 'buyerName',
    sortable: true,
    valueGetter: () => ({}),
  },
  {
    sortIndex: 6,
    colId: 'lastModified',
    sort: null,
    headerName: 'Last Modified',
    field: 'lastModified',
    sortable: true,
    type: 'dateColumn',
  },
  {
    sortIndex: 7,
    colId: 'dateReceived',
    sort: null,
    headerName: 'Upload Date',
    field: 'dateReceived',
    sortable: true,
    type: 'dateColumn',
  },
  {
    sortIndex: 8,
    colId: 'escalationCategoryIssue',
    sort: null,
    field: 'escalationCategoryIssue',
    imageCell: {
      valueGetter: () => ({}),
    },
    hide: true,
  },
  {
    sortIndex: 9,
    colId: 'ingestionType',
    sort: null,
    headerName: 'Delivery Method',
    field: 'ingestionType',
    sortable: true,
  },
];

export const archivedColumnDataStub: GridColumn[] = [
  {
    headerName: 'File Name',
    field: 'fileName',
    sortable: true,
    cellRendererParams: {
      clicked: () => ({}),
    },
    linkCell: {
      valueGetter: () => ({}),
      bold: true,
      isLocked: () => false,
    },
  },
  {
    colId: 'invoiceNumber',
    sort: null,
    headerName: 'Invoice Number',
    field: 'invoiceNumber',
    sortable: true,
  },
  {
    colId: 'sourceEmail',
    sort: null,
    headerName: 'Sender Email',
    field: 'sourceEmail',
    sortable: true,
  },
  {
    colId: 'buyerName',
    sort: null,
    headerName: 'Customer',
    field: 'buyerName',
    sortable: true,
  },
  {
    colId: 'dateReceived',
    sort: null,
    headerName: 'Upload Date',
    field: 'dateReceived',
    sortable: true,
    type: 'dateColumn',
  },
  {
    colId: 'dateSubmitted',
    sort: null,
    headerName: 'Submission Date',
    field: 'dateSubmitted',
    sortable: true,
    type: 'dateColumn',
  },
  {
    colId: 'ingestionType',
    sort: null,
    headerName: 'Delivery Method',
    field: 'ingestionType',
    valueGetter: () => ({}),
    sortable: true,
  },
];

export const invoiceImageColumnDataStub: string[] = [
  'fileName',
  'status',
  'invoiceSource',
  'imageDate',
  'invoiceNumber',
  'customerName',
  'billAccount',
];

export const processingDateRangeColumnDataStub: string[] = [
  'invoiceImage',
  'invoiceNumber',
  'invoiceReceivedDate',
  'invoiceSource',
  'status',
  'submittedBy',
  'supplierName',
  'supplierAddress',
  'entityName',
  'entityCode',
  'customerAccountNumber',
  'customerName',
];

export const uploadsQueueColumnDataStub: GridColumn[] = [
  {
    sortIndex: 1,
    colId: 'fileName',
    sort: null,
    field: 'fileName',
    cellRendererParams: {
      clicked: () => ({}),
    },
    linkCell: {
      valueGetter: () => ({}),
      bold: true,
      isLocked: () => false,
    },
  },
  {
    sortIndex: 2,
    colId: 'buyerName',
    sort: null,
    headerName: 'Customer',
    field: 'buyerName',
    sortable: true,
    valueGetter: () => ({}),
  },
  {
    colId: 'dateReceived',
    sort: null,
    headerName: 'Upload Date',
    field: 'dateReceived',
    sortable: true,
    type: 'dateColumn',
  },
];

export const transactionCountByEntityStub: string[] = [
  'customerName',
  'yearMonth',
  'entityName',
  'entityCode',
  'electronicInvoiceCount',
  'paperInvoiceCount',
  'total',
];

export const activityByPropertyColumnDataStub: string[] = [
  'property',
  'usMailCount',
  'usMailPercent',
  'uploadsCount',
  'uploadsPercent',
  'emailCount',
  'emailPercent',
  'electronicTotalCount',
  'electronicTotalPercent',
  'totalABNCount',
  'totalABNPercent',
  'customerManagedCount',
  'customerManagedPercent',
  'totalVolume',
];

export const buyerStub: Buyer = {
  id: '1',
  name: 'MockName',
};

export const buyersStub: Buyer[] = [
  { id: '1', name: 'MockBuyer' },
  { id: '2', name: 'BuyerTest' },
  { id: '3', name: 'MockName' },
];

export const fieldControlStub: Field[] = [
  {
    key: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
    fieldType: 'default',
    value: '',
    confidence: 99.99,
    displayThreshold: {
      view: 75,
      readonly: 75,
    },
    confidenceThreshold: {
      high: {
        min: 95,
      },
      medium: {
        min: 90,
      },
      low: {
        min: 0,
      },
    },
    controlType: 'textbox',
    type: 'text',
    required: true,
    regEx: null,
    labelDisplayName: 'Customer Account Number',
    headerBackgroundColor: 'none',
    headerTextColor: 'default',
    order: 1,
    maxLength: 30,
  },
];

export const compositeDataStub: CompositeDocument = {
  indexed: {
    documentId: '1',
    fileId: '1',
    indexer: 'Mock Indexer',
    dateReceived: '10/30/2020',
    lastModified: '10/30/2020',
    labels: [
      {
        label: DocumentLabelKeys.nonLookupLabels.InvoiceType,
        page: 1,
        value: {
          text: InvoiceTypes.Standard,
          confidence: 99.99,
          boundingBox: [1, 1, 1, 1, 1, 1, 1, 1],
          required: false,
          verificationState: '',
        } as LabelValue,
      },
      {
        label: DocumentLabelKeys.lookupLabels.ShipToName,
        page: 1,
        value: {
          text: '12',
          confidence: 99.99,
          boundingBox: [],
          required: false,
          verificationState: '',
        } as LabelValue,
      },
    ] as IndexedLabel[],
    activities: [
      {
        ordinal: 1,
        startDate: '2021-02-12T17:38:19.0958208Z',
        endDate: '2021-02-12T17:38:19.0958208Z',
        indexer: 'avidtest@avidxchange.com',
        activity: '',
        changeLog: [],
        description: '',
        escalation: {
          category: { issue: '', reason: '' },
          description: '',
          escalationLevel: '',
          resolution: '',
        },
        labels: [
          {
            id: '00000000-0000-0000-0000-000000000000',
            label: 'CustomerAccountNumber',
            page: 0,
            value: {
              text: 'Test Account',
              confidence: 0,
              boundingBox: [],
              required: false,
              incomplete: false,
              incompleteReason: null,
              type: 'string',
              verificationState: 'NotRequired',
            },
          },
        ],
      },
    ] as Activity[],
  } as IndexedData,
  unindexed: {
    documentId: '1',
    fileId: '1',
    indexer: 'Mock Indexer',
    dateReceived: '10/30/2020',
    pages: [] as UnindexedPage[],
  } as UnindexedData,
  userLock: {
    id: '1',
    documentId: '1',
    indexer: 'mockIndexerName',
    startTime: '2020-10-26T21:51:29.6302889Z',
  },
};

export const utilityCompositeDataStub: CompositeDocument = {
  indexed: {
    documentId: '1',
    fileId: '1',
    indexer: 'Mock Indexer',
    dateReceived: '10/30/2020',
    lastModified: '10/30/2020',
    labels: [
      {
        label: DocumentLabelKeys.nonLookupLabels.InvoiceType,
        page: 1,
        value: {
          text: InvoiceTypes.Utility,
          confidence: 99.99,
          boundingBox: [1, 1, 1, 1, 1, 1, 1, 1],
          required: false,
          verificationState: '',
        } as LabelValue,
      },
    ] as IndexedLabel[],
    activities: [],
  },
  unindexed: {
    documentId: '1',
    fileId: '1',
    indexer: 'Mock Indexer',
    dateReceived: '10/30/2020',
    pages: [] as UnindexedPage[],
  } as UnindexedData,
  userLock: {
    id: '1',
    documentId: '1',
    indexer: 'mockIndexerName',
    startTime: '2020-10-26T21:51:29.6302889Z',
  },
};

export const customersStub: Buyer = {
  id: '1',
  name: 'mockName',
};

export const indexedLabelStub: IndexedLabel = {
  id: '00000000-0000-0000-0000-000000000000',
  label: DocumentLabelKeys.lookupLabels.ShipToName,
  page: 1,
  value: {
    text: 'W1000023',
    confidence: 99.99,
    boundingBox: [],
    required: false,
    verificationState: '',
  } as LabelValue,
};

export const userAccountStub: UserAccount = {
  auth_time: 123456,
  email: 'XDCUserTest@avidxchange.com',
  email_verified: true,
  family_name: 'Xer',
  given_name: 'Avid',
  locale: 'Eastern',
  name: 'Avid Xer',
  preferred_username: 'Avid Xer',
  sub: '',
  zoneinfo: '',
  updated_at: 0,
};

export const fieldBaseStub: FieldBase<string>[] = [
  {
    key: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
    value: 'value',
    confidence: 99.99,
    displayThreshold: {
      view: 75,
      readonly: 75,
    },
    confidenceThreshold: {
      high: {
        min: 95,
      },
      medium: {
        min: 90,
      },
      low: {
        min: 0,
      },
    },
    controlType: 'textbox',
    type: 'text',
    required: true,
    regEx: null,
    labelDisplayName: 'Customer Account Number',
    headerBackgroundColor: 'none',
    headerTextColor: 'default',
    order: 1,
  },
];

export const confidenceThresholdStub = {
  high: {
    min: 95,
  },
  medium: {
    min: 90,
  },
  low: {
    min: 0,
  },
};

export const escalationsStub: Escalation = {
  category: { issue: '', reason: '' },
  description: '',
  escalationLevel: '',
  resolution: '',
};

export const internalEscalationsStub: Escalation = {
  category: { issue: EscalationCategoryTypes.IndexerQa, reason: '' },
  description: '',
  escalationLevel: '',
  resolution: '',
};

export const activityStub: Activity = {
  ordinal: 1,
  startDate: '2021-02-12T17:38:19.0958208Z',
  endDate: '2021-02-12T17:38:19.0958208Z',
  indexer: 'avidtest@avidxchange.com',
  activity: 'Create New Account',
  changeLog: null,
  description: 'No description',
  escalation: {
    category: { issue: '', reason: '' },
    description: '',
    escalationLevel: '',
    resolution: '',
  },
  labels: [
    {
      id: '00000000-0000-0000-0000-000000000000',
      label: 'CustomerAccountNumber',
      page: 0,
      value: {
        text: 'Test Account',
        confidence: 0,
        boundingBox: [],
        required: false,
        incomplete: false,
        incompleteReason: null,
        type: 'string',
        verificationState: 'NotRequired',
      },
    },
    {
      id: '00000000-0000-0000-0000-000000000000',
      label: 'Terms',
      page: 0,
      value: {
        text: 'Net 20 EOM',
        confidence: 0,
        boundingBox: [],
        required: false,
        incomplete: false,
        incompleteReason: null,
        type: 'string',
        verificationState: 'NotRequired',
      },
    },
  ],
};

export const escalationActivityStub: Activity = {
  ordinal: 1,
  startDate: '2021-02-12T17:38:19.0958208Z',
  endDate: '2021-02-12T17:38:19.0958208Z',
  indexer: 'avidtest@avidxchange.com',
  activity: 'Escalation',
  changeLog: null,
  description: 'No description',
  escalation: {
    category: { issue: 'Image Issue', reason: 'Bad Quality' },
    description: '',
    escalationLevel: '',
    resolution: '',
  },
  labels: [],
};

export const activitiesStub: Activity[] = [
  {
    ordinal: 1,
    startDate: '2021-02-12T17:38:19.0958208Z',
    endDate: '2021-02-12T17:38:19.0958208Z',
    indexer: 'avidtest@avidxchange.com',
    activity: 'Save',
    changeLog: [],
    description: 'No description',
    escalation: {
      category: { issue: '', reason: '' },
      description: '',
      escalationLevel: '',
      resolution: '',
    },
    labels: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'SupplierName',
        page: 0,
        value: {
          text: 'Supplier Name Prev',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'CustomerAccountNumber',
        page: 0,
        value: {
          text: 'Account Number Prev',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
    ],
  },
  {
    ordinal: 1,
    startDate: '2021-02-12T17:38:19.0958208Z',
    endDate: '2021-02-12T17:38:19.0958208Z',
    indexer: 'avidtest@avidxchange.com',
    activity: 'Submit',
    changeLog: [],
    description: 'No description',
    escalation: {
      category: { issue: '', reason: '' },
      description: '',
      escalationLevel: '',
      resolution: '',
    },
    labels: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'CustomerAccountNumber',
        page: 0,
        value: {
          text: 'Account Number Prev',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
    ],
  },
  {
    ordinal: 1,
    startDate: '2021-02-12T17:38:19.0958208Z',
    endDate: '2021-02-12T17:38:19.0958208Z',
    indexer: 'avidtest@avidxchange.com',
    activity: 'Submit',
    changeLog: [],
    description: 'No description',
    escalation: {
      category: { issue: '', reason: '' },
      description: '',
      escalationLevel: '',
      resolution: '',
    },
    labels: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'CustomerAccountNumber',
        page: 0,
        value: {
          text: 'Account Number Prev',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
    ],
  },
];

export const RecycleBinStateModelStub = {
  recycleBinDocuments: [],
  filteredCustomers: [],
  loadMoreHidden: false,
};

export const AdminUsersStateModelStub = {
  users: [],
};

const formBuilder: FormBuilder = new FormBuilder();
export const formGroupInstanceStub = formBuilder.group({
  CustomerAccountNumber: '70644',
  Supplier: 'CINTAS CORPORATION #612',
  SupplierAddress: 'P.O. BOX 630803 CINCINNATI, OH 45263-0803',
  ShipToName: '',
  ShipToAddress: '',
  InvoiceNumber: '',
  InvoiceDate: '',
  Total: '',
  InvoiceDueDate: '',
  PurchaseOrderIdentifier: '',
  WorkOrderNo: '',
  InvoiceAmount: '',
  OrderedBy: '',
  Workflow: '',
  ServiceEndDate: '',
});

export const summaryCountsStub = {
  buyerCount: 0,
  documentCount: 0,
  escalationCount: 0,
};

export const hotKeysStub: Hotkey[] = [
  {
    description: HotKeyDescription.PreviousPage,
    keyList: [HotKeyKey.Alt, HotKeyKey.P],
  },
];

export const customerAccountsStub: LookupCustomerAccount[] = [
  {
    vendorAccountId: 12033990,
    accountNo: 'none',
    propertyId: 36423868,
    propertyName: 'Pipe Test',
    termTypeId: 1,
    allowRetainage: true,
    isActive: true,
    propertyAddress: {
      propertyId: 36423868,
      propertyName: 'Pipe Test',
      propertyAddressID: 545600,
      propertyAddressCount: 1,
      alias: '102',
      line1: '102 Franklin St',
      line2: 'Apt B',
      city: 'Charlotte',
      state: 'NC',
      postalCode: '28214',
      propertyCode: '102F',
      accountingSystemID: 5947,
      propertyIsActive: true,
      addressIsActive: true,
    },
  },
  {
    vendorAccountId: 19235505,
    accountNo: 'sean test api',
    propertyId: -1,
    propertyName: '',
    termTypeId: 41,
    allowRetainage: true,
    isActive: true,
    propertyAddress: {
      propertyId: -1,
      propertyName: '',
      propertyAddressID: 545600,
      propertyAddressCount: 2,
      alias: '102',
      line1: '102 Franklin St',
      line2: 'Apt B',
      city: 'Charlotte',
      state: 'NC',
      postalCode: '28214',
      propertyCode: '102F',
      accountingSystemID: 5947,
      propertyIsActive: false,
      addressIsActive: false,
    },
  },
  {
    vendorAccountId: 19235507,
    accountNo: 'null prop address',
    propertyId: 234,
    propertyName: '',
    termTypeId: 41,
    allowRetainage: true,
    isActive: true,
    propertyAddress: null,
  },
  {
    vendorAccountId: 45345,
    accountNo: 'sean test api',
    propertyId: -1,
    propertyName: '',
    termTypeId: 41,
    allowRetainage: true,
    isActive: true,
    propertyAddress: {
      propertyId: -1,
      propertyName: '',
      propertyAddressID: 545600,
      propertyAddressCount: 1,
      alias: '102',
      line1: '102 Franklin St',
      line2: 'Apt B',
      city: 'Charlotte',
      state: 'NC',
      postalCode: '28214',
      propertyCode: '102F',
      accountingSystemID: 5947,
      propertyIsActive: false,
      addressIsActive: false,
    },
  },
];

export const suppliersStub: LookupSupplier[] = [
  {
    vendorID: 7678846,
    vendorName: 'Earth, Wind, & Tire Automotive',
    vendorExternalSystemID: 'V00101',
    line1: '1531 Johnny Lane',
    line2: '123 Happy Jane Lane',
    city: 'Milwaukee',
    state: 'WI',
    postalCode: '53202',
    accountingSystemID: 4811,
    allowRetainage: false,
    vendorRegistrationCode: 'asdasd',
    aliases: 'aliases',
  },
  {
    vendorID: 10871116,
    vendorName: 'Endless Pastabilities Italian Eatery',
    vendorExternalSystemID: 'V00045',
    line1: '4567 Shakeout Point',
    line2: '',
    city: 'Benderton',
    state: 'IA',
    postalCode: '56792',
    accountingSystemID: 4811,
    allowRetainage: false,
    vendorRegistrationCode: 'asdasd',
    aliases: 'aliases',
  },
  {
    vendorID: 235365,
    vendorName: 'Earth, Wind, & Tire Automotive',
    vendorExternalSystemID: 'V00101',
    line1: '1531 Johnny Lane',
    line2: '123 Happy Jane Lane',
    city: 'Milwaukee',
    state: 'WI',
    postalCode: '53202',
    accountingSystemID: 4811,
    allowRetainage: false,
    vendorRegistrationCode: 'asdasd',
    aliases: 'aliases',
  },
];

export const propertiesStub: LookupProperty[] = [
  {
    propertyAddressID: 545600,
    propertyId: 50834279,
    propertyName: '102 Franklin',
    propertyAddressCount: 1,
    alias: '102',
    line1: '102 Franklin St',
    line2: 'Apt B',
    city: 'Charlotte',
    state: 'NC',
    postalCode: '28214',
    propertyCode: '102F',
    accountingSystemID: 5947,
    propertyIsActive: false,
    addressIsActive: false,
  },
  {
    propertyAddressID: 445277,
    propertyId: 50834279,
    propertyName: '102 Franklin',
    propertyAddressCount: 1,
    alias: '102F',
    line1: 'No Address Provided',
    line2: '',
    city: 'City',
    state: 'SA',
    postalCode: '12345',
    propertyCode: '102F',
    accountingSystemID: 5947,
    propertyIsActive: true,
    addressIsActive: true,
  },
  {
    propertyAddressID: 1345345,
    propertyId: 4234234,
    propertyName: '102 Franklin',
    propertyAddressCount: 1,
    alias: '102',
    line1: '102 Franklin St',
    line2: 'Apt B',
    city: 'Charlotte',
    state: 'NC',
    postalCode: '28214',
    propertyCode: '102F',
    accountingSystemID: 5947,
    propertyIsActive: false,
    addressIsActive: false,
  },
];

export const orderedByStub: LookupOrderedBy[] = [
  { id: '1234', email: 'test@test.com', firstName: 'test', lastName: 'test' },
  { id: '4321', email: 'test2@test.com', firstName: 'test', lastName: 'test' },
];

export const workflowStub: LookupWorkflow[] = [
  { id: '1234', name: 'workflow1' },
  { id: '4321', name: 'workflow2' },
];

export const paymentTermsChoicesStub: Autocomplete[] = [
  {
    id: 'Net 30',
    name: 'Net 30',
  },
  {
    id: 'Net 10',
    name: 'Net 10',
  },
  {
    id: '2% 10 Net 30',
    name: '2% 10 Net 30',
  },
  {
    id: 'Net 20',
    name: 'Net 20',
  },
  {
    id: '1% 10 Net 30',
    name: '1% 10 Net 30',
  },
];

export const createCustomerAccountStub: CustomerAccount = {
  customerAccountNumber: '1234',
  paymentTerms: '1',
};

export const recycledBinStub: GridColumn[] = [
  {
    sortIndex: 1,
    colId: 'fileName',
    sort: null,
    field: 'fileName',
    cellRendererParams: {
      clicked: () => ({}),
    },
    linkCell: {
      valueGetter: () => ({}),
      bold: true,
      isLocked: () => false,
    },
  },
  {
    headerName: 'Upload Date',
    field: 'dateReceived',
    sortable: true,
  },
  {
    headerName: 'Deletes In',
    field: 'customerAccountNumber',
    sortable: true,
    hide: true,
  },
];

export const usersStub: User[] = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Cooper',
    image: '',
    email: 'Jane.Cooper@email.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    firstName: 'Jacob',
    lastName: 'Jones',
    image: '',
    email: 'Jacob.Jones@email.com',
    role: 'AR Clerk',
    status: 'Initiated',
  },
  {
    id: 3,
    firstName: 'Jenny',
    lastName: 'Wilson',
    image: '',
    email: 'Jenny.WIlson@email.com',
    role: 'AR Manager',
    status: 'Active',
  },
  {
    id: 4,
    firstName: 'Dianne Russell',
    lastName: 'Russell',
    image: '',
    email: 'Dianne.Russell@email.com',
    role: 'Be',
    status: 'Initiated',
  },
  {
    id: 5,
    firstName: 'Jerome',
    lastName: 'Bell',
    image: '',
    email: 'Jerome.Bell@email.com',
    role: 'AR Manager',
    status: 'Initiated',
  },
  {
    id: 6,
    firstName: 'Henry',
    lastName: 'Lane',
    image: '',
    email: 'Henry.Lane@email.com',
    role: 'Accountant',
    status: 'Active',
  },
  {
    id: 7,
    firstName: 'Charlie',
    lastName: 'Smith',
    image: '',
    email: 'Charlie.Smith@email.com',
    role: 'AR Clerk',
    status: 'Active',
  },
  {
    id: 8,
    firstName: 'Max',
    lastName: 'Flow',
    image: '',
    email: 'Max.Flow@email.com',
    role: 'O',
    status: 'Active',
  },
  {
    id: 9,
    firstName: 'Fluorine',
    lastName: 'Zan',
    image: '',
    email: 'Fluorine.Zan@email.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 10,
    firstName: 'Neon',
    lastName: 'Blue',
    image: '',
    email: 'Neon.Blue@email.com',
    role: 'Admin',
    status: 'Active',
  },
];

export const sortedColumnStub: any = { buyerName: 'asc' };

export const columnDataDynamicTableStub: TableColumnDef[] = [
  {
    columnDef: 'buyerName',
    headerCellDef: 'Buyer Name',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'totalDocs',
    headerCellDef: 'Total Docs',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docsMore24hours',
    headerCellDef: 'Total Docs > 24 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs24hours',
    headerCellDef: 'Total Docs 23-24 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs23hours',
    headerCellDef: 'Total Docs 22-23 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs22hours',
    headerCellDef: 'Total Docs 21-22 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs21hours',
    headerCellDef: 'Total Docs 20-21 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs20hours',
    headerCellDef: 'Total Docs 19-20 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs19hours',
    headerCellDef: 'Total Docs 18-19 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs18hours',
    headerCellDef: 'Total Docs 17-18 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs17hours',
    headerCellDef: 'Total Docs 16-17 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs16hours',
    headerCellDef: 'Total Docs 15-16 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs15hours',
    headerCellDef: 'Total Docs 14-15 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs14hours',
    headerCellDef: 'Total Docs 13-14 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs13hours',
    headerCellDef: 'Total Docs 12-13 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
  {
    columnDef: 'docs12hours',
    headerCellDef: 'Total Docs 11-12 hours',
    cellDef: {
      type: 'text',
      value: () => ({}),
    },
  },
];

export const aggregatedData: AggregatedData[] = [
  {
    buyerName: 'Avidxchange, Inc',
    totalDocs: '2',
    docsMore24hours: '2',
    docs24hours: '0',
    docs23hours: '0',
    docs22hours: '0',
    docs21hours: '0',
    docs20hours: '0',
    docs19hours: '0',
    docs18hours: '0',
    docs17hours: '0',
    docs16hours: '0',
    docs15hours: '0',
    docs14hours: '0',
    docs13hours: '0',
    docs12hours: '0',
  },
];

export const pdfJsStub: PdfJsRequest = {
  url: `http://idcapi.avidxchange.com/api/file/1`,
  // url: `${environment.apiBaseUri}api/file/1`,
  httpHeaders: { Authorization: `Bearer token` },
  withCredentials: true,
};

export function getAdvancedFilterFormStub() {
  return {
    buyerId: [],
    supplier: ['supplierName'],
    shipToName: ['shipToName'],
    invoiceNumber: ['00000100'],
    sourceEmail: ['mail@mail.com'],
    fileName: ['fileName'],
    startDate: '01-01-2020',
    endDate: '01-01-2021',
    submittedStartDate: '01-01-2020',
    submittedEndDate: '01-01-2021',
    escalationCategoryIssue: [],
  };
}

export function getAdvancedFilterStub(): AdvancedFilter {
  return {
    buyerId: [],
    supplier: ['supplierName'],
    shipToName: ['shipToName'],
    invoiceNumber: ['00000100'],
    sourceEmail: ['mail@mail.com'],
    fileName: ['fileName'],
    dateReceived: ['01-01-2020', '01-01-2021'],
    dateSubmitted: ['01-01-2020', '01-01-2021'],
    escalationCategoryIssue: [],
  };
}

export function getCompositeDataStub(): CompositeDocument {
  return {
    indexed: {
      documentId: '1',
      fileId: '1',
      indexer: 'Mock Indexer',
      dateReceived: '10/30/2020',
      lastModified: '10/30/2020',
      isSubmitted: false,
      labels: [
        {
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.nonLookupLabels.InvoiceType,
          page: 1,
          value: {
            text: InvoiceTypes.Standard,
            confidence: 99.99,
            boundingBox: [1, 1, 1, 1, 1, 1, 1, 1],
            required: false,
            verificationState: '',
          } as LabelValue,
        },
        {
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.lookupLabels.ShipToName,
          page: 1,
          value: {
            text: '12',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        },
      ] as IndexedLabel[],

      activities: [
        {
          ordinal: 1,
          startDate: '',
          endDate: '',
          indexer: 'avidtest@avidxchange.com',
          activity: 'Create New Account',
          description: 'No description',

          escalation: {
            category: { issue: '', reason: '' },
            description: '',
            escalationLevel: '',
            resolution: '',
          },
          labels: [
            {
              id: '00000000-0000-0000-0000-000000000000',
              label: 'CustomerAccountNumber',
              page: 0,
              value: {
                text: 'Test Account',
                confidence: 0,
                boundingBox: [],
                required: false,
                incomplete: false,
                incompleteReason: null,
                type: 'string',
                verificationState: 'NotRequired',
              },
            },
          ],
        },
      ],
    } as IndexedData,
    unindexed: {
      documentId: '1',
      fileId: '1',
      indexer: 'Mock Indexer',
      dateReceived: '10/30/2020',
      pages: [] as UnindexedPage[],
    } as UnindexedData,
    userLock: {
      id: '1',
      documentId: '1',
      indexer: 'mockIndexerName',
      startTime: '2020-10-26T21:51:29.6302889Z',
    },
  };
}

export function getIndexedLabelStub(label: string): IndexedLabel {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    label,
    page: 1,
    value: {
      text: 'W1000023',
      confidence: 99.99,
      boundingBox: [],
      required: false,
      verificationState: '',
      type: 'text',
    } as LabelValue,
  };
}

export function getFieldBaseStub(key: string): FieldBase<string> {
  return {
    key,
    value: '',
    confidence: 99.99,
    displayThreshold: {
      view: 75,
      readonly: 99,
    },
    confidenceThreshold: {
      high: {
        min: 95,
      },
      medium: {
        min: 90,
      },
      low: {
        min: 0,
      },
    },
    controlType: 'textbox',
    type: 'text',
    required: true,
    regEx: null,
    labelDisplayName: '',
    headerBackgroundColor: 'none',
    headerTextColor: 'default',
    order: 1,
    maxLength: 30,
  };
}

export function getBuyersStub(): Buyer[] {
  return [
    { id: '1', name: 'MockBuyer' },
    { id: '2', name: 'BuyerTest' },
    { id: '3', name: 'MockName' },
  ];
}

export function getArchivedDocumentsStub(): Document[] {
  return [
    {
      amountDue: '40041.25',
      billingAddressRecipient: 'AvidXchange, Inc.',
      buyerId: '25',
      buyerName: 'Avidxchange, Inc',
      customerAccountNumber: 'Avidxchange-Dem Gen',
      dateFirstOpened: '1654113466',
      dateLocked: '0',
      dateReceived: '1654113261',
      dateRecycled: '0',
      dateSubmitted: '1654113497',
      documentId: '4014e2e5-9e99-4d19-8a37-89b01047fcd2',
      escalationCategoryIssue: 'none',
      escalationCategoryLevel: 'none',
      escalationCategoryReason: 'none',
      fileId: '302498016',
      fileName: 'Inv_568719_from_Capterra_Inc__8926384_16736.pdf',
      indexedDocumentId: '22c5d138-754f-405e-a634-559b584c5dfb',
      ingestionType: 'email',
      invoiceAmount: '40041.25',
      invoiceDate: '1654128000',
      invoiceNumber: '568719',
      invoiceSourceId: 'AvidSuite',
      invoiceType: 'Standard',
      isSubmitted: '1',
      lockedBy: 'none',
      propertyCode: '1',
      registrationCode: '1D80S4XBF',
      secondsSpentIndexing: '30.341999999999999',
      shipToAddress: '1210 Avidxchange Lane  Charlotte, 1210 Avidxchange Lane 28206',
      shipToId: '69971920',
      shipToName: ' Digital & Experientital Marketing (18007)',
      sourceEmail: 'quickbooks@notification.intuit.com',
      supplier: 'Capterra Inc',
      supplierAddress: 'PO Box 733181 null Dallas, TX 75373-3181',
      supplierId: '324165',
      unindexedDocumentId: 'ab455df1-5253-4b16-ab72-a7bf666e4227',
      vendorName: 'Capterra Inc.',
    },
  ];
}

export function getFeatureFlagsStub(id: string, enabled: boolean): any[] {
  return [
    {
      id,
      description: '',
      enabled,
      conditions: { client_filters: [] },
    },
  ];
}

export function getAggregateBodyRequest(filters: AdvancedFilter): AggregateBodyRequest {
  return {
    Controls: {
      Page: 1,
      PageSize: 30,
      SourceId: SearchContext.AvidSuite,
    },
    Fields: [],
    SortBy: {},
    Filters: filters,
  };
}

export function getNextDocumentRequestBody(
  filters: AdvancedFilter,
  sortDirection?: SortDirection
): SearchBodyRequest {
  return {
    Controls: {
      Page: 1,
      PageSize: 30,
      SourceId: SearchContext.AvidSuite,
    },
    Filters: filters,
    SortField: AdvancedFiltersKeys.DateReceived,
    SortDirection: sortDirection || SortDirection.Ascending,
  };
}

export function getSearchBodyRequest(filters: AdvancedFilter): SearchBodyRequest {
  return {
    Controls: {
      Page: 1,
      PageSize: 30,
      SourceId: SearchContext.AvidSuite,
    },
    Filters: filters,
    SortField: 'dateReceived',
    SortDirection: SortDirection.Ascending,
  };
}

export function getContainsAggregateBodyRequest(filters: AdvancedFilter): AggregateBodyRequest {
  return {
    Controls: {
      SearchAllPages: true,
      SourceId: SearchContext.AvidSuite,
    },
    Filters: filters,
    GroupBy: ['buyerName', 'buyerId'],
    ApplyFields: [
      {
        ParameterName: 'buyerName',
        ParameterValue: 'av',
        Function: SearchApplyFunction.Contains,
        Alias: 'buyer',
      },
    ],
    ResultFilters: [
      {
        ParameterName: 'buyer',
        ParameterValue: '1',
        Operation: '==',
        Chain: null,
      },
    ],
    ReduceFields: [
      {
        Function: SearchReduceFunction.Count,
        Alias: 'Count',
      },
    ],
  };
}

export function getDocuments(): Document[] {
  return [
    {
      amountDue: '$33.08',
      billingAddress: '1210 AvidXchange Lane Charlotte, NC 28206',
      billingAddressRecipient: 'AvidXchange',
      buyerId: '25',
      buyerKeyword: 'avidxchange',
      buyerName: 'Avidxchange, Inc',
      correlationId: '78a34925-72aa-40ea-8c10-96f8e74a16c1',
      currentCharges: '',
      customerAccountNumber: '910030695170',
      customerAddressRecipient: 'FIBER MILLS LLC',
      customerName: 'FIBER MILLS LLC',
      dateFirstOpened: '0',
      dateReceived: '2021-08-25T13:11:10.2331464+00:00',
      dateRecycled: '0',
      dateSubmitted: '0',
      documentId: 'fc87b20a-21c4-4519-bcd4-28aba43f7ccc',
      documentIndexedId: '60e80444-44ab-47e5-942f-1f043f81bebb',
      documentUnindexedId: '08ed96dc-a433-4359-8c59-be7f89d1ffdb',
      escalationCategoryIssue: 'none',
      escalationCategoryLevel: 'none',
      escalationCategoryReason: 'none',
      fileId: '239881079',
      fileName: 'Parking Deck Elect 7.15-8.12.21.pdf',
      id: '00000000-0000-0000-0000-000000000000',
      indexedDocumentId: '598525b1-9bb5-4fa9-b0b9-62ef9308f0bd',
      ingestionType: 'email',
      invoiceAmount: '505.17',
      invoiceDate: 'Aug 16, 2021',
      invoiceDueDate: 'Sep 10',
      invoiceNumber: '00007952',
      invoiceSourceId: SearchContext.AvidSuite,
      invoiceType: 'Standard',
      isSubmitted: '0',
      lockedBy: 'none',
      propertyCode: '47',
      registrationCode: 'NPHFC1SL3',
      searchScore: '273.52792',
      secondsSpentIndexing: '0',
      serviceAddress: '909 HAMILTON ST CHARLOTTE NC 28206',
      serviceEndDate: 'Aug 12',
      serviceStartDate: 'Jul 15',
      shipToAddress: '1210 Avidxchange Lane Charlotte NC 28206',
      shipToId: '261829',
      shipToName: 'Facility (13002)',
      sourceEmail: 'CRomeis@avidxchange.com',
      sourceSystemBuyerId: '25',
      sourceSystem: SearchContext.AvidSuite,
      supplier: 'Hamilton Street Properties LLC',
      supplierAddress: '19401 Old Jetton Rd, Suite 101 Cornelius NC 28031',
      supplierId: '6611788',
      totalTax: '66.10',
      unindexedDocumentId: '077b13c5-33e9-483c-b36f-0ec551fd88a2',
      vendorAddress: '19401 Old Jetton Road Suite 101 NC 28031',
      vendorAddressRecipient: 'Hamilton Street Properties, LLC',
      vendorName: 'DUKE ENERGY',
    },
  ];
}

export function getResearchDocuments(): Document[] {
  return [
    {
      billingAddressRecipient: 'Springfield Crossing',
      buyerId: '2842741',
      buyerName: 'ABN STF TRAINING',
      dateFirstOpened: '1648143825',
      dateLocked: '0',
      dateReceived: '1647916056',
      dateRecycled: '0',
      dateSubmitted: '0',
      documentId: '3d68a754-e5e2-4787-acc4-746bf585bd56',
      escalationCategoryIssue: 'Image Issue',
      escalationCategoryLevel: 'Internal Xdc Process',
      escalationCategoryReason: 'More than one invoice in PDF',
      fileId: '286248751',
      fileName: 'fastcleanmarchinvoice.pdf',
      indexedDocumentId: '0dbe726a-f427-457d-b7d1-1415e15f946a',
      ingestionType: 'email',
      invoiceAmount: '525',
      invoiceDate: '1646611200',
      invoiceNumber: '2034',
      invoiceSourceId: 'AvidSuite',
      invoiceType: 'Standard',
      isSubmitted: '0',
      lockedBy: 'none',
      propertyCode: '221',
      registrationCode: '5YN24HF8V',
      secondsSpentIndexing: '9.9999999999999995E-08',
      shipToAddress: '1405 Point Street (Yardi Voyager 7S 221)  Baltimore, MD 21231',
      shipToId: '484176',
      shipToName: '1405 Point (221)',
      sourceEmail: 'BLloyd@avidxchange.com',
      supplier: '02 Fitness North Chatham: Carrboro Fitness LLC (Yardi Voyager 7s)',
      supplierAddress: '135 East Martin Street null Raleigh, NC 27601',
      supplierId: 'v0000007',
      unindexedDocumentId: '1b3bce05-71ed-4206-9bfc-7b564a1ac3aa',
    },
  ];
}

export function getRecycledDocuments(): Document[] {
  return [
    {
      billingAddress: '1210 AVIDXCHANGE LN Charlotte, NC 28206 USA',
      billingAddressRecipient: 'AvidXchange, Inc.',
      buyerId: '25',
      buyerName: 'Avidxchange, Inc',
      customerAccountNumber: '1065092',
      dateFirstOpened: '1653674012',
      dateLocked: '0',
      dateReceived: '1653669490',
      dateRecycled: '1654090525',
      dateSubmitted: '0',
      documentId: '4e18caab-56ab-4715-aa9b-3436b3b35e22',
      escalationCategoryIssue: 'Recycle Bin',
      escalationCategoryLevel: 'Internal Xdc Process',
      escalationCategoryReason: 'Duplicate Invoice',
      fileId: '301725036',
      fileName: 'B15292387.pdf',
      indexedDocumentId: '77379132-f950-4184-b184-858c1cfcfac4',
      ingestionType: 'email',
      invoiceAmount: '212.91',
      invoiceDate: '1653523200',
      invoiceNumber: 'B15292387',
      invoiceSourceId: 'AvidSuite',
      invoiceType: 'Standard',
      isSubmitted: '0',
      lockedBy: 'none',
      propertyCode: '89',
      purchaseOrderIdentifier: 'INC0114927',
      registrationCode: 'VXZBIQ5LR',
      secondsSpentIndexing: '9.9999999999999995E-08',
      shipToAddress: '1210 Avidxchange Lane  Charlotte, NC 28206',
      shipToId: '55195368',
      shipToName: 'IT Service Desk (16011)',
      sourceEmail: 'InvoiceAcknowledgements@shi.com',
      supplier: 'SHI International Corporation',
      supplierAddress: 'PO Box 952121  Dallas, TX 75395-2121',
      supplierId: '346468',
      unindexedDocumentId: '5d0066ce-3eb2-40c1-a993-02efaa6215d7',
      vendorName: 'SHI',
    },
  ];
}

export function getHistoricalVolumeReport() {
  return [
    {
      dateReceived: '1642452683',
      buyerName: 'avidxchange, inc',
      count: '2',
    },
    {
      dateReceived: '1642452683',
      buyerName: 'avidxchange, inc',
      count: '6',
    },
  ];
}

export function getTransactionCountReport() {
  return [
    {
      buyerName: 'avidxchange, inc',
      count: '1',
      dateReceived: '1649635200',
      ingestionType: 'user upload',
      propertyCode: 'hq - esllc',
      shipToName: 'hq - esllc',
    },
    {
      buyerName: 'avidxchange, inc',
      count: '6',
      dateReceived: '1650240000',
      ingestionType: 'api',
      propertyCode: null,
      shipToName: null,
    },
  ];
}

export function getExceptionVolumeReport() {
  return [
    {
      escalationCategoryIssue: 'Ship To Research',
      count: '2',
    },
    {
      escalationCategoryIssue: 'None',
      count: '98',
    },
    {
      escalationCategoryIssue: 'Image',
      count: '40',
    },
    {
      escalationCategoryIssue: 'Pdf',
      count: '50',
    },
  ];
}

export function generateActivityByProperty() {
  return [
    {
      ingestionType: 'scan',
      isSubmitted: '0',
      lastModifiedByUser: 'avidindexing.com',
    },
    {
      ingestionType: 'api',
      isSubmitted: '0',
      lastModifiedByUser: 'avidxchange.com',
    },
    {
      ingestionType: 'email',
      isSubmitted: '0',
      lastModifiedByUser: 'mockUser.com',
    },
    {
      ingestionType: 'email',
      isSubmitted: '1',
      lastModifiedByUser: 'mockUser.com',
    },
  ];
}

export function getQueueAgingReport() {
  return [
    {
      group: '3+ Days Old',
      count: '7',
      documentId: '',
    },
  ];
}

export function getTopPaperSuppliers() {
  return [
    {
      count: '7',
      supplier: 'A&W RootBeer',
    },
    {
      count: '5',
      supplier: 'AvidXchange Inc',
    },
    {
      count: '2',
      supplier: 'Grandmas Cookies',
    },
  ];
}

export function getActivityReport() {
  return [
    {
      count: '7',
      ingestionType: IngestionTypes.Api,
    },
    {
      count: '5',
      ingestionType: IngestionTypes.Email,
    },
    {
      count: '2',
      ingestionType: IngestionTypes.Scan,
    },
  ];
}

export function generateQueueAgingReport() {
  return [
    {
      buyerName: 'mock Name',
      invoiceNumber: '123456',
      invoiceAmount: '123',
      vendorName: 'VendorName',
      shipToName: 'PropertyName',
      propertyCode: 'propCode1',
      lastModified: '01/01/2022',
      ingestionType: 'API',
      sourceEmail: 'mock@mock.com',
      lastModifiedByUser: 'user',
      escalationCategoryIssue: 'ImageIssue',
      previousQueue: 'DataException',
    },
  ];
}

export function generateQueueAgingHistoricReport() {
  return [
    {
      invoiceNumber: '123456',
      invoiceAmount: '123',
      vendorName: 'VendorName',
      supplierId: 'VendorID',
      shipToName: 'PropertyName',
      propertyCode: 'propCode1',
      lastModified: '01/01/2022',
      sourceEmail: 'mock@mock.com',
      lastModifiedByUser: 'user',
      escalationCategoryIssue: 'ImageIssue',
    },
  ];
}

export function generateProcessingDateRangeReport() {
  return [
    {
      fileName: 'document.pdf',
      documentId: '123-1223-123',
      invoiceNumber: '1234',
      dateReceived: '02/02/2022',
      ingestionType: 'API',
      lastModifiedByUser: 'user',
      supplier: 'supplier',
      supplierAddress: 'supplierAddress',
      shipToName: 'entity name',
      propertyCode: 'entity code',
      customerAccountNumber: 'customer acct no',
      buyerName: 'Avidxchange',
      sourceEmail: 'mock@email.com',
    },
  ];
}

export function getQueueAgingGroupedReport() {
  return [{ days: '"1638921600"', count: '7' }];
}

export function getSetUpDataHalfPieChart() {
  return [
    { documentId: '', group: '20%', count: '20' },
    { documentId: '', group: '40%', count: '20' },
    { documentId: '', group: '60%', count: '20' },
    { documentId: '', group: '80%', count: '20' },
    { documentId: '', group: '100%', count: '20' },
  ];
}

export function getIngestionTypeData() {
  return [
    {
      ingestionType: 'scan',
      count: '20',
    },
    {
      ingestionType: 'api',
      count: '20',
    },
    {
      ingestionType: 'email',
      count: '20',
    },
  ];
}

export function getActivityStub(): Activity {
  return {
    ordinal: 1,
    startDate: '2021-02-12T17:38:19.0958208Z',
    endDate: '2021-02-12T17:38:19.0958208Z',
    indexer: 'avidtest@avidxchange.com',
    activity: 'Create New Account',
    changeLog: [],
    description: 'No description',
    escalation: {
      category: { issue: '', reason: '' },
      description: '',
      escalationLevel: '',
      resolution: '',
    },
    labels: [],
  };
}

export function getEscalationStub(issue: string): Escalation {
  return {
    category: { issue, reason: '' },
    description: '',
    escalationLevel: '',
    resolution: '',
  };
}

export function getEnvironmentStub(): Environment {
  return {
    production: 'false',
    isBeta: 'false',
    apiBaseUri: 'http://idcapi.avidxchange.com/',
    bkwsBaseUri: 'https://api.devavidxcloud.com/v1/buyerkeywordservice/',
    lookupApiBaseUri: 'http://localhost:3000/',
    invoiceIngestionApiBaseUri: 'http://localhost:3000/',
    appInsights: {
      instrumentationKey: '4eea2c12-19b2-4114-85a1-5e5d45b6ee86',
    },
    avidInboxLink: 'https://avidinbox.asqa01avidxchange.net/InvoiceProcessor',
    avidInvoiceLink:
      'https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/sso/initiate?to_app=AvidSuite&amp;to_url=https://one.asqa01avidxchange.net',
    clientGuidelinesLink: 'https://help.avidxchange.com/s/article/AvidInvoice-Indexing-Guidelines',
    appConfigConnectionString:
      'Endpoint=https://ax-ae1-dv-idc-invrecog-appconfig.azconfig.io;Id=g8t6-l0-s0:7zBABhL1HAklYGb/dldx;Secret=VB4iBpIcKn5Ff4Sw8J4xkk4xhnnQHadgwpKKtNYZ6gM=',
    avidSuiteInvoiceUrl: 'https://one.qaavidxchange.net/#/invoices/',
    maxUnindexedPages: '10',
    avidAuthBaseUri: 'https://api-qa01.devavidxcloud.com/SecPlat/SecAvid/avidauth/avidauth/',
    avidAuthLoginUrl: 'https://login.qa.avidsuite.com',
  };
}

export function getPendingPageFiltersStub(): AdvancedFilter {
  return {
    buyerId: ['25'] as any,
    escalationCategoryIssue: [EscalationCategoryTypes.None],
    ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
    isSubmitted: [0],
  };
}

export function getResearchPageFiltersStub(): AdvancedFilter {
  return {
    buyerId: ['25'] as any,
    escalationCategoryIssue: [
      `-${EscalationCategoryTypes.None}`,
      `-${EscalationCategoryTypes.Void}`,
      `-${EscalationCategoryTypes.RecycleBin}`,
    ],
    isSubmitted: [0],
  };
}

export function getRecycleBinPageFiltersStub(): AdvancedFilter {
  return {
    buyerId: ['25'] as any,
    escalationCategoryIssue: [`${EscalationCategoryTypes.RecycleBin}`],
    dateRecycled: [],
    isSubmitted: [0],
  };
}

export function getUploadsPageFiltersStub(): AdvancedFilter {
  return {
    buyerId: ['25'] as any,
    escalationCategoryIssue: [EscalationCategoryTypes.None],
    ingestionType: [IngestionTypes.Api],
    isSubmitted: [0],
    sourceEmail: ['mockemail'],
  };
}
