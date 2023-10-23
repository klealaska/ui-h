import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export class CoreTableVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange: Observable<number>;

  dataLength = 0;
  private readonly indexChange = new Subject<number>();
  viewport!: CdkVirtualScrollViewport;
  public renderedRangeStream = new BehaviorSubject<ListRange>({ start: 0, end: 0 });

  bufferMultiplier = 0.7; // value to be calculate buffer rows in DOM
  constructor(private rowHeight: number, private headerOffset: number) {
    this.scrolledIndexChange = this.indexChange.pipe(distinctUntilChanged());
  }

  /**
   *
   * @param viewport
   * Attatch the Viewport
   */
  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.onDataLengthChanged();
  }

  onContentScrolled(): void {
    this.updateContent();
  }

  /**
   *
   * @param length
   * Function to be called when change in length of datasource and set content size for scroll
   */
  onDataLengthChanged(): void {
    if (this.viewport) {
      this.viewport.setTotalContentSize(this.dataLength * this.rowHeight);
      this.updateContent();
    }
  }

  /**
   *
   * @param length
   * Function to be called when change in length of datasource
   */
  setDataLength(length: number): void {
    this.dataLength = length;
    this.onDataLengthChanged();
  }

  setScrollHeight(rowHeight: number, headerOffset: number) {
    this.rowHeight = rowHeight;
    this.headerOffset = headerOffset;
    this.updateContent();
  }

  /**
   * Methods required because we have implemented `VirtualScrollStrategy` interface
   */
  detach(): void {}
  onContentRendered(): void {}
  onRenderedOffsetChanged(): void {}
  scrollToIndex(index: number, behavior: ScrollBehavior): void {}

  /**
   *
   * @returns {void}
   * Handles whenever any action like `sort`, `change in data source` is called
   */
  private updateContent(): void {
    if (!this.viewport) {
      return;
    }

    const renderedOffset = this.viewport.getOffsetToRenderedContentStart();
    // renderedOffset as 0 is valid value for calculation
    if (renderedOffset !== undefined && renderedOffset !== null) {
      const start = renderedOffset / this.rowHeight;
      const itemsDisplayed = Math.ceil(this.viewport.getViewportSize() / this.rowHeight);
      const bufferItems = Math.ceil(itemsDisplayed * this.bufferMultiplier);
      const end = start + itemsDisplayed + 2 * bufferItems;

      const bufferOffset = renderedOffset + bufferItems * this.rowHeight;
      const scrollOffset = this.viewport.measureScrollOffset();

      // How far the scroll offset is from the lower buffer, which is usually where items start being displayed
      const relativeScrollOffset = scrollOffset - bufferOffset;
      const rowsScrolled = relativeScrollOffset / this.rowHeight;

      const displayed = scrollOffset / this.rowHeight;
      this.indexChange.next(displayed);

      // Only bother updating the displayed information if we've scrolled more than a row
      const rowSensitivity = 1.0;
      if (Math.abs(rowsScrolled) < rowSensitivity) {
        this.viewport.setRenderedContentOffset(renderedOffset);
        this.viewport.setRenderedRange({ start, end });
        return;
      }

      // Special case for the start of the table.
      // At the top of the table, the first few rows are first rendered because they're visible, and then still rendered
      // Because they move into the buffer. So we only need to change what's rendered once the user scrolls far enough down.
      if (renderedOffset === 0 && rowsScrolled < 0) {
        this.viewport.setRenderedContentOffset(renderedOffset);
        this.viewport.setRenderedRange({ start, end });
        return;
      }

      const rowsToMove = Math.sign(rowsScrolled) * Math.floor(Math.abs(rowsScrolled));
      const adjustedRenderedOffset = Math.max(0, renderedOffset + rowsToMove * this.rowHeight);
      this.viewport.setRenderedContentOffset(adjustedRenderedOffset);

      const adjustedStart = Math.max(0, start + rowsToMove);
      const adjustedEnd = adjustedStart + itemsDisplayed + 2 * bufferItems;
      this.viewport.setRenderedRange({ start: adjustedStart, end: adjustedEnd });

      this.indexChange.next(adjustedRenderedOffset);
    }
  }
}
