import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hotkey, HotKeyDescription, HotKeyKey } from '@ui-coe/avidcapture/shared/types';
import { take, tap } from 'rxjs/operators';

import { HotkeysDialogComponent } from '../components/hotkeys-dialog/hotkeys-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class HotkeysService {
  canOpenHotKeysModal = true;

  constructor(private dialog: MatDialog) {}

  openHelpModal(): void {
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

    if (this.canOpenHotKeysModal) {
      this.canOpenHotKeysModal = false;
      this.dialog
        .open(HotkeysDialogComponent, {
          data: {
            hotkeys: hotKeysData,
          },
        })
        .afterClosed()
        .pipe(
          take(1),
          tap(() => (this.canOpenHotKeysModal = true))
        )
        .subscribe();
    }
  }
}
