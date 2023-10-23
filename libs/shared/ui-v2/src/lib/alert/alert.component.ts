import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlertTypes, AlertStatus } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() action: TemplateRef<void> | null = null;
  @Input() title: string | TemplateRef<void> | null = null;
  @Input() message: string | TemplateRef<void> | null = null;
  @Input() type: AlertTypes = AlertStatus.INFO;
  @Input() closable = false;
  @Input() showIcon = false;
  @Output() readonly onhide = new EventEmitter<boolean>();
  closed = false;

  closeAlert(): void {
    this.closed = true;
    this.onhide.emit(true);
  }
}
