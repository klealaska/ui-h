import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ThemePalette } from '@angular/material/core';
import type { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'ax-mat-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
})
export class SlideToggleComponent {
  @Input('aria-label') ariaLabel: string | null;
  @Input('aria-labelledby') ariaLabelledby: string | null;
  @Input() checked = false;
  @Input() color: ThemePalette = 'primary';
  @Input() disableRipple = false;
  @Input() disabled = false;
  @Input() id: string;
  @Input() label: string = null;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() name: string | null;
  @Input() required = false;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<MatSlideToggleChange>();
  @Output() toggleChange = new EventEmitter<void>();
}
