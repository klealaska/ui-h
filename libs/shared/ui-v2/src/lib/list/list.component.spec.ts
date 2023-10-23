import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.disabled = false;
    component.items = ['item 1', 'item 2', 'item 3'];
    component.unordered = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an unordered list', () => {
    expect(component.unordered).toBeDefined();
    expect(component.unordered).toEqual(true);

    const unorderedList = fixture.debugElement.query(By.css('.unordered')).nativeElement.classList;
    expect(unorderedList).toContain('unordered');
  });

  it('should contain 3 items', () => {
    expect(component.items).toBeDefined();
    expect(component.items).toEqual(['item 1', 'item 2', 'item 3']);

    const items = fixture.debugElement.queryAll(By.css('#item'));
    expect(items.length).toEqual(3);
  });

  it('should disable the list', () => {
    component.disabled = true;
    fixture.detectChanges();

    expect(component.disabled).toBeDefined();
    expect(component.disabled).toEqual(true);

    const disabled = fixture.debugElement.query(By.css('.disabled')).nativeElement.classList;
    expect(disabled).toContain('disabled');
  });

  it('should emit the item on click', () => {
    jest.spyOn(component.itemEvent, 'emit');

    const button = fixture.debugElement.query(By.css('#item'));
    button.nativeElement.click();

    expect(component.itemEvent.emit).toHaveBeenCalled();
    expect(component.itemEvent.emit).toHaveBeenCalledWith('item 1');
  });
});
