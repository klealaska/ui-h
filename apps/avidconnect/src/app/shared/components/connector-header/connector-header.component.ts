import { Component, Input } from '@angular/core';
import { Connector } from '../../../models';

@Component({
  selector: 'avc-connector-header',
  templateUrl: './connector-header.component.html',
  styleUrls: ['./connector-header.component.scss'],
})
export class ConnectorHeaderComponent {
  @Input() connector: Connector;
  @Input() accountingSystem?: string;
  @Input() platform: string;
}
