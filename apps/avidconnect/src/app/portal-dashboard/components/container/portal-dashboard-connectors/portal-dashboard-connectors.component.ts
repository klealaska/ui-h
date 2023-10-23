import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PortalDashboardState } from '../../../portal-dashboard.state';
import { Connector } from '../../../../models';
import * as actions from '../../../portal-dashboard.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'avc-portal-dashboard-connectors',
  templateUrl: './portal-dashboard-connectors.component.html',
  styleUrls: ['./portal-dashboard-connectors.component.scss'],
})
export class PortalDashboardConnectorsComponent implements OnInit {
  searchConnectorsText = '';
  @Select(PortalDashboardState.connectors) connectors$: Observable<Connector[]>;
  @Select(PortalDashboardState.isLoadingConnectors) isLoadingConnectors$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new actions.QueryConnectors());
  }

  connectorSelected(connectorId: number): void {
    this.store.dispatch(new coreActions.SetConnectorId(connectorId));
    this.router.navigate(['connector-detail']);
  }
}
