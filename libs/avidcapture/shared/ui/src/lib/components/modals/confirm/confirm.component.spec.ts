import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { UppercaseWordPipe } from '@ui-coe/avidcapture/shared/util';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockPipe } from 'ng-mocks';

import { ConfirmComponent } from './confirm.component';

const dialogRefStub = {
  close: jest.fn(),
};

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmComponent, MockPipe(TranslatePipe), MockPipe(UppercaseWordPipe)],
      imports: [BrowserAnimationsModule, ButtonComponent, MatIconModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: {
              title: '',
              message: '',
              confirmButton: 'xdc.shared.confirm-label',
              cancelButton: 'xdc.shared.cancel-label',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set default config values', () => {
      expect(component.modalConfig.confirmButton).toEqual('xdc.shared.confirm-label');
      expect(component.modalConfig.cancelButton).toEqual('xdc.shared.cancel-label');
    });
  });

  describe('confirm()', () => {
    beforeEach(() => {
      component.confirm();
    });

    it('should close dialog and pass value along with it', () =>
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, true));
  });

  describe('cancel()', () => {
    beforeEach(() => {
      component.cancel();
    });

    it('should close dialog', () => expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, false));
  });
});
