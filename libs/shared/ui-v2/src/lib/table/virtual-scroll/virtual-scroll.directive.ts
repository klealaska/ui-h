import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { AfterViewInit, Directive, forwardRef, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreTableVirtualScrollStrategy } from './virtual-scroll.strategy';
import { TableDataSource } from '../table-datasource';
import { HEADER_HEIGHT, ROW_HEIGHT } from '../table-constants';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'cdk-virtual-scroll-viewport[coreTableVirtualScroll]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: (scroll: CoreTableFixedVirtualScrollDirective) => scroll.scrollStrategy,
      deps: [forwardRef(() => CoreTableFixedVirtualScrollDirective)],
    },
  ],
  standalone: true,
})
export class CoreTableFixedVirtualScrollDirective implements AfterViewInit, OnDestroy {
  private _isScrollInitialized = false;
  private rowHeight = ROW_HEIGHT;
  private offset = HEADER_HEIGHT;
  @Input('coreTableVirtualScroll') tableDataSource: TableDataSource<any>;
  scrollStrategy: CoreTableVirtualScrollStrategy;

  private sub!: Subscription;

  constructor() {
    this.scrollStrategy = new CoreTableVirtualScrollStrategy(this.rowHeight, this.offset);
  }

  ngAfterViewInit() {
    this.initializeScroll();
  }

  initializeScroll() {
    if (!this._isScrollInitialized && this.tableDataSource) {
      if (this.tableDataSource instanceof TableDataSource) {
        this.sub = this.tableDataSource.dataToRender$.subscribe(data => {
          this.scrollStrategy.setDataLength(data.length);
          this.scrollStrategy.setScrollHeight(this.rowHeight, this.offset);
        });
        this._isScrollInitialized = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
