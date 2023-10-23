import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DropdownOptions } from '@ui-coe/shared/types';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ButtonComponent,
    ReactiveFormsModule,
    MatIconModule,
    InputComponent,
    DropdownComponent,
  ],
  selector: 'ax-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
})
export class PaginationComponent implements OnInit {
  private _pageSize: number[] = [10, 20, 30, 40, 50];
  private _totalItems = 0;
  private _currentPage = 1;
  @Input() set currentPage(page: number) {
    this._currentPage = page || 1;
    this.updateVisiblePages();
  }
  get currentPage(): number {
    return this._currentPage;
  }
  @Input() showQuickJumper = true;
  @Input() showSizeChanger = true;
  @Input() disabled = false;

  pages: number[];
  visiblePages: (number | string)[];
  selectedPage = new FormControl<number | null>(null);
  selectedPerPage = new FormControl<string | number | null>(null);
  totalPages: number;
  perPageOptions: DropdownOptions[];
  mobile$: Observable<boolean>;
  showMobilePagination = false;

  @Input() set totalItems(value: number) {
    this._totalItems = value;
    this.generatePageCount();
  }

  @Input() set pageSizeOptions(size: number[]) {
    this._pageSize = size;
    this.selectedPerPage.setValue(this._pageSize[0]);
    this.generatePerPageOptions();
  }

  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.selectedPerPage.setValue(this._pageSize[0]);
  }

  ngOnInit() {
    this.generatePerPageOptions();
    this.mobile$ = this.breakpointObserver.observe(['(min-width: 600px)']).pipe(
      map((state: BreakpointState) => {
        this.showMobilePagination = true;
        return !state.matches;
      })
    );
  }

  /**
   * Generate the Page count based on total items and set Total number of pages
   */
  generatePageCount() {
    this.selectedPage.setValue(this.currentPage);
    this.setTotalPages();
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }

  /**
   *
   * @param recordToDisplay
   * Calculate the total records to display based on Per page option
   */
  setRecordToDisplay(recordToDisplay: number | string) {
    this.selectedPerPage.setValue(recordToDisplay === 'all' ? this._totalItems : recordToDisplay);
    this.setTotalPages();
  }

  /**
   * Sets the total Pages to be generated on UI
   */
  setTotalPages() {
    this.totalPages = Math.ceil(this._totalItems / +this.selectedPerPage.value);
  }

  /**
   * Generate values for Dropdown.
   */
  generatePerPageOptions() {
    this.perPageOptions = [];

    this._pageSize.forEach((size: number) => {
      const option: DropdownOptions = {
        text: `${size} per page`,
        value: size.toString(),
      };
      this.perPageOptions.push(option);
    });

    const allOption: DropdownOptions = {
      text: 'All',
      value: 'all',
    };
    this.perPageOptions.push(allOption);
    this.generatePageCount();
  }

  /**
   * Step back to previous Page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisiblePages();
    }
  }

  /**
   * Step back to Next Page
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisiblePages();
    }
  }

  /**
   *
   * @param page
   * Jump to particular page
   */
  goToPage(page: any) {
    if (typeof page === 'object') {
      const increment = page.direction === 'left' ? -5 : 5;
      const nextPage = Math.min(Math.max(1, this.currentPage + increment), this.totalPages);
      if (nextPage !== this.currentPage) {
        this.currentPage = nextPage;
        this.updateVisiblePages();
      }
    } else if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisiblePages();
    }

    this.pageIndexChange.emit(this.currentPage);
  }

  /**
   * Jump to particular page through Input
   */
  goToSelectedPageInput(event: string) {
    const selectedPage = parseInt(event);
    if (selectedPage) {
      if (selectedPage >= 1 && selectedPage <= this.totalPages) {
        this.currentPage = +selectedPage;
        this.updateVisiblePages();
      }
    }
  }

  /**
   *
   * @param selectedValue
   * Calculate the total number of pages based on the selectedPerPage value
   */
  goToSelectedPageDropdown(selectedValue: any) {
    this.currentPage = 1;
    this.setRecordToDisplay(selectedValue.value);

    this.generatePageCount();
    this.pageSizeChange.emit(selectedValue);
  }

  extractText(pageDetail: any) {
    if (typeof pageDetail === 'object') {
      return pageDetail.item;
    }
    return pageDetail;
  }

  /**
   * Display Number of visible records
   */
  updateVisiblePages() {
    const visiblePageCount = 5; // Number of visible page buttons (excluding ellipsis)

    if (this.totalPages <= visiblePageCount) {
      this.visiblePages = this.pages;
    } else {
      const halfVisibleCount = Math.floor(visiblePageCount / 2);
      let firstVisible: number;
      let lastVisible: number;

      if (this.currentPage <= halfVisibleCount) {
        // When current page is near the beginning
        firstVisible = 1;
        lastVisible = visiblePageCount;
      } else if (this.currentPage > this.totalPages - halfVisibleCount) {
        // When current page is near the end
        firstVisible = this.totalPages - visiblePageCount + 1;
        lastVisible = this.totalPages;
      } else {
        // When current page is in the middle
        firstVisible = this.currentPage - halfVisibleCount;
        lastVisible = this.currentPage + halfVisibleCount;
      }

      const visiblePages: (number | any)[] = [];

      if (firstVisible > 1) {
        visiblePages.push(1);
        if (firstVisible > 2) {
          visiblePages.push({ direction: 'left', item: '...' });
        }
      }

      for (let i = firstVisible; i <= lastVisible; i++) {
        visiblePages.push(i);
      }

      if (lastVisible < this.totalPages - 1) {
        visiblePages.push({ direction: 'right', item: '...' });
      }

      if (lastVisible < this.totalPages) {
        visiblePages.push(this.totalPages);
      }

      this.visiblePages = visiblePages;
    }
  }
}
