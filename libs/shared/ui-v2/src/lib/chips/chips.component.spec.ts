import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipsComponent } from './chips.component';
import { MatChipSelectionChange, MatChipEvent } from '@angular/material/chips';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.style).toBeUndefined();
    expect(component.size).toBeUndefined();
  });

  it('should not be removed initially', () => {
    expect(component.removed).toBeFalsy();
  });

  it('should toggle selected state when selectable', () => {
    component.selectable = true;
    component.selected = false;
    const matChip=fixture.elementRef.nativeElement.firstElementChild;

    const changeEvent: MatChipSelectionChange = {
      source: matChip,
      isUserInput: true,
      selected: true,
    };
  
    component.setSelected(changeEvent);
    expect(component.selected).toBeTruthy();
  });
  
  it('should not toggle selected state when not selectable', () => {
    component.selectable = false;
    component.selected = false;
    const matChip=fixture.elementRef.nativeElement.firstElementChild;

    const changeEvent: MatChipSelectionChange = {
      source: matChip,
      isUserInput: true,
      selected: true,
    };
  
    component.setSelected(changeEvent);
    expect(component.selected).toBeFalsy();
  });
  
  it('should remove the chip when not disabled', () => {
    component.disabled = false;
    const matChip=fixture.elementRef.nativeElement.firstElementChild;

    const chipEvent: MatChipEvent = {
      chip: matChip
    };
  
    component.removeChip(chipEvent);
    expect(component.removed).toBeTruthy();
  });
  
  it('should not remove the chip when disabled', () => {
    component.disabled = true;
    const matChip=fixture.elementRef.nativeElement.firstElementChild;

    const chipEvent: MatChipEvent = {
      chip: matChip
    };
  
    component.removeChip(chipEvent);
    expect(component.removed).toBeFalsy();
  });

  it('should add "chips-m-4-8" class when conditions are met', () => {
    // Set conditions to trigger the 'chips-m-4-8' class
    component.selectable = false;
    component.selected = false;
    component.avatarInput.img = 'some_avatar_url';
    fixture.detectChanges();
    const chipElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(chipElement.classList.contains('chips-m-4-8')).toBeTruthy();
  });

  it('should add "selected" class when conditions are met', () => {
    // Set conditions to trigger the 'selected' class
    component.selectable = true;
    component.selected = true;
    fixture.detectChanges();
    const chipElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(chipElement.classList.contains('selected')).toBeTruthy();
  });

  it('should add "unselected" class when conditions are met', () => {
    // Set conditions to trigger the 'unselected' class
    component.selectable = true;
    component.selected = false;
    fixture.detectChanges();
    const chipElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(chipElement.classList.contains('unselected')).toBeTruthy();
  });

  it('should add "cursor-pointer" class when conditions are met', () => {
    // Set conditions to trigger the 'cursor-pointer' class
    component.selectable = true;
    fixture.detectChanges();
    const chipElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(chipElement.classList.contains('cursor-pointer')).toBeTruthy();
  });

  it('should add "cursor-default" class when conditions are met', () => {
    // Set conditions to trigger the 'cursor-default' class
    component.selectable = false;
    fixture.detectChanges();
    const chipElement = fixture.debugElement.nativeElement.querySelector('div');
    expect(chipElement.classList.contains('cursor-default')).toBeTruthy();
  });
});
