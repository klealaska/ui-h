import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IMenuItem } from '@ui-coe/tenant/shared/types';

@Component({
  selector: 'ui-coe-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {
  @Input() menuItems: IMenuItem[];

  constructor() {}

  ngOnInit(): void {}
}
