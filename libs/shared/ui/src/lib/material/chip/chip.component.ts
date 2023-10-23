import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { Chip } from '../../shared/models/chip';
import type { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'ax-mat-chip',
  templateUrl: './chip.component.html',
})
export class ChipComponent implements AfterViewChecked {
  @Input() chipList: Chip[] = [];
  @Input() selectable = true;
  @Input() removable = true;
  @Input() disabled = false;
  @Input() disableRipple = false;
  @Input() multiple = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() compareWith: (o1: any, o2: any) => boolean;
  @Input() color: ThemePalette = 'primary';

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<MatChipListboxChange>();
  @Output() removed = new EventEmitter<Chip>();
  @Output() destroyed = new EventEmitter<Chip>();
  @Output() selectionChange = new EventEmitter<Chip>();

  constructor(private ref: ChangeDetectorRef) {}

  handleCloseClick(chip: Chip): void {
    if (this.chipList.length > 0) {
      const index = this.chipList.findIndex(x => x.id === chip.id);

      if (index > -1) {
        this.chipList.splice(index, 1);
      }
    }
    this.removed.emit(chip);
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  chipListchange(event: MatChipListboxChange): void {
    this.change.emit(event);
  }

  chipDestroyed(chip: Chip): void {
    this.destroyed.emit(chip);
  }

  chipSelected(event: MatChipSelectionChange): void {
    if (!this.multiple && event.selected) {
      this.chipList.forEach(value => {
        value.selected = false;
      }, this.chipList);
    }

    const index = this.chipList.findIndex(x => x.id === event.source.value);
    if (index > -1) {
      this.chipList[index].selected = event.selected;
    }
    this.selectionChange.emit(this.chipList[index]);
  }
}
