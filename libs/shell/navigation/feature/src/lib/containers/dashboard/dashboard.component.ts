import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-coe-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private router: Router, private contentFacade: ContentFacade) {}
  content$: Observable<any> = this.contentFacade.navData$;

  route(path: string) {
    this.router.navigate([path]);
  }
}
