import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ViewportScroller } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AppPages,
  CompositeDocument,
  ErrorMessages,
  FieldBase,
  HotKeyCode,
  IndexedLabel,
  LabelColor,
  PdfJsRequest,
} from '@ui-coe/avidcapture/shared/types';
import * as PDFJS from 'pdfjs-dist';

PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

@Component({
  selector: 'xdc-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pdfFile: PdfJsRequest;
  @Input() fields: FieldBase<string>[];
  @Input() compositeData: CompositeDocument;
  @Input() labelColors: LabelColor[];
  @Input() boundingBoxToHighlight = '';
  @Input() isArchive = false;
  @Input() isReadOnlyMode = false;
  @Input() maxUnindexedPages = 1;
  @Input() isSponsorUser = false;
  @Input() swappedDocument: PdfJsRequest;
  @Input() updateFontFace = false;
  @Input() disableHighlight = false;
  @Input() multipleDisplayThresholdsIsActive = false;
  @Output() highlightField = new EventEmitter<string>();
  @Output() openHotKeysModal = new EventEmitter<void>();
  @Output() refreshToken = new EventEmitter<string>();
  @Output() selectedItemsChanged = new EventEmitter<IndexedLabel>();
  @Output() passwordRequired = new EventEmitter<void>();

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;

  loadedPdf: PDFJS.PDFDocumentProxy;
  loadingTasks: PDFJS.PDFDocumentLoadingTask[] = [];
  amountOfPages: number[] = [];
  amountOfUnindexedPages: number[] = [];
  amountOfReadOnlyPages: number[] = [];
  isLoading = false;
  showLabels = false; // Set to prefered starting value for Show Labels
  currentPage = 1;
  totalPages = 1;
  rotateLeft = 1;
  rotateRight = 1;
  zoomOut = 1;
  zoomIn = 1;

  private pageWasEntered = false;

  constructor(private scroller: ViewportScroller) {}

  ngOnInit(): void {
    this.scroller.setOffset([0, 125]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.pdfFile?.currentValue && changes.pdfFile.previousValue == undefined) ||
      changes.pdfFile?.currentValue?.password
    ) {
      this.loadDocument(changes.pdfFile.currentValue);
    }

    if (changes.swappedDocument?.currentValue) {
      this.resetComponentState();
      this.loadDocument(changes.swappedDocument.currentValue);
    }

    if (changes.updateFontFace?.currentValue || changes.updateFontFace?.previousValue) {
      this.resetComponentState();
      this.loadDocument({ ...this.pdfFile, disableFontFace: changes.updateFontFace?.currentValue });
    }
  }

  ngOnDestroy(): void {
    this.loadingTasks.forEach(lt => {
      lt.destroy();
    });
    this.resetComponentState();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.altKey) {
      switch (event.code) {
        case HotKeyCode.R:
          this.rotatePageRight();
          break;
        case HotKeyCode.T:
          this.toggleLabels();
          break;
        case HotKeyCode.Slash:
          this.openHotKeysModal.emit();
      }
    }
  }

  zoomPageOut(): void {
    this.zoomOut = this.zoomOut + 1;
  }

  zoomPageIn(): void {
    this.zoomIn = this.zoomIn + 1;
  }

  rotatePageLeft(): void {
    this.rotateLeft = this.rotateLeft + 1;
  }

  rotatePageRight(): void {
    this.rotateRight = this.rotateRight + 1;
  }

  goToFirstPage(): void {
    this.pageWasEntered = true;
    this.currentPage = 1;

    if (this.totalPages > this.maxUnindexedPages) {
      this.viewPort.scrollToIndex(0, 'smooth');
    } else {
      this.scroller.scrollToAnchor('olDiv-1');
    }
  }

  goToPageEntered(page: string): void {
    this.pageWasEntered = true;
    this.currentPage = Number(page);

    if (this.totalPages > this.maxUnindexedPages) {
      this.viewPort.scrollToIndex(this.currentPage - 1, 'smooth');
    } else {
      this.scroller.scrollToAnchor(`olDiv-${page}`);
    }
  }

  toggleLabels(): void {
    this.showLabels = !this.showLabels;
  }

  getCurrentPage(page: number): void {
    if (this.pageWasEntered) {
      this.pageWasEntered = this.currentPage !== page ? true : false;
      return;
    }

    this.currentPage = page;
  }

  private loadDocument(document: PdfJsRequest): void {
    const loadingTask = PDFJS.getDocument(document);
    this.loadedPdf = null;
    this.isLoading = true;
    this.loadingTasks.push(loadingTask);

    loadingTask.promise
      .then(pdf => {
        this.loadedPdf = pdf;
        this.totalPages = pdf.numPages;
        this.amountOfPages = [...Array(pdf.numPages).keys()];

        this.amountOfPages.forEach((page, index) => {
          const pageCount = index + 1;

          if (pageCount <= this.maxUnindexedPages) {
            this.amountOfUnindexedPages.push(page);
          } else {
            this.amountOfReadOnlyPages.push(page);
          }
        });

        this.isLoading = false;
      })
      .catch(err => {
        if (err.name === ErrorMessages.PasswordException) {
          this.passwordRequired.emit();
        }

        if (err.status === 401) {
          this.refreshToken.emit(AppPages.Indexing.File);
        }
        this.isLoading = false;
        setTimeout(() => {
          throw err;
        });
      });
  }

  private resetComponentState(): void {
    this.amountOfPages = [];
    this.amountOfUnindexedPages = [];
    this.amountOfReadOnlyPages = [];
    this.isLoading = false;
    this.showLabels = false;
    this.currentPage = 1;
    this.totalPages = 1;
    this.rotateLeft = 1;
    this.rotateRight = 1;
    this.zoomOut = 1;
    this.zoomIn = 1;
    this.loadingTasks = [];
  }
}
