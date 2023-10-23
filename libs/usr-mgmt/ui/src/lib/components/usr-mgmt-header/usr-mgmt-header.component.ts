import { Component, Input } from '@angular/core';

@Component({
  selector: 'usr-mgmt-header',
  templateUrl: './usr-mgmt-header.component.html',
  styleUrls: ['./usr-mgmt-header.component.scss'],
})
export class UsrMgmtHeaderComponent {
  @Input() title: string;
}
