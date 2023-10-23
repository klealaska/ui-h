import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

import { IProductEntitlementAssigned } from '@ui-coe/tenant/shared/types';

@Component({
  selector: 'ui-coe-entitlements',
  templateUrl: './entitlements.component.html',
  styleUrls: ['./entitlements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitlementsComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() productEntitlements: IProductEntitlementAssigned[];
  @Output() productEntitlementChecked = new EventEmitter<string>();
  constructor() {}
}
