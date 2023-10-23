import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// mat-hint needs to be a direct child of mat-form-field
@Component({
  selector: 'ax-input-hint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-hint.component.html',
  styleUrls: ['./input-hint.component.scss'],
})
export class InputHintComponent {
  @Input() message: string;
}
