import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import {
  createCustomerAccountStub,
  getFieldBaseStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { RejectToSenderPayload, RejectToSenderTemplate } from '@ui-coe/avidcapture/shared/types';
import * as testStubs from '@ui-coe/avidcapture/shared/test';
import * as actions from './indexing-utility.actions';

describe('Indexing Utility Actions', () => {
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

  describe('LockDocument', () => {
    beforeEach(() => store.dispatch(new actions.LockDocument('1')));

    it('should dispatch LockDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.LockDocument('1'));
    });
  });

  describe('CreateLabelColors', () => {
    beforeEach(() => store.dispatch(new actions.CreateLabelColors()));

    it('should dispatch CreateLabelColors action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.CreateLabelColors());
    });
  });

  describe('HandleEscalationSubmission', () => {
    beforeEach(() => store.dispatch(new actions.HandleEscalationSubmission(true)));

    it('should dispatch HandleEscalationSubmission action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.HandleEscalationSubmission(true)
      );
    });
  });

  describe('CreateCustomerAccountActivity', () => {
    beforeEach(() =>
      store.dispatch(new actions.CreateCustomerAccountActivity(createCustomerAccountStub))
    );

    it('should dispatch CreateCustomerAccountActivity action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.CreateCustomerAccountActivity(createCustomerAccountStub)
      );
    });
  });

  describe('CreateIndexedLabel', () => {
    beforeEach(() => store.dispatch(new actions.CreateIndexedLabel('mock', 'mock')));

    it('should dispatch CreateIndexedLabel action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.CreateIndexedLabel('mock', 'mock')
      );
    });
  });

  describe('ConfirmNewAccount', () => {
    beforeEach(() => store.dispatch(new actions.ConfirmNewAccount('mock')));

    it('should dispatch ConfirmNewAccount action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.ConfirmNewAccount('mock'));
    });
  });

  describe('UpdateSelectedDocumentText', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() => store.dispatch(new actions.UpdateSelectedDocumentText(indexedLabelStub)));

    it('should dispatch UpdateSelectedDocumentText action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateSelectedDocumentText(indexedLabelStub)
      );
    });
  });

  describe('SanitizeFieldValue', () => {
    const fieldBaseStub = getFieldBaseStub('mock');

    beforeEach(() => store.dispatch(new actions.SanitizeFieldValue(fieldBaseStub, true)));

    it('should dispatch SanitizeFieldValue action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.SanitizeFieldValue(fieldBaseStub, true)
      );
    });
  });

  describe('SetDuplicateDocumentId', () => {
    beforeEach(() => store.dispatch(new actions.SetDuplicateDocumentId(null)));

    it('should dispatch SetDuplicateDocumentId action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SetDuplicateDocumentId(null));
    });
  });

  describe('UpdateAdditionalLookupValue', () => {
    const indexedLabelStub = getIndexedLabelStub('mock');

    beforeEach(() =>
      store.dispatch(new actions.UpdateAdditionalLookupValue(indexedLabelStub, 'mock', 'mock'))
    );

    it('should dispatch UpdateAdditionalLookupValue action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateAdditionalLookupValue(indexedLabelStub, 'mock', 'mock')
      );
    });
  });

  describe('UpdateOldBoundingBoxCoordinates', () => {
    beforeEach(() => store.dispatch(new actions.UpdateOldBoundingBoxCoordinates([])));

    it('should dispatch UpdateOldBoundingBoxCoordinates action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateOldBoundingBoxCoordinates([])
      );
    });
  });

  describe('QueryRejectToSenderTemplates', () => {
    beforeEach(() => store.dispatch(new actions.QueryRejectToSenderTemplates(1)));

    it('should dispatch QueryRejectToSenderTemplates action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.QueryRejectToSenderTemplates(1)
      );
    });
  });

  describe('CheckForDuplicateDocument', () => {
    beforeEach(() => store.dispatch(new actions.CheckForDuplicateDocument()));

    it('should dispatch CheckForDuplicateDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.CheckForDuplicateDocument());
    });
  });

  describe('PostRejectToSender', () => {
    const payloadStub: RejectToSenderPayload = {
      toEmailAddress: 'mock@mock.com',
      templateId: 1,
      submitterEmailAddress: 'mock1@mock.com',
      fileId: 0,
      dateReceived: '2022-04-23T18:25:43.511Z',
    };

    beforeEach(() => store.dispatch(new actions.PostRejectToSender(payloadStub)));

    it('should dispatch PostRejectToSender action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.PostRejectToSender(payloadStub)
      );
    });
  });

  describe('CreateRejectToSenderTemplate', () => {
    const payloadStub: RejectToSenderTemplate = {
      sourceSystemBuyerId: '25',
      sourceSystemId: 'AvidSuite',
      templateName: 'Mock',
      templateSubjectLine: 'Shmock',
      notificationTemplate: '<html>nonsense</html>',
      isActive: true,
    };

    beforeEach(() => store.dispatch(new actions.CreateRejectToSenderTemplate(payloadStub)));

    it('should dispatch CreateRejectToSenderTemplate action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.CreateRejectToSenderTemplate(payloadStub)
      );
    });
  });

  describe('EditRejectToSenderTemplate', () => {
    const payloadStub: RejectToSenderTemplate = {
      sourceSystemBuyerId: '25',
      sourceSystemId: 'AvidSuite',
      templateName: 'Mock',
      templateSubjectLine: 'Shmock',
      notificationTemplate: '<html>nonsense</html>',
      isActive: true,
      templateId: '1',
    };

    beforeEach(() => store.dispatch(new actions.EditRejectToSenderTemplate(payloadStub)));

    it('should dispatch EditRejectToSenderTemplate action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.EditRejectToSenderTemplate(payloadStub)
      );
    });
  });

  describe('DeleteRejectToSenderTemplate', () => {
    beforeEach(() => store.dispatch(new actions.DeleteRejectToSenderTemplate('1')));

    it('should dispatch DeleteRejectToSenderTemplate action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.DeleteRejectToSenderTemplate('1')
      );
    });
  });

  describe('EnableSubmitButton', () => {
    beforeEach(() => store.dispatch(new actions.EnableSubmitButton(false)));

    it('should dispatch EnableSubmitButton action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.EnableSubmitButton(false));
    });
  });

  describe('SwapDocument', () => {
    beforeEach(() => store.dispatch(new actions.SwapDocument({} as any, '1')));

    it('should dispatch SwapDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.SwapDocument({} as any, '1'));
    });
  });

  describe('UpdateAllQueueCounts', () => {
    beforeEach(() => store.dispatch(new actions.UpdateAllQueueCounts()));

    it('should dispatch UpdateAllQueueCounts action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new actions.UpdateAllQueueCounts());
    });
  });
});
