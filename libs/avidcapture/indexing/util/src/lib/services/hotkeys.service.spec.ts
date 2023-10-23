import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Hotkey, HotKeyDescription, HotKeyKey } from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { HotkeysDialogComponent } from '../components/hotkeys-dialog/hotkeys-dialog.component';
import { HotkeysService } from './hotkeys.service';

const dialogStub = {
  open: jest.fn(),
};

describe('HotkeysService', () => {
  let service: HotkeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
      ],
    });
    service = TestBed.inject(HotkeysService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openModal()', () => {
    describe('when allowOpenModal is false', () => {
      beforeEach(() => {
        service.canOpenHotKeysModal = false;
        service.openHelpModal();
      });

      it('should not call open a dialog window', () => {
        expect(dialogStub.open).not.toHaveBeenCalled();
      });
    });

    describe('when allowOpenModal is true', () => {
      const hotKeysData: Hotkey[] = [
        {
          description: HotKeyDescription.PreviousPage,
          keyList: [HotKeyKey.Alt, HotKeyKey.P],
        },
        {
          description: HotKeyDescription.NextPage,
          keyList: [HotKeyKey.Alt, HotKeyKey.N],
        },
        {
          description: HotKeyDescription.RotateRight,
          keyList: [HotKeyKey.Alt, HotKeyKey.R],
        },
        {
          description: HotKeyDescription.ToggleLabels,
          keyList: [HotKeyKey.Alt, HotKeyKey.T],
        },
        {
          description: HotKeyDescription.HelpGuide,
          keyList: [HotKeyKey.Alt, HotKeyKey.Slash],
        },
      ];

      beforeEach(() => {
        service.canOpenHotKeysModal = true;
        dialogStub.open.mockReturnValue({
          afterClosed: () => of(null),
        });
      });

      it('should open up the hot keys modal', () => {
        service.openHelpModal();
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, HotkeysDialogComponent, {
          data: {
            hotkeys: hotKeysData,
          },
        });
      });
    });
  });
});
