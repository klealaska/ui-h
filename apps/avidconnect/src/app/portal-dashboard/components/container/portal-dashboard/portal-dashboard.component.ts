import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Platform } from '../../../../models';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AddRegistrationComponent } from '../../../../shared/components/modals/add-registration/add-registration.component';
import * as actions from '../../../../core/actions/catalogs.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { CatalogsState } from '../../../../core/state/catalogs.state';

@Component({
  selector: 'avc-portal-dashboard',
  templateUrl: './portal-dashboard.component.html',
  styleUrls: ['./portal-dashboard.component.scss'],
})
export class PortalDashboardComponent implements OnInit {
  @Select(CatalogsState.platforms) platforms$: Observable<Platform[]>;

  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new actions.QueryPlatforms());
    this.store.dispatch(new coreActions.SetNavigationChevron([]));
  }

  openEnrollCustomerModal(): void {
    this.dialog.open(AddRegistrationComponent);
  }
}
