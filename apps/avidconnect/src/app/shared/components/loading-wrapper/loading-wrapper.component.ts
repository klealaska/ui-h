import { Component, Input } from '@angular/core';

@Component({
  selector: 'avc-loading-wrapper',
  templateUrl: './loading-wrapper.component.html',
  styleUrls: ['./loading-wrapper.component.scss'],
})
export class LoadingWrapperComponent {
  @Input() isLoading: boolean;
  @Input() loadingMessage: string;
}
