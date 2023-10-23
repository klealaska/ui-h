import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Logout } from '@ui-coe/avidcapture/core/data-access';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

@Component({
  selector: 'xdc-error-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule, TranslateModule],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class AvidcaptureErrorPageComponent {
  constructor(private store: Store) {}

  redirecHome(): void {
    this.store.dispatch(new Logout());
  }
}
