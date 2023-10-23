import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'usr-mgmt-page-title',
  templateUrl: './usr-mgmt-page-title.component.html',
  styleUrls: ['./usr-mgmt-page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsrMgmtPageTitleComponent {
  @Input() title: string;
}
