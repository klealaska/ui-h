import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Registration } from '../../../../models';
import * as coreActions from '../../../../core/actions/core.actions';

@Component({
  selector: 'avc-accounting-system',
  templateUrl: './accounting-system.component.html',
  styleUrls: ['./accounting-system.component.scss'],
})
export class AccountingSystemComponent {
  @Input() registration: Registration;

  constructor(private router: Router, private store: Store) {}

  loadPage(page: string): void {
    this.store.dispatch([
      new coreActions.SetConnectorId(this.registration.connectorId),
      new coreActions.SetRegistration(this.registration),
    ]);
    this.router.navigate([page]);
  }
}
