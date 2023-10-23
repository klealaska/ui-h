import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthService } from '@ui-coe/shared/util/auth';

import { Logout } from '../../../core/state/core.actions';

@Component({
  selector: 'bkws-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit(): void {
    this.authService.getAccessToken();
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }
}
