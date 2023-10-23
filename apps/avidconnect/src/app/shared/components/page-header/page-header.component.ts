import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/state/core.state';
import { ChevronItem } from '../../../models';

@Component({
  selector: 'avc-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title: string;
  @Input() showBackBtn: boolean;
  @Input() backUrl: string;
  @Input() navigation: ChevronItem[];

  @Select(CoreState.navigation) navigation$: Observable<ChevronItem[]>;

  constructor(private router: Router) {}

  goBack(): void {
    this.backUrl ? this.router.navigate([this.backUrl]) : window.history.back();
  }

  navigateTo(url: string): void {
    if (url) {
      this.router.navigate([url]);
    }
  }
}
