import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonSize,
  ButtonSizes,
  ButtonType,
  ButtonTypes,
  ButtonColor,
  ButtonColors,
} from '@ui-coe/shared/types';

@Component({
  selector: 'ax-anchor',
  templateUrl: './anchor.component.html',
  styleUrls: ['../button/button.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AnchorComponent implements AfterViewInit {
  @Input() fixed: boolean;
  @Input() href: string;
  @Input() size: ButtonSize = ButtonSizes.lg;
  @Input() type: ButtonType = ButtonTypes.primary;
  @Input() color: ButtonColor = ButtonColors.default;

  @Output() btnClick = new EventEmitter();

  @ViewChild('ref', { read: ElementRef, static: true }) ref: ElementRef;

  ngAfterViewInit() {
    // Checks for mat-icon
    const leftIcon = !!this.ref?.nativeElement?.firstChild?.classList?.contains('mat-icon');
    const rightIcon = !!this.ref?.nativeElement?.lastChild?.classList?.contains('mat-icon');

    // Places strings of text from ngContent into array
    const contentText = this.ref?.nativeElement?.innerText?.split('\n');

    // Adds class depending if there's icon and text, only icon, or only text
    this.ref?.nativeElement?.classList?.add(this.addButtonClass(contentText, leftIcon, rightIcon));
  }

  addButtonClass(contentText, leftIcon, rightIcon) {
    if (contentText?.length > 1) {
      if (leftIcon) return 'left-icon-button';
      else return 'right-icon-button';
    } else if (leftIcon || rightIcon) return 'icon-button';
    else return 'text-button';
  }

  onClickButton(event) {
    this.btnClick.emit(event);
  }
}
