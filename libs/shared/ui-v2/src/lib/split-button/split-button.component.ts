import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ButtonColor,
  ButtonColors,
  ButtonSize,
  ButtonSizes,
  ButtonType,
  ButtonTypes,
} from '@ui-coe/shared/types';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { MatMenuModule, MenuPositionY } from '@angular/material/menu';

@Component({
  selector: 'ax-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, ButtonComponent],
  animations: [
    trigger('openClose', [
      state('close', style({ transform: 'rotate(0)' })),
      state('open', style({ transform: 'rotate(180deg)' })),
      transition('close => open', animate('250ms ease-in')),
      transition('open => close', animate('250ms ease-out')),
    ]),
  ],
})
export class SplitButtonComponent implements AfterViewInit {
  @Input() dropdown: Array<string>;
  @Input() size: ButtonSize = ButtonSizes.lg;
  @Input() type: ButtonType = ButtonTypes.primary;
  @Input() color: ButtonColor = ButtonColors.default;
  @Input() yPosition: MenuPositionY = 'below';
  @Input() fixed: boolean;
  @Input() disabled: boolean;
  @Output() buttonEvent = new EventEmitter();
  opened = false;
  width: number;

  constructor(private el: ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // mat-button doesn't render fast enough for offsetWidth to pass the correct px size
    setTimeout(() => {
      this.width = this.el.nativeElement.offsetWidth - 2;
    }, 100);
    this.changeDetectorRef.detectChanges();
  }
}
