import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { PointerPosition, TooltipPosition, TooltipStyle } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('tooltip', [
      transition(':enter', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
      transition(':leave', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TooltipComponent {
  @Input() tooltipText: string;
  @Input() tooltipStyle: TooltipStyle;
  @Input() tooltipImage: string;
  @Input() tooltipPosition: TooltipPosition;
  @Input() pointerPosition: PointerPosition;
  @Input() dynamicOverflow: boolean;
}
