import { Component } from '@angular/core';
import { SpinnerSize } from '@ui-coe/shared/types';

@Component({
  selector: 'bus-hier-loader',
  templateUrl: './bus-hier-loader.component.html',
  styleUrls: ['./bus-hier-loader.component.scss'],
})
export class BusHierLoaderComponent {
  size: SpinnerSize = 'lg';
}
