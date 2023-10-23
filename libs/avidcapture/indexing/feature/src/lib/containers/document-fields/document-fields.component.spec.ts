import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import {
  CreateCustomerAccountActivity,
  GetMaxInvoiceNumberLength,
  QueryDocumentFormFields,
  QueryLookupCustomerAccounts,
  QueryLookupProperties,
  QueryLookupSuppliers,
  QueryOrderedBy,
  QueryWorkflow,
  RemoveLatestFieldAssociation,
  ResetLookupDropdownData,
  ResetLookupState,
  SanitizeFieldValue,
  SetCustomerAccount,
  SetDueDate,
  SetExistingOrderedBy,
  SetExistingProperty,
  SetExistingSupplier,
  SetExistingWorkflow,
  SetLookupOrderedBy,
  SetLookupProperty,
  SetLookupSupplier,
  SetLookupWorkflow,
  UpdateFormattedFields,
  UpdateInvoiceType,
  UpdateLookupFieldAssociationValue,
  UpdateLookupFieldOnNoSelection,
  UpdateNonLookupField,
  UpdateOnManualIntervention,
  UpdateUtilityFields,
} from '@ui-coe/avidcapture/indexing/data-access';
import {
  DropdownFieldComponent,
  EscalationReasonComponent,
  LookupFieldsComponent,
  NonLookupFieldComponent,
} from '@ui-coe/avidcapture/indexing/ui';
import { HotkeysService } from '@ui-coe/avidcapture/indexing/util';
import {
  IndexingDocumentFieldsStateMock,
  IndexingPageMock,
  compositeDataStub,
  createCustomerAccountStub,
  customerAccountsStub,
  fieldBaseStub,
  fieldControlStub,
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  orderedByStub,
  propertiesStub,
  singleOrgTokenStub,
  suppliersStub,
  utilityCompositeDataStub,
  workflowStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  CompositeDocument,
  ControlTypes,
  DocumentLabelKeys,
  FieldBase,
  FieldTypes,
  InvoiceTypes,
} from '@ui-coe/avidcapture/shared/types';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { DocumentFieldsComponent } from './document-fields.component';

const dialogStub = {
  open: jest.fn(),
};

const hotkeysServiceStub = {
  initializeHotKeys: jest.fn(),
  addShortcut: jest.fn(),
  openHelpModal: jest.fn(),
  unsubscribe: jest.fn(),
  canOpenHotKeysModal: false,
};

export const storeStub = {
  selectSnapshot: jest.fn(),
};

describe('DocumentFieldsComponent', () => {
  let component: DocumentFieldsComponent;
  let fixture: ComponentFixture<DocumentFieldsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentFieldsComponent,
        MockComponent(EscalationReasonComponent),
        MockComponent(LookupFieldsComponent),
        MockComponent(NonLookupFieldComponent),
        MockComponent(DropdownFieldComponent),
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([IndexingDocumentFieldsStateMock, IndexingPageMock], {
          developmentMode: true,
        }),
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: HotkeysService,
          useValue: hotkeysServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFieldsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    const invoiceTypeField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
    invoiceTypeField.value = InvoiceTypes.Standard;
    describe('instantiating selectedInvoiceType', () => {
      describe('when compositeData is NULL', () => {
        beforeEach(() => {
          component.compositeData = null;
          fixture.detectChanges();
        });

        it('should set selectedInvoiceType to Standard', () =>
          expect(component.selectedInvoiceType).toBe(InvoiceTypes.Standard));
      });

      describe('when compositeData is defined', () => {
        beforeEach(() => {
          component.compositeData = getCompositeDataStub();
          fixture.detectChanges();
        });

        it('should set selectedInvoiceType to the InvoiceType label value', () =>
          expect(component.selectedInvoiceType).toBe(
            component.compositeData.indexed.labels[0].value.text
          ));
      });
    });

    it('should dispatch QueryDocumentFormFields with Standard, SetExistingProperty, and SetExistingSupplier actions', () => {
      component.compositeData = compositeDataStub;
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new UpdateInvoiceType(InvoiceTypes.Standard),
        new QueryDocumentFormFields(),
        new SetExistingProperty(),
        new SetExistingSupplier(),
        new SetExistingOrderedBy(),
        new SetExistingWorkflow(),
      ]);
    });

    it('should dispatch QueryDocumentFormFields with Utility, SetExistingProperty, and SetExistingSupplier actions', () => {
      component.compositeData = utilityCompositeDataStub;
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new UpdateInvoiceType(InvoiceTypes.Utility),
        new QueryDocumentFormFields(),
        new SetExistingProperty(),
        new SetExistingSupplier(),
        new SetExistingOrderedBy(),
        new SetExistingWorkflow(),
      ]);
    });

    describe('Set invoice type to formattedFields ', () => {
      const invoiceTypeFieldMock = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      invoiceTypeFieldMock.value = InvoiceTypes.Standard;
      invoiceTypeFieldMock.controlType = ControlTypes.Dropdown;
      const InvoiceType = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      const fieldsBaseStub = [];
      InvoiceType.controlType = ControlTypes.Dropdown;
      fieldsBaseStub.push(InvoiceType);

      beforeEach(() => {
        store.reset({
          indexingPage: { buyerId: '25' },
          indexingDocumentFields: {
            formattedFields: fieldsBaseStub,
          },
        });
        component.compositeData = compositeDataStub;
        fixture.detectChanges();
      });

      it('should dispatch UpdateFormattedFields and UpdateOnManualIntervention actions', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new UpdateInvoiceType(InvoiceTypes.Standard),
          new QueryDocumentFormFields(),
          new SetExistingProperty(),
          new SetExistingSupplier(),
          new SetExistingOrderedBy(),
          new SetExistingWorkflow(),
        ]);

        expect(store.dispatch).toHaveBeenNthCalledWith(2, [
          new UpdateFormattedFields(invoiceTypeFieldMock),
          new UpdateOnManualIntervention({
            value: InvoiceTypes.Standard,
            key: DocumentLabelKeys.nonLookupLabels.InvoiceType,
            type: FieldTypes.String,
          } as FieldBase<string>),
        ]);
      });
    });
  });

  describe('ngOnChanges()', () => {
    describe('when a change occurs for fieldToHighlight & boundingBoxIds match', () => {
      beforeEach(() => {
        component.compositeData = compositeDataStub;
        component.fieldToHighlight = 'label-feature-InvoiceType';
        component.ngOnChanges({
          fieldToHighlight: new SimpleChange(null, 'label-feature-InvoiceType', true),
        });
      });

      it('should set highlightLabels to compositeDataStub first label', () =>
        expect(component.highlightLabels).toEqual([compositeDataStub.indexed.labels[0]]));
    });

    describe('when a change occurs for fieldToHighlight & boundingBoxIds DO NOT match', () => {
      beforeEach(() => {
        component.compositeData = compositeDataStub;
        component.fieldToHighlight = '';
        component.ngOnChanges({
          fieldToHighlight: new SimpleChange(null, null, true),
        });
      });

      it('should set highlightLabels to an empty array', () =>
        expect(component.highlightLabels).toEqual([]));
    });
  });

  describe('ngOnDestroy()', () => {
    it('should call the ResetLookupState action', () => {
      fixture.destroy();
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new ResetLookupState());
    });
  });

  describe('handleInvoiceTypeSelect()', () => {
    const invoiceTypeField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
    invoiceTypeField.value = InvoiceTypes.Standard;
    const formattedFieldsStub = [invoiceTypeField];
    beforeEach(() => {
      store.reset({
        indexingDocumentFields: {
          formattedFields: formattedFieldsStub,
        },
      });
      component.handleInvoiceTypeSelect(InvoiceTypes.Standard);
    });

    it('should define selectedInvoiceType as Standard', () =>
      expect(component.selectedInvoiceType).toBe(InvoiceTypes.Standard));

    it('should dispatch ParseDocumentFormFields action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new UpdateInvoiceType(component.selectedInvoiceType),
        new UpdateFormattedFields(invoiceTypeField),
        new UpdateUtilityFields(),
        new UpdateOnManualIntervention({
          value: InvoiceTypes.Standard,
          key: DocumentLabelKeys.nonLookupLabels.InvoiceType,
          type: FieldTypes.String,
        } as FieldBase<string>),
      ]));
  });

  describe('setConfidenceColor()', () => {
    it('should return a confidence percentage of 9999', () => {
      expect(component.setConfidenceColor(fieldControlStub[0])).toBe('green');
    });
  });

  describe('getConfidencePercentage()', () => {
    it('should return a confidence percentage of 9999', () => {
      expect(component.getConfidencePercentage(fieldControlStub[0])).toBe(9999);
    });
  });

  describe('updateOnManualIntervention()', () => {
    beforeEach(() => {
      component.updateOnManualIntervention(fieldBaseStub[0]);
    });

    it('should dispatch the UpdateOnManualIntervention action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new UpdateOnManualIntervention(fieldBaseStub[0])
      ));
  });

  describe('updateNonLookupField()', () => {
    beforeEach(() => {
      component.updateNonLookupField(fieldBaseStub[0]);
    });

    it('should set tabbedToField to NULL', () => expect(component.tabbedToField).toBeNull());

    it('should dispatch the UpdateNonLookupField action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new UpdateNonLookupField(fieldBaseStub[0])
      ));
  });

  describe('updateLookupValue()', () => {
    describe('when field is customer account number', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: customerAccountsStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
        });
      });

      it('should dispatch the SetCustomerAccount action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetCustomerAccount(customerAccountsStub[0])
        ));
    });

    describe('when field is supplier and  isSponsorUser is false', () => {
      beforeEach(() => {
        component.isSponsorUser = false;
        component.updateLookupValue({
          lookupValue: suppliersStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      it('should dispatch the SetLookupSupplier action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupSupplier(suppliersStub[0], DocumentLabelKeys.lookupLabels.Supplier)
        ));

      it('should dispatch the GetMaxInvoiceNumberLength action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          2,
          new GetMaxInvoiceNumberLength(suppliersStub[0].vendorID.toString())
        ));
    });

    describe('when field is supplier and isSponsorUser is true', () => {
      beforeEach(() => {
        component.isSponsorUser = true;
        component.updateLookupValue({
          lookupValue: suppliersStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      it('should dispatch the SetLookupSupplier action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupSupplier(suppliersStub[0], DocumentLabelKeys.lookupLabels.Supplier)
        ));

      it('should do not dispatch the GetMaxInvoiceNumberLength action', () =>
        expect(store.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new GetMaxInvoiceNumberLength(suppliersStub[0].vendorID.toString())
        ));
    });

    describe('when field is supplier ', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: suppliersStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      it('should dispatch the SetLookupSupplier action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupSupplier(suppliersStub[0], DocumentLabelKeys.lookupLabels.Supplier)
        ));

      it('should do not dispatch the GetMaxInvoiceNumberLength action', () =>
        expect(store.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new GetMaxInvoiceNumberLength(suppliersStub[0].vendorID.toString())
        ));
    });

    describe('when field is supplier address', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: suppliersStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.SupplierAddress,
        });
      });

      it('should dispatch the SetLookupSupplier action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupSupplier(suppliersStub[0], DocumentLabelKeys.lookupLabels.SupplierAddress)
        ));
    });

    describe('when field is ship to name', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: propertiesStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        });
      });

      it('should dispatch the SetLookupProperty action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupProperty(propertiesStub[0], DocumentLabelKeys.lookupLabels.ShipToName)
        ));
    });

    describe('when field is ship to address', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: propertiesStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.ShipToAddress,
        });
      });

      it('should dispatch the SetLookupProperty action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupProperty(propertiesStub[0], DocumentLabelKeys.lookupLabels.ShipToAddress)
        ));
    });

    describe('when field is orderedBy', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: orderedByStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.OrderedBy,
        });
      });

      it('should dispatch the SetLookupOrderedBy action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupOrderedBy(orderedByStub[0], DocumentLabelKeys.lookupLabels.OrderedBy)
        ));
    });

    describe('when field is workflow', () => {
      beforeEach(() => {
        component.updateLookupValue({
          lookupValue: workflowStub[0] as any,
          field: DocumentLabelKeys.lookupLabels.Workflow,
        });
      });

      it('should dispatch the SetLookupWorkflow action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetLookupWorkflow(workflowStub[0], DocumentLabelKeys.lookupLabels.Workflow)
        ));
    });
  });

  describe('queryLookupField()', () => {
    describe('when field is customer account number', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
        });
      });

      it('should dispatch the QueryLookupCustomerAccounts action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryLookupCustomerAccounts('test')));
    });

    describe('when field is supplier', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      it('should dispatch the QueryLookupSuppliers action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryLookupSuppliers('test')));
    });

    describe('when field is supplier address', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.SupplierAddress,
        });
      });

      it('should dispatch the QueryLookupSuppliers action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryLookupSuppliers('test')));
    });

    describe('when field is ship to name', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        });
      });

      it('should dispatch the QueryLookupProperties action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryLookupProperties('test')));
    });

    describe('when field is ship to address', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.ShipToAddress,
        });
      });

      it('should dispatch the QueryLookupProperties action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryLookupProperties('test')));
    });

    describe('when field is orderedBy', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.OrderedBy,
        });
      });

      it('should dispatch the QueryLookupOrderedBy action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryOrderedBy('test')));
    });

    describe('when field is workflow', () => {
      beforeEach(() => {
        component.queryLookupField({
          value: 'test',
          field: DocumentLabelKeys.lookupLabels.Workflow,
        });
      });

      it('should dispatch the QueryLookupWorkflow action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryWorkflow('test')));
    });
  });

  describe('removeLatestFieldAssociation()', () => {
    beforeEach(() => {
      component.removeLatestFieldAssociation();
    });

    it('should dispatch the RemoveLatestFieldAssociation action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new RemoveLatestFieldAssociation()));
  });

  describe('resetLookupDropdownData()', () => {
    beforeEach(() => {
      component.resetLookupDropdownData();
    });

    it('should dispatch the ResetLookupDropdownData action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new ResetLookupDropdownData()));
  });

  describe('newAccountNumberCreated()', () => {
    beforeEach(() => {
      component['newAccountNumberCreated'](createCustomerAccountStub);
    });

    it('should dispatch the ResetLookupDropdownData action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new CreateCustomerAccountActivity(createCustomerAccountStub),
        new SetDueDate(),
      ]));
  });

  describe('getBoundingBoxId()', () => {
    describe('when field is NOT NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.boundingBoxToHighlight, 'emit').mockReturnValue();
        compositeDataStub.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceType;
        component.compositeData = compositeDataStub;
        component.getBoundingBoxId(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      });

      it('should emit boundingBoxToHighlight with a label id', () =>
        expect(component.boundingBoxToHighlight.emit).toHaveBeenNthCalledWith(
          1,
          'label-feature-InvoiceType'
        ));
    });

    describe('when field is NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.boundingBoxToHighlight, 'emit').mockReturnValue();
        component.compositeData = compositeDataStub;
        component.getBoundingBoxId(null);
      });

      it('should emit boundingBoxToHighlight with an empty string', () =>
        expect(component.boundingBoxToHighlight.emit).toHaveBeenNthCalledWith(1, ''));
    });

    describe('when compositeData is NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.boundingBoxToHighlight, 'emit').mockReturnValue();
        component.compositeData = null;
        component.getBoundingBoxId('mock');
      });

      it('should emit boundingBoxToHighlight with an empty string', () =>
        expect(component.boundingBoxToHighlight.emit).toHaveBeenNthCalledWith(1, ''));
    });

    describe('when indexed data is NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.boundingBoxToHighlight, 'emit').mockReturnValue();
        component.compositeData = { indexed: null } as CompositeDocument;
        component.getBoundingBoxId('mock');
      });

      it('should emit boundingBoxToHighlight with an empty string', () =>
        expect(component.boundingBoxToHighlight.emit).toHaveBeenNthCalledWith(1, ''));
    });

    describe('when indexed data labels is NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.boundingBoxToHighlight, 'emit').mockReturnValue();
        component.compositeData = { indexed: { labels: [] } } as CompositeDocument;
        component.getBoundingBoxId('mock');
      });

      it('should emit boundingBoxToHighlight with an empty string', () =>
        expect(component.boundingBoxToHighlight.emit).toHaveBeenNthCalledWith(1, ''));
    });

    describe('when no label is an empty array after filtering', () => {
      beforeEach(() => {
        jest.spyOn(component.boundingBoxToHighlight, 'emit').mockReturnValue();
        component.compositeData = {
          indexed: {
            labels: [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)],
          },
        } as CompositeDocument;
        component.getBoundingBoxId('mock');
      });

      it('should emit boundingBoxToHighlight with an empty string', () =>
        expect(component.boundingBoxToHighlight.emit).toHaveBeenNthCalledWith(1, ''));
    });
  });

  describe('resetLookUpFieldsEditMode()', () => {
    const field = 'Supplier';
    beforeEach(() => {
      component.editModeField = '';
      component.resetLookUpFieldsEditMode(field);
    });

    it('should set editModeField', () => expect(component.editModeField).toBe(field));
    it('should set tabbedToField to NULL', () => expect(component.tabbedToField).toBeNull());
  });

  describe('lookupFieldSelectedForAssociation()', () => {
    describe('when field passed in is null', () => {
      beforeEach(() => {
        store.reset({
          indexingUtility: {
            selectedDocumentText: null,
          },
        });

        component.lookupFieldSelectedForAssociation(null);
      });

      it('should not dispatch the SanitizeFieldValue action', () =>
        expect(store.dispatch).not.toHaveBeenCalled());
    });

    describe('when field passed in is NOT null but selectedText is null', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        store.reset({
          indexingUtility: {
            selectedDocumentText: null,
          },
        });

        component.lookupFieldSelectedForAssociation(fieldStub);
      });

      it('should not dispatch the SanitizeFieldValue action', () =>
        expect(store.dispatch).not.toHaveBeenCalled());
    });

    describe('when field passed in is NOT null & selectedDocumentText is NOT null', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        store.reset({
          indexingUtility: {
            selectedDocumentText: 'mock',
          },
        });
        component.lookupFieldSelectedForAssociation(fieldStub);
      });

      it('should dispatch the SanitizeFieldValue & UpdateLookupFieldAssociationValue actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new SanitizeFieldValue(fieldStub, true),
          new UpdateLookupFieldAssociationValue(fieldStub),
        ]));
    });
  });

  describe('fieldSelectedForAssociation()', () => {
    describe('when field passed in is null', () => {
      beforeEach(() => {
        store.reset({
          indexingUtility: {
            selectedDocumentText: null,
          },
        });
        component.fieldSelectedForAssociation(null);
      });

      it('should not dispatch the SanitizeFieldValue action', () =>
        expect(store.dispatch).not.toHaveBeenCalled());
    });

    describe('when field passed in is NOT null but selectedText is null', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        store.reset({
          indexingUtility: {
            selectedDocumentText: null,
          },
        });
        component.fieldSelectedForAssociation(fieldStub);
      });

      it('should not dispatch the SanitizeFieldValue action', () =>
        expect(store.dispatch).not.toHaveBeenCalled());
    });

    describe('when field passed in is NOT null & selectedText is NOT null', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        store.reset({
          indexingUtility: {
            selectedDocumentText: 'mock',
          },
        });
        component.fieldSelectedForAssociation(fieldStub);
      });

      it('should dispatch the SanitizeFieldValue action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SanitizeFieldValue(fieldStub, false)
        ));
    });
  });

  describe('handleNoSelection()', () => {
    const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

    beforeEach(() => {
      component.handleNoSelection(fieldStub);
    });

    it('should dispatch UpdateLookupFieldOnNoSelection action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new UpdateLookupFieldOnNoSelection(fieldStub)
      ));
  });

  describe('tabKeyPress()', () => {
    const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);

    beforeEach(() => {
      component.tabKeyPress(fieldStub);
    });

    it('should set global var tabbedToField', () =>
      expect(component.tabbedToField).toEqual(fieldStub));
  });

  describe('tabKeyPressLookup()', () => {
    describe('when field passed in is supplier and it has no value', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const expectedValue = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);

      fieldStub.value = '';
      beforeEach(() => {
        store.reset({
          indexingDocumentFields: {
            fields: [fieldStub, expectedValue],
          },
        });
        component.tabKeyPressLookup(fieldStub);
      });

      it('should set global var tabbedToField to ShipTo field', () =>
        expect(component.tabbedToField).toEqual(expectedValue));
    });

    describe('when field passed in is supplier and it has a value', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const expectedValue = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);

      fieldStub.value = 'mock';
      beforeEach(() => {
        store.reset({
          indexingDocumentFields: {
            fields: [fieldStub, expectedValue],
          },
        });
        component.tabKeyPressLookup(fieldStub);
      });

      it('should set global var tabbedToField to Customer Account Number field', () =>
        expect(component.tabbedToField).toEqual(expectedValue));
    });

    describe('when field passed in is customer account number', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const expectedValue = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);

      beforeEach(() => {
        store.reset({
          indexingDocumentFields: {
            fields: [fieldStub, expectedValue],
          },
        });
        component.tabKeyPressLookup(fieldStub);
      });

      it('should set global var tabbedToField to ShipTo field', () =>
        expect(component.tabbedToField).toEqual(expectedValue));
    });

    describe('when field passed in is ship to', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const expectedValue = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

      beforeEach(() => {
        store.reset({
          indexingDocumentFields: {
            fields: [fieldStub, expectedValue],
          },
        });
        component.tabKeyPressLookup(fieldStub);
      });

      it('should set global var tabbedToField to Invoice Number field', () =>
        expect(component.tabbedToField).toEqual(expectedValue));
    });
  });

  describe('openCreateAccountModal()', () => {
    describe('when modal does NOT return a value', () => {
      beforeEach(() => {
        jest.spyOn(component, 'updateLookupValue').mockImplementation();
        jest.spyOn(component as any, 'newAccountNumberCreated').mockImplementation();

        dialogStub.open.mockReturnValue({
          afterClosed: () => of(null),
        });
        hotkeysServiceStub.addShortcut.mockReturnValue(of());

        component.openCreateAccountModal('');
      });

      it('should set hotkeyService canOpenHotKeysModal to false', () => {
        expect(hotkeysServiceStub.canOpenHotKeysModal).toBeFalsy();
      });

      it('should NOT call updated lookup value fn', () => {
        expect(component.updateLookupValue).not.toHaveBeenCalled();
      });

      it('should NOT call newAccountNumberCreated fn with resultStub', () =>
        expect(component['newAccountNumberCreated']).not.toHaveBeenCalled());
    });
  });
});
