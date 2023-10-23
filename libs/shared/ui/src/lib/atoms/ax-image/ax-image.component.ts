import { Component, Input } from '@angular/core';

@Component({
  selector: 'ax-image',
  templateUrl: './ax-image.component.html',
  styleUrls: ['./ax-image.component.scss'],
})
export class AxImageComponent {
  @Input() image: string;
  @Input() height: number;
  @Input() width: number;
}
