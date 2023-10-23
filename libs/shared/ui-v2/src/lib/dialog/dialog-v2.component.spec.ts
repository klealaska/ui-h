import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogV2Component } from './dialog-v2.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataV2 } from '@ui-coe/shared/types';

describe('DialogV2Component', () => {
  let component: DialogV2Component;
  let fixture: ComponentFixture<DialogV2Component>;

  const mockData: DialogDataV2 = {
    draggable: false,
    type: 'default',
    closeIcon: true,
    title: 'Title',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    overline: {
      hasAlertIcon: false,
      text: 'Overline',
    },
    actionBtn: {
      type: 'primary',
      color: 'default',
      text: 'Action',
    },
    cancelBtn: {
      type: 'secondary',
      color: 'default',
      text: 'Cancel',
    },
  };

  const mockDialogRef = {
    addPanelClass: jest.fn(),
    open: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, DragDropModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Data', () => {
    it('should check if data is being pass correctly', () => {
      expect(component.data).toEqual(mockData);
      expect(component.local_data).toEqual(component.data);
    });
  });

  describe('Classes', () => {
    it('should check if ax-dialog class was added', () => {
      const spy = jest.spyOn(component.dialogRef, 'addPanelClass');
      expect(spy).toHaveBeenCalledWith('ax-dialog');
    });
    it('should check nonModalDialog class', () => {
      const spy = jest.spyOn(component.dialogRef, 'addPanelClass');
      expect(spy).toHaveBeenCalledWith('modal-dialog');
    });

    beforeEach(() => {
      mockData.draggable = true;
      fixture.detectChanges();
    });
    it('should check modalDialog class', () => {
      const spy = jest.spyOn(component.dialogRef, 'addPanelClass');
      expect(spy).toHaveBeenCalledWith('non-modal-dialog');
    });
  });

  describe('closeDialog', () => {
    it('should check if closeDialog emits close button text and data', () => {
      const spy = jest.spyOn(component.dialogRef, 'close');
      const data = { event: component.data.cancelBtn.text, data: component.data };

      component.closeDialog(component.data.cancelBtn.text);

      expect(spy).toBeCalledWith(data);
    });
  });
});
