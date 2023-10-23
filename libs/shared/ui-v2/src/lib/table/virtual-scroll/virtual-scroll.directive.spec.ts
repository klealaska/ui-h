import { TestBed } from '@angular/core/testing';
import { getTestData } from '../table-mock';
import { CoreTableFixedVirtualScrollDirective } from './virtual-scroll.directive';
import { TableComponent } from '../table.component';
import { TableDataSource } from '../table-datasource';
import { CoreTableVirtualScrollStrategy } from './virtual-scroll.strategy';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

describe('CoreTableFixedVirtualScrollDirective', () => {
  let directive: CoreTableFixedVirtualScrollDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      declarations: [CoreTableFixedVirtualScrollDirective],
    }).compileComponents();
    directive = new CoreTableFixedVirtualScrollDirective();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
  it('should have `rowHeight`', () => {
    expect(directive['rowHeight']).toBeDefined();
    expect(directive['rowHeight']).toBe(58);
  });
  it('should have `offset`', () => {
    expect(directive['offset']).toBeDefined();
    expect(directive['offset']).toBe(58);
  });
  it('should initialize scroll ', () => {
    directive.tableDataSource = new TableDataSource(getTestData());
    directive.initializeScroll();
    expect(directive['_isScrollInitialized']).toBe(true);
  });

  it('should call `setDataLength` and `setScrollHeight`', () => {
    jest.spyOn(directive.scrollStrategy, 'setDataLength');
    jest.spyOn(directive.scrollStrategy, 'setScrollHeight');
    directive.tableDataSource = new TableDataSource(getTestData());

    directive.tableDataSource.dataToRender$.subscribe(() => {
      expect(directive.scrollStrategy.setDataLength).toHaveBeenCalled();
      expect(directive.scrollStrategy.setScrollHeight).toHaveBeenCalled();
    });
  });

  it('should instantiate `scrollStrategy`', () => {
    expect(directive.scrollStrategy instanceof CoreTableVirtualScrollStrategy);
  });
  it('should unsubscribe on ngOnDestroy()', () => {
    directive.tableDataSource = new TableDataSource(getTestData());
    directive.initializeScroll();
    directive.ngOnDestroy();
    expect(directive['sub'].closed).toBe(true);
  });
});

describe('CoreTableVirtualScrollStrategy', () => {
  let strategy: CoreTableVirtualScrollStrategy;

  const viewport: CdkVirtualScrollViewport = {
    getViewportSize: jest.fn().mockReturnValue(100),
    getOffsetToRenderedContentStart: jest.fn().mockReturnValue(0),
    measureScrollOffset: jest.fn().mockReturnValue(58),
    setRenderedContentOffset: jest.fn(),
    setRenderedRange: jest.fn(),
    setTotalContentSize: jest.fn(),
  } as unknown as CdkVirtualScrollViewport;

  beforeEach(async () => {
    strategy = new CoreTableVirtualScrollStrategy(58, 58);
    strategy.viewport = viewport;
  });

  it('should create', () => {
    expect(strategy).toBeTruthy();
  });
  it('should have scrolledIndexChange', () => {
    expect(strategy.scrolledIndexChange).toBeDefined();
  });
  it('should have `bufferMultiplier`', () => {
    expect(strategy.bufferMultiplier).toBe(0.7);
  });
  it('should have initial data length `dataLength`', () => {
    expect(strategy.dataLength).toBe(0);
  });
  it('should set `dataLength`', () => {
    jest.spyOn(strategy, 'onDataLengthChanged');
    strategy.setDataLength(100);
    expect(strategy.dataLength).toBe(100);
    expect(strategy.onDataLengthChanged).toHaveBeenCalled();
  });
  it('should set `scrollHeight`', () => {
    strategy.setScrollHeight(58, 58);
    expect(strategy['rowHeight']).toBe(58);
    expect(strategy['headerOffset']).toBe(58);
  });

  it('should set offset height and set render range', () => {
    strategy.setScrollHeight(58, 58);
    expect(strategy.viewport.setRenderedContentOffset).toHaveBeenCalledWith(0);
    expect(strategy.viewport.setRenderedRange).toHaveBeenCalledWith({ start: 0, end: 6 });
  });
  it('should set offset height and set render range', () => {
    strategy.setScrollHeight(58, 58);
    jest.spyOn(strategy.viewport, 'getViewportSize').mockReturnValue(100);
    jest.spyOn(strategy.viewport, 'getOffsetToRenderedContentStart').mockReturnValue(100);
    jest.spyOn(strategy.viewport, 'measureScrollOffset').mockReturnValue(100);
    strategy.onContentScrolled();
    expect(strategy.viewport.setRenderedRange).toHaveBeenCalledWith({ start: 0, end: 6 });
  });
});
