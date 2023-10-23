import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  OverrideEscalation,
  SetDuplicateDocumentId,
  SetEscalation,
} from '@ui-coe/avidcapture/indexing/data-access';
import {
  EscalationCategoryTypes,
  EscalationLevelTypes,
  escalationCategoryReasonTypes,
} from '@ui-coe/avidcapture/shared/types';
import { ButtonComponent, LinkComponent } from '@ui-coe/shared/ui-v2';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { DuplicateDetectionComponent } from './duplicate-detection.component';

const dialogRefStub = {
  close: jest.fn(),
};
const storeStub = {
  dispatch: jest.fn(),
};
const duplicateDocumentErrorStub = { documentId: '1', sourceDocumentId: '2' };

describe('DuplicateDetectionComponent', () => {
  let component: DuplicateDetectionComponent;
  let fixture: ComponentFixture<DuplicateDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicateDetectionComponent, MockPipe(TranslatePipe)],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ButtonComponent,
        LinkComponent,
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            duplicateDetectionError: duplicateDocumentErrorStub,
            canViewAllBuyers$: of(true),
            supplierName: 'mockSupplier',
            invoiceNumber: 'mockNumber',
          },
        },
        {
          provide: 'environment',
          useValue: {
            avidSuiteInvoiceUrl: 'http://localhost:3000',
          },
        },
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate canViewAllBuyers using passed in data', () =>
    expect(component.canViewAllBuyers$.subscribe()).toEqual(of(true).subscribe()));

  it('should instantiate duplicateDocumentId using passed in data', () =>
    expect(component.duplicateDetectionError).toEqual(duplicateDocumentErrorStub));

  it('should instantiate supplierName using passed in data', () =>
    expect(component.supplierName).toEqual('mockSupplier'));

  it('should instantiate invoiceNumber using passed in data', () =>
    expect(component.invoiceNumber).toEqual('mockNumber'));

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should dispatch SetDuplicateDocumentId action', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, new SetDuplicateDocumentId(null)));

    it('should close dialog and pass false', () =>
      expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
  });

  describe('markAsDuplicate()', () => {
    describe('when duplicate has been detected in AvidCapture but not in AvidSuite and is returned with a NULL value', () => {
      beforeEach(() => {
        component.duplicateDetectionError = {
          documentId: '1',
          sourceDocumentId: null,
          reason: '',
          invoiceNumber: '',
        };
        component.markAsDuplicate();
      });

      it('should set escalaiton reason for AvidCapture & dispatch SetEscalation & SetDuplicateDocumentId actions', () =>
        expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
          new SetEscalation({
            category: {
              issue: EscalationCategoryTypes.DuplicateResearch,
              reason: escalationCategoryReasonTypes.duplicateDetection.AvidCapture,
            },
            description: JSON.stringify({
              documentId: '1',
              sourceDocumentId: null,
              reason: '',
              invoiceNumber: '',
            }),
            escalationLevel: EscalationLevelTypes.InternalXdc,
            resolution: '',
          }),
          new SetDuplicateDocumentId(null),
        ]));

      it('should close dialog and pass true', () =>
        expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
    });

    describe('when duplicate has been detected in AvidCapture but not in AvidSuite and is returned with an empty string value', () => {
      beforeEach(() => {
        component.duplicateDetectionError = {
          documentId: '1',
          sourceDocumentId: '',
          reason: '',
          invoiceNumber: '',
        };
        component.markAsDuplicate();
      });

      it('should set escalaiton reason for AvidCapture & dispatch SetEscalation & SetDuplicateDocumentId actions', () =>
        expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
          new SetEscalation({
            category: {
              issue: EscalationCategoryTypes.DuplicateResearch,
              reason: escalationCategoryReasonTypes.duplicateDetection.AvidCapture,
            },
            description: JSON.stringify({
              documentId: '1',
              sourceDocumentId: '',
              reason: '',
              invoiceNumber: '',
            }),
            escalationLevel: EscalationLevelTypes.InternalXdc,
            resolution: '',
          }),
          new SetDuplicateDocumentId(null),
        ]));

      it('should close dialog and pass true', () =>
        expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
    });

    describe('when duplicate has been detected in AvidInvoice but not in AvidCapture and is returned with a NULL value', () => {
      beforeEach(() => {
        component.duplicateDetectionError = {
          documentId: null,
          sourceDocumentId: '1',
          reason: '',
          invoiceNumber: '',
        };
        component.markAsDuplicate();
      });

      it('should set escalation reason for AvidInvoice & dispatch SetEscalation & SetDuplicateDocumentId actions', () =>
        expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
          new SetEscalation({
            category: {
              issue: EscalationCategoryTypes.DuplicateResearch,
              reason: escalationCategoryReasonTypes.duplicateDetection.AvidInvoice,
            },
            description: JSON.stringify({
              documentId: null,
              sourceDocumentId: '1',
              reason: '',
              invoiceNumber: '',
            }),
            escalationLevel: EscalationLevelTypes.InternalXdc,
            resolution: '',
          }),
          new SetDuplicateDocumentId(null),
        ]));

      it('should close dialog and pass true', () =>
        expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
    });

    describe('when duplicate has been detected in AvidInvoice but not in AvidCapture and is returned with an empty string value', () => {
      beforeEach(() => {
        component.duplicateDetectionError = {
          documentId: '',
          sourceDocumentId: '1',
          reason: '',
          invoiceNumber: '',
        };
        component.markAsDuplicate();
      });

      it('should set escalation reason for AvidInvoice & dispatch SetEscalation & SetDuplicateDocumentId actions', () =>
        expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
          new SetEscalation({
            category: {
              issue: EscalationCategoryTypes.DuplicateResearch,
              reason: escalationCategoryReasonTypes.duplicateDetection.AvidInvoice,
            },
            description: JSON.stringify({
              documentId: '',
              sourceDocumentId: '1',
              reason: '',
              invoiceNumber: '',
            }),
            escalationLevel: EscalationLevelTypes.InternalXdc,
            resolution: '',
          }),
          new SetDuplicateDocumentId(null),
        ]));

      it('should close dialog and pass true', () =>
        expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
    });

    describe('when duplicate has been detected in AvidInvoice and in AvidCapture', () => {
      beforeEach(() => {
        component.duplicateDetectionError = {
          documentId: '1',
          sourceDocumentId: '1',
          reason: '',
          invoiceNumber: '',
        };
        component.markAsDuplicate();
      });

      it('should set escalation reason for AvidCaptureAndAvidInvoice & dispatch SetEscalation & SetDuplicateDocumentId actions', () =>
        expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
          new SetEscalation({
            category: {
              issue: EscalationCategoryTypes.DuplicateResearch,
              reason: escalationCategoryReasonTypes.duplicateDetection.AvidCaptureAndAvidInvoice,
            },
            description: JSON.stringify({
              documentId: '1',
              sourceDocumentId: '1',
              reason: '',
              invoiceNumber: '',
            }),
            escalationLevel: EscalationLevelTypes.InternalXdc,
            resolution: '',
          }),
          new SetDuplicateDocumentId(null),
        ]));

      it('should close dialog and pass true', () =>
        expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
    });
  });
});
