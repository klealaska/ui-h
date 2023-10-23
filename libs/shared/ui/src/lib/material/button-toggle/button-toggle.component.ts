import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import type { MatButtonToggleAppearance } from '@angular/material/button-toggle';

import { MatButtonToggleOptions } from '../../shared/models/button-toggle';

@Component({
  selector: 'ax-mat-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
})
export class ButtonToggleComponent {
  // MatButtonToggleGroup
  @Input() groupAppearance: MatButtonToggleAppearance = 'standard';
  @Input() groupDisabled = false;
  @Input() multiple = false;
  @Input() groupName: string;
  @Input() groupValue: any;
  @Input() vertical = false;
  @Output() groupChange = new EventEmitter<MatButtonToggleChange>();

  // MattButtonToggle
  @Input() options: MatButtonToggleOptions[];

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<MatButtonToggleChange>();
}
