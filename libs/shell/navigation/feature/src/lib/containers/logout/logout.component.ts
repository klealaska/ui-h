import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-coe-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  constructor(private router: Router) {}

  signIn() {
    this.router.navigate(['dashboard']);
  }
  logoutRedirect() {
    window.location.href = 'https://login.qa.avidsuite.com/applications/';
  }
}
