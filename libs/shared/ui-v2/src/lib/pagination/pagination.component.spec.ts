import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PaginationComponent],
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.currentPage = 1;
    component.totalPages = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate per page options', () => {
    component.generatePerPageOptions();
    const optionsValue = component.perPageOptions.map(option => option.value.toString());
    expect(optionsValue).toEqual(['10', '20', '30', '40', '50', 'all']);
  });

  it('should go to previous page', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not go to previous page if current page is first page', () => {
    component.currentPage = 1;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to next page', () => {
    component.totalItems = 5;
    component.pageSizeOptions = [1];
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should not go to next page if current page is last page', () => {
    component.totalItems = 1;
    component.currentPage = component.totalPages;
    component.nextPage();
    expect(component.currentPage).toBe(component.totalPages);
  });

  it('should go to selected page', () => {
    component.pageSizeOptions = [1];
    component.totalItems = 5;
    component.goToPage(5);
    expect(component.currentPage).toBe(5);
  });

  it('should not go to selected page if selected page is out of range', () => {
    component.pageSizeOptions = [1];
    component.totalItems = 5;
    component.goToPage(0);
    expect(component.currentPage).toBe(1);

    component.goToPage(11);
    expect(component.currentPage).toBe(1);
  });

  it('should set current page', () => {
    component.pageSizeOptions = [1];
    component.totalItems = 3;
    component.currentPage = 3;
    expect(component['_currentPage']).toBe(3);
  });

  it('should set calculate and set total items and generate page', () => {
    component.totalItems = 100;
    component.pageSizeOptions = [10];
    expect(component['_totalItems']).toBe(100);
    expect(component.pages.length).toBe(10);
    expect(component.totalPages).toBe(10);
  });
  it('should set page size dropdown', () => {
    component.pageSizeOptions = [10, 20, 30];
    expect(component['_pageSize']).toEqual([10, 20, 30]);
    expect(component.selectedPerPage.value).toBe(10);
    expect(component.perPageOptions.length).toBe(4);
  });

  it('should emit pageIndex Change event', () => {
    const spy = jest.spyOn(component.pageIndexChange, 'emit');
    component.pageSizeOptions = [1];
    component.totalItems = 5;
    component.goToPage(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should re-create pages and emit pageSizeChange event', () => {
    const spy = jest.spyOn(component.pageSizeChange, 'emit');
    component.pageSizeOptions = [1, 2, 3, 4, 5];
    component.totalItems = 20;
    component.goToSelectedPageDropdown({ value: 2 });
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith({ value: 2 });
    expect(component.pages.length).toBe(10);
    expect(component.totalPages).toBe(10);
  });

  it('should show size changer dropdown if flag is `true`', () => {
    component.showSizeChanger = true;
    component.showMobilePagination = false;
    component.mobile$ = of(false);
    fixture.detectChanges();
    component.mobile$.subscribe(() => {
      const dropdownWrapper = fixture.debugElement.query(By.css('.go-to-page-dropdown'));
      expect(dropdownWrapper).toBeTruthy();
    });
  });

  it('should hide size changer dropdown if flag is `false`', () => {
    component.showSizeChanger = false;
    fixture.detectChanges();
    const dropdownWrapper = fixture.debugElement.query(By.css('.go-to-page-dropdown'));
    expect(dropdownWrapper).toBeFalsy();
  });

  it('should show quick jumper input if flag is `true`', () => {
    component.showQuickJumper = false;
    fixture.detectChanges();
    const inputWrapper = fixture.debugElement.query(By.css('.go-to-page-input'));
    expect(inputWrapper).toBeFalsy();
  });

  it('should hide quick jumper input if flag is `false`', () => {
    component.showQuickJumper = false;
    fixture.detectChanges();
    const inputWrapper = fixture.debugElement.query(By.css('.go-to-page-input'));
    expect(inputWrapper).toBeFalsy();
  });

  it('should have disabled pagination', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonsList = fixture.debugElement.queryAll(By.css('button'));
    buttonsList.forEach(button =>
      expect(button.nativeElement.classList.contains('disabled')).toBe(true)
    );
  });

  it('should jump to selected page using input field ', () => {
    component.totalItems = 100;
    component.pageSizeOptions = [10];
    component.goToSelectedPageInput('5');
    expect(component['_currentPage']).toBe(5);
  });

  it('should not jump to selected page using input field if input page number is greater than total pages', () => {
    component.currentPage = 1;
    component.goToSelectedPageInput('50');
    component.totalItems = 100;
    component.pageSizeOptions = [10];
    expect(component['_currentPage']).toBe(1);
  });
});
