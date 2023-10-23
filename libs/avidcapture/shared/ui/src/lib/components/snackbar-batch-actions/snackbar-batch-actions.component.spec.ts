import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { getDocuments } from '@ui-coe/avidcapture/shared/test';
import { BatchActions } from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { ConfirmComponent } from '../modals/confirm/confirm.component';
import { SnackbarBatchActionsComponent } from './snackbar-batch-actions.component';

const snackBarRefStub = {
  dismiss: jest.fn(),
  dismissWithAction: jest.fn(),
} as any;
const itemsSelectedSignalStub = signal([]);
const dialogStub = {
  open: jest.fn(),
};
describe('SnackbarBatchActionsComponent', () => {
  let component: SnackbarBatchActionsComponent;
  let fixture: ComponentFixture<SnackbarBatchActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarBatchActionsComponent],
      imports: [MatIconModule],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: snackBarRefStub,
        },
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            itemsSelected: itemsSelectedSignalStub,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarBatchActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should dismiss the snackBar', () =>
      expect(snackBarRefStub.dismissWithAction).toHaveBeenCalledTimes(1));
  });

  describe('deleteSelected()', () => {
    describe('after modal has been close and value returned is true', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.deleteSelected();
      });

      it('should set action to Delete', () => expect(component.action).toBe(BatchActions.Delete));

      it('should dismiss the snackBar with Delete action', () =>
        expect(snackBarRefStub.dismissWithAction).toHaveBeenCalledTimes(1));
    });

    describe('after modal has been close and value returned is false', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(false) });
        component.deleteSelected();
      });

      it('should dismiss the snackBar', () =>
        expect(snackBarRefStub.dismiss).not.toHaveBeenCalled());
    });

    describe('when selection is only 1', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.data.itemsSelected = signal(getDocuments());
        component.deleteSelected();
      });

      it('should use singlar text for confirm modal', () =>
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, ConfirmComponent, {
          data: {
            title: 'Delete this item?',
            message: 'It will be kept in your recycle bin for 30 days.',
            confirmButton: 'xdc.shared.confirm-modal-delete-button-text',
          },
        }));
    });

    describe('when selection has more than 1', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.data.itemsSelected = signal([getDocuments()[0], getDocuments()[0]]);
        component.deleteSelected();
      });

      it('should use singlar text for confirm modal', () =>
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, ConfirmComponent, {
          data: {
            title: 'Delete these items?',
            message: 'They will be kept in your recycle bin for 30 days.',
            confirmButton: 'xdc.shared.confirm-modal-delete-button-text',
          },
        }));
    });
  });

  describe('downloadSelected()', () => {
    describe('after modal has been close and value returned is true', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.downloadSelected();
      });

      it('should set action to Download', () =>
        expect(component.action).toBe(BatchActions.Download));

      it('should dismiss the snackBar with Delete action', () =>
        expect(snackBarRefStub.dismissWithAction).toHaveBeenCalledTimes(1));
    });

    describe('after modal has been close and value returned is false', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(false) });
        component.downloadSelected();
      });

      it('should dismiss the snackBar', () =>
        expect(snackBarRefStub.dismiss).not.toHaveBeenCalled());
    });

    describe('when selection is only 1', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.data.itemsSelected = signal(getDocuments());
        component.downloadSelected();
      });

      it('should use singlar text for confirm modal', () =>
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, ConfirmComponent, {
          data: {
            title: 'Download this item?',
            message: 'It will be downloaded to your computer.',
            confirmButton: 'xdc.shared.confirm-modal-download-button-text',
          },
        }));
    });

    describe('when selection has more than 1', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.data.itemsSelected = signal([getDocuments()[0], getDocuments()[0]]);
        component.downloadSelected();
      });

      it('should use singlar text for confirm modal', () =>
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, ConfirmComponent, {
          data: {
            title: 'Download these items?',
            message: 'They will be downloaded to your computer.',
            confirmButton: 'xdc.shared.confirm-modal-download-button-text',
          },
        }));
    });
  });
});
