import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// mat-error needs to be a direct child of mat-form-field
@Component({
  selector: 'ax-input-error',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
})
export class InputErrorComponent {
  @Input() invalid: boolean;
  @Input() message: string;
  @Input() icon: string;
}
