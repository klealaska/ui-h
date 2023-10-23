import { Component, Input } from '@angular/core';

@Component({
  selector: 'avc-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss'],
})
export class NoContentComponent {
  @Input() message: string;
  @Input() icon = 'error_outline';
}
