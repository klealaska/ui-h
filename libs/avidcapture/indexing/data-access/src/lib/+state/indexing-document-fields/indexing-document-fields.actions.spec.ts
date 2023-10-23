import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import {
  customerAccountsStub,
  getFieldBaseStub,
  orderedByStub,
  propertiesStub,
  suppliersStub,
  workflowStub,
} from '@ui-coe/avidcapture/shared/test';
import { InvoiceTypes, LookupLoadingState } from '@ui-coe/avidcapture/shared/types';

import * as actions from './indexing-document-fields.actions';

describe('Indexing Document Fields Actions', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  describe('QueryDocumentFormFields', () => {
    beforeEach(() => store.dispatch(new actions.QueryDocumentFormFields()));

    it('should dispatch QueryDocumentFormFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryDocumentFormFields());
    });
  });

  describe('ParseDocumentFormFields', () => {
    beforeEach(() => store.dispatch(new actions.ParseDocumentFormFields()));

    it('should dispatch ParseDocumentFormFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ParseDocumentFormFields());
    });
  });

  describe('FormatFields', () => {
    beforeEach(() => store.dispatch(new actions.FormatFields()));

    it('should dispatch FormatFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.FormatFields());
    });
  });

  describe('QueryLookupCustomerAccounts', () => {
    beforeEach(() => store.dispatch(new actions.QueryLookupCustomerAccounts('mock')));

    it('should dispatch QueryLookupCustomerAccounts action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryLookupCustomerAccounts('mock')
      );
    });
  });

  describe('QueryLookupProperties', () => {
    beforeEach(() => store.dispatch(new actions.QueryLookupProperties('mock')));

    it('should dispatch QueryLookupProperties action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryLookupProperties('mock'));
    });
  });

  describe('QueryLookupSuppliers', () => {
    beforeEach(() => store.dispatch(new actions.QueryLookupSuppliers('mock')));

    it('should dispatch QueryLookupSuppliers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryLookupSuppliers('mock'));
    });
  });

  describe('QueryOrderedBy', () => {
    beforeEach(() => store.dispatch(new actions.QueryOrderedBy('mock')));

    it('should dispatch QueryOrderedBy action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryOrderedBy('mock'));
    });
  });

  describe('QueryWorkflow', () => {
    beforeEach(() => store.dispatch(new actions.QueryWorkflow('mock')));

    it('should dispatch QueryWorkflow action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryWorkflow('mock'));
    });
  });

  describe('LookupLoading', () => {
    beforeEach(() => store.dispatch(new actions.LookupLoading()));

    it('should dispatch LookupLoading action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.LookupLoading());
    });
  });

  describe('SetLookupLoading', () => {
    const lookupLoadingStateStub: LookupLoadingState = {
      customerAccountLoading: false,
      shipToLoading: false,
      supplierLoading: false,
      orderedByLoading: false,
      workflowLoading: false,
    };

    beforeEach(() => store.dispatch(new actions.SetLookupLoading(lookupLoadingStateStub)));

    it('should dispatch SetLookupLoading action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetLookupLoading(lookupLoadingStateStub)
      );
    });
  });

  describe('SetExistingSupplier', () => {
    beforeEach(() => store.dispatch(new actions.SetExistingSupplier()));

    it('should dispatch SetExistingSupplier action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetExistingSupplier());
    });
  });

  describe('SetExistingProperty', () => {
    beforeEach(() => store.dispatch(new actions.SetExistingProperty()));

    it('should dispatch SetExistingProperty action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetExistingProperty());
    });
  });

  describe('SetExistingCustomerAccountNumber', () => {
    beforeEach(() => store.dispatch(new actions.SetExistingCustomerAccountNumber()));

    it('should dispatch SetExistingCustomerAccountNumber action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetExistingCustomerAccountNumber()
      );
    });
  });

  describe('SetExistingNewAccountNumber', () => {
    beforeEach(() => store.dispatch(new actions.SetExistingNewAccountNumber()));

    it('should dispatch SetExistingNewAccountNumber action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetExistingNewAccountNumber());
    });
  });

  describe('SetExistingOrderedBy', () => {
    beforeEach(() => store.dispatch(new actions.SetExistingOrderedBy()));

    it('should dispatch SetExistingOrderedBy action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetExistingOrderedBy());
    });
  });

  describe('SetExistingWorkflow', () => {
    beforeEach(() => store.dispatch(new actions.SetExistingWorkflow()));

    it('should dispatch SetExistingWorkflow action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetExistingWorkflow());
    });
  });

  describe('SetCustomerAccount', () => {
    beforeEach(() => store.dispatch(new actions.SetCustomerAccount(customerAccountsStub[0])));

    it('should dispatch SetCustomerAccount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetCustomerAccount(customerAccountsStub[0])
      );
    });
  });

  describe('SetLookupProperty', () => {
    const field = 'Property';

    beforeEach(() => store.dispatch(new actions.SetLookupProperty(propertiesStub[0], field)));

    it('should dispatch SetLookupProperty action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetLookupProperty(propertiesStub[0], field)
      );
    });
  });

  describe('SetLookupSupplier', () => {
    const field = 'Supplier';

    beforeEach(() => store.dispatch(new actions.SetLookupSupplier(suppliersStub[0], field)));

    it('should dispatch SetLookupSupplier action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetLookupSupplier(suppliersStub[0], field)
      );
    });
  });

  describe('SetLookupOrderedBy', () => {
    const field = 'Ordered By';

    beforeEach(() => store.dispatch(new actions.SetLookupOrderedBy(orderedByStub[0], field)));

    it('should dispatch SetLookupOrderedBy action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetLookupOrderedBy(orderedByStub[0], field)
      );
    });
  });

  describe('SetLookupWorkflow', () => {
    const field = 'Ordered By';

    beforeEach(() => store.dispatch(new actions.SetLookupWorkflow(workflowStub[0], field)));

    it('should dispatch SetLookupWorkflow action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SetLookupWorkflow(workflowStub[0], field)
      );
    });
  });

  describe('PredetermineCustomerAccountNumber', () => {
    beforeEach(() => store.dispatch(new actions.PredetermineCustomerAccountNumber(1)));

    it('should dispatch PredetermineCustomerAccountNumber action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.PredetermineCustomerAccountNumber(1)
      );
    });
  });

  describe('PredetermineShipTo', () => {
    beforeEach(() => store.dispatch(new actions.PredetermineShipTo(customerAccountsStub[0])));

    it('should dispatch PredetermineShipTo action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.PredetermineShipTo(customerAccountsStub[0])
      );
    });
  });

  describe('ResetLookupDropdownData', () => {
    beforeEach(() => store.dispatch(new actions.ResetLookupDropdownData()));

    it('should dispatch ResetLookupDropdownData action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ResetLookupDropdownData());
    });
  });

  describe('ResetLookupState', () => {
    beforeEach(() => store.dispatch(new actions.ResetLookupState()));

    it('should dispatch ResetLookupState action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ResetLookupState());
    });
  });

  describe('UpdateNonLookupField', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateNonLookupField(fieldBaseStub)));

    it('should dispatch UpdateNonLookupField action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateNonLookupField(fieldBaseStub)
      );
    });
  });

  describe('UpdateLookupFieldOnFieldAssociation', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() =>
      store.dispatch(new actions.UpdateLookupFieldOnFieldAssociation(fieldBaseStub))
    );

    it('should dispatch UpdateLookupFieldOnFieldAssociation action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateLookupFieldOnFieldAssociation(fieldBaseStub)
      );
    });
  });

  describe('UpdateLookupFieldOnNoSelection', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateLookupFieldOnNoSelection(fieldBaseStub)));

    it('should dispatch UpdateLookupFieldOnNoSelection action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateLookupFieldOnNoSelection(fieldBaseStub)
      );
    });
  });

  describe('UpdateFormattedFields', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateFormattedFields(fieldBaseStub)));

    it('should dispatch UpdateFormattedFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateFormattedFields(fieldBaseStub)
      );
    });
  });

  describe('UpdateInvoiceType', () => {
    beforeEach(() => store.dispatch(new actions.UpdateInvoiceType(InvoiceTypes.Standard)));

    it('should dispatch UpdateInvoiceType action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateInvoiceType(InvoiceTypes.Standard)
      );
    });
  });

  describe('UpdateUtilityFields', () => {
    beforeEach(() => store.dispatch(new actions.UpdateUtilityFields()));

    it('should dispatch UpdateUtilityFields action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateUtilityFields());
    });
  });

  describe('LoadPrepSupplier', () => {
    beforeEach(() => store.dispatch(new actions.LoadPrepSupplier()));

    it('should dispatch LoadPrepSupplier action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.LoadPrepSupplier());
    });
  });

  describe('LoadPrepCustomerAccount', () => {
    beforeEach(() => store.dispatch(new actions.LoadPrepCustomerAccount('1')));

    it('should dispatch LoadPrepCustomerAccount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.LoadPrepCustomerAccount('1'));
    });
  });

  describe('LoadPrepProperty', () => {
    beforeEach(() => store.dispatch(new actions.LoadPrepProperty()));

    it('should dispatch LoadPrepProperty action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.LoadPrepProperty());
    });
  });

  describe('UpdateCustomerAccountResponse', () => {
    beforeEach(() => store.dispatch(new actions.UpdateCustomerAccountResponse(null)));

    it('should dispatch UpdateCustomerAccountResponse action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateCustomerAccountResponse(null)
      );
    });
  });

  describe('SetDueDate', () => {
    beforeEach(() => store.dispatch(new actions.SetDueDate()));

    it('should dispatch SetDueDate action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetDueDate());
    });
  });

  describe('SetPredictedSupplierValue', () => {
    beforeEach(() => store.dispatch(new actions.SetPredictedSupplierValue()));

    it('should dispatch SetPredictedSupplierValue action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetPredictedSupplierValue());
    });
  });
});
