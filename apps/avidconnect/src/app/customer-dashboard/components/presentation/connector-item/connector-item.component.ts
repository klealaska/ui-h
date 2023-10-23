import { Component, Input } from '@angular/core';
import { ConnectorItem } from '../../../../models';

@Component({
  selector: 'avc-connector-item',
  templateUrl: './connector-item.component.html',
  styleUrls: ['./connector-item.component.scss'],
})
export class ConnectorItemComponent {
  @Input() connector: ConnectorItem;

  getConnectorInfo(): string {
    return `Version ${this.connector.version}, ${this.connector.connectorTypeName} (${this.connector.name})`;
  }
}
