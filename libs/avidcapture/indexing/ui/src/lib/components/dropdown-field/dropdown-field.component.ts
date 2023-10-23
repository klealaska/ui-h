import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfidenceColorAssociationService } from '@ui-coe/avidcapture/core/util';
import { ConfidenceThreshold, FieldBase } from '@ui-coe/avidcapture/shared/types';
import { DropdownOptions } from '@ui-coe/shared/types';

@Component({
  selector: 'xdc-dropdown-field',
  templateUrl: './dropdown-field.component.html',
  styleUrls: ['./dropdown-field.component.scss'],
})
export class DropdownFieldComponent implements OnChanges {
  @Input() fieldTitle: string;
  @Input() choices: DropdownOptions[] = [];
  @Input() selectedValue: string;
  @Input() confidence = 0;
  @Input() confidenceThreshold: ConfidenceThreshold;
  @Input() headerFieldColor = 'default';
  @Input() editMode = false;
  @Input() headerBackgroundColor = 'none';
  @Input() placeholder: string;
  @Input() width = 100;
  @Input() fieldModel: FieldBase<string>;
  @Input() hasFocus: boolean;
  @Output() dropdownChanged: EventEmitter<string> = new EventEmitter();

  confidenceColor = 'default';
  formCtrl = new FormControl<string | null>(null);

  constructor(private confidenceColorService: ConfidenceColorAssociationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedValue?.currentValue) {
      this.formCtrl.setValue(changes.selectedValue.currentValue);
    }

    if (changes.confidenceThreshold?.currentValue) {
      this.confidenceColor = this.confidenceColorService.getConfidenceColor(
        this.confidence,
        changes.confidenceThreshold.currentValue
      );
    }
  }

  onSelectedItem(event: string): void {
    this.dropdownChanged.emit(event);
    this.confidence = 100;
    this.confidenceColor = this.confidenceColorService.getConfidenceColor(
      this.confidence,
      this.confidenceThreshold
    );
  }
}
