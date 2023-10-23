import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonHTMLTypes,
  ButtonSizes,
  ButtonTypes,
  ButtonColors,
  ButtonColor,
  ButtonHTMLType,
  ButtonSize,
  ButtonType,
} from '@ui-coe/shared/types';

@Component({
  selector: 'ax-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ButtonComponent implements AfterViewInit {
  @Input() fixed: boolean;
  @Input() disabled: boolean;
  @Input() btnType: ButtonHTMLType = ButtonHTMLTypes.button;
  @Input() size: ButtonSize = ButtonSizes.lg;
  @Input() type: ButtonType = ButtonTypes.primary;
  @Input() color: ButtonColor = ButtonColors.default;

  @ViewChild('ref', { read: ElementRef, static: true }) ref: ElementRef;

  ngAfterViewInit() {
    // Checks for mat-icon
    const leftIcon = !!this.ref?.nativeElement?.firstChild?.classList?.contains('mat-icon');
    const rightIcon = !!this.ref?.nativeElement?.lastChild?.classList?.contains('mat-icon');

    // Places strings of text from ngContent into array
    let contentText = this.ref?.nativeElement?.innerText?.split('\n');
    // Making sure there's no empty strings
    contentText = contentText?.filter(data => data != '');

    // Adds class depending if there's icon and text, only icon, or only text
    this.ref.nativeElement.classList.add(this.addButtonClass(contentText, leftIcon, rightIcon));
  }

  addButtonClass(contentText, leftIcon, rightIcon) {
    if (contentText?.length > 1) {
      if (leftIcon) return 'left-icon-button';
      else return 'right-icon-button';
    } else if (leftIcon || rightIcon) return 'icon-button';
    else return 'text-button';
  }
}
