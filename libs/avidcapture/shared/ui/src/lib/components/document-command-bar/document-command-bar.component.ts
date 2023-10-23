import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CompositeDocument, MenuOptions } from '@ui-coe/avidcapture/shared/types';
import { MenuOption } from '@ui-coe/shared/ui';

@Component({
  selector: 'xdc-document-command-bar',
  templateUrl: './document-command-bar.component.html',
  styleUrls: ['./document-command-bar.component.scss'],
})
export class DocumentCommandBarComponent implements OnInit {
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Input() showLabels: boolean;
  @Input() compositeData: CompositeDocument;
  @Input() canDownloadPdf: boolean;
  @Input() isReadOnlyMode = false;
  @Input() maxUnindexedPages = 1;
  @Input() highlightToggle = false;
  @Input() isArchivePage = false;
  @Input() canViewGetNextDocument = false;

  @Output() showLabelsToggle = new EventEmitter<boolean>();
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() goToFirstPage = new EventEmitter<void>();
  @Output() goToPageEntered = new EventEmitter<string>();
  @Output() rotateLeft = new EventEmitter<void>();
  @Output() rotateRight = new EventEmitter<void>();
  @Output() reloadImage = new EventEmitter<void>();
  @Output() downloadFile = new EventEmitter<CompositeDocument>();
  @Output() getPreviousDocument = new EventEmitter<void>();
  @Output() getNextDocument = new EventEmitter<void>();
  @Output() updateFontFace = new EventEmitter<boolean>();
  @Output() disableHighlight = new EventEmitter<boolean>();

  @ViewChild('pageNumberInput') pageNumberInput: ElementRef;

  menuOptions: MenuOption[] = [];

  ngOnInit(): void {
    if (!this.isArchivePage) {
      this.menuOptions.push({
        text: MenuOptions.Highlight,
        selectable: true,
        value: this.highlightToggle,
      });
    }
    this.menuOptions.push({ text: MenuOptions.AdjustFont, selectable: true, value: false });
  }

  selectedMenuItemChanged(toggleValue: boolean, option: string): void {
    switch (option) {
      case MenuOptions.ShowHideLabels:
        this.showLabelsToggle.emit(toggleValue);
        break;
      case MenuOptions.AdjustFont:
        this.updateFontFace.emit(toggleValue);
        break;
      case MenuOptions.Highlight:
        this.disableHighlight.emit(toggleValue);
        break;
    }
  }

  numberCheck(event: KeyboardEvent): boolean {
    const isNumber = /^[0-9]*$/.test(event.key);

    if (!isNumber) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  focusOut(): void {
    this.pageNumberInput.nativeElement.value = this.currentPage;
  }
}
