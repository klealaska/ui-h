import { Component, Input } from '@angular/core';

@Component({
  selector: 'avc-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  @Input() title;
}
