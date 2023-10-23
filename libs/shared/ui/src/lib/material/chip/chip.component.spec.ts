import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatChipListboxChange,
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';

import { Chip } from '../../shared/models/chip';
import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;
  const sampleChipData: Chip = {
    id: '1',
    name: 'Chip',
    selected: false,
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipComponent],
      imports: [MatChipsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCloseClick()', () => {
    beforeEach(() => {
      component.chipList.push(sampleChipData);
      jest.spyOn(component.removed, 'emit').mockImplementation();
      component.handleCloseClick(sampleChipData);
    });

    it('should emit an empty object for handleCloseClick', () =>
      expect(component.removed.emit).toHaveBeenCalledWith(sampleChipData));
  });

  describe('chipDestroyed()', () => {
    beforeEach(() => {
      component.chipList.push(sampleChipData);
      jest.spyOn(component.destroyed, 'emit').mockImplementation();
      component.chipDestroyed(sampleChipData);
    });

    it('should emit an empty object for removed', () =>
      expect(component.destroyed.emit).toHaveBeenCalledWith(sampleChipData));
  });

  describe('chipListChange()', () => {
    beforeEach(() => {
      jest.spyOn(component.change, 'emit').mockImplementation();
      component.chipListchange({} as MatChipListboxChange);
    });

    it('should emit an empty object for chipListChange', () =>
      expect(component.change.emit).toHaveBeenCalledWith({} as MatChipListboxChange));
  });

  describe('chipSelectionChange()', () => {
    beforeEach(() => {
      jest.spyOn(component.selectionChange, 'emit').mockImplementation();
      component.chipSelected({} as MatChipSelectionChange);
    });

    it('should emit an empty object for chipSelectionChange', () =>
      expect(component.selectionChange.emit).toHaveBeenCalledWith(undefined));
  });
});
