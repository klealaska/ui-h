import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplexSettingValue, ComplexType, Property, PropertyError } from '../../../../models';
import { ConnectorSettingsState } from '../../../connector-settings.state';
import { ComplexPropertyModalComponent } from './complex-property-modal/complex-property-modal.component';

@Component({
  selector: 'avc-complex-property',
  templateUrl: './complex-property.component.html',
  styleUrls: ['./complex-property.component.scss'],
})
export class ComplexPropertyComponent implements OnInit, OnChanges {
  @Input() groupName: string;
  @Input() property: Property;
  @Input() value: any;
  @Input() error: PropertyError;
  @Input() isNew: boolean;
  @Input() complexValues?: string[];
  @Output() valueChanged = new EventEmitter<any>();
  @Output() complexModalClosed = new EventEmitter<boolean>();
  @Output() complexPropertyChanged = new EventEmitter<ComplexSettingValue>();
  @Output() validateComplexPropertyForm = new EventEmitter<any>();

  complexType$: Observable<ComplexType>;
  changes = {} as any;
  dialogRef: MatDialogRef<ComplexPropertyModalComponent>;

  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit(): void {
    this.complexType$ = this.store
      .select(ConnectorSettingsState.getComplexTypeProperty)
      .pipe(map(filterFn => filterFn(this.property.ComplexType)));

    if (this.isNew) {
      this.openComplexTypeModal(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.error?.currentValue && this.dialogRef?.componentInstance) {
      this.dialogRef.componentInstance.data.error = this.error;
    }
  }

  openComplexTypeModal(isNew = false): void {
    this.dialogRef = this.dialog.open(ComplexPropertyModalComponent, {
      data: {
        property: this.property,
        value: this.value,
        isNew,
        error: this.error,
        groupName: this.groupName,
        complexValues: this.complexValues,
      },
      maxHeight: '100vh',
    });

    this.dialogRef.componentInstance.valueChanged.subscribe(result => {
      this.changes[result.settings.name] = result.settings.value;
      this.complexPropertyChanged.emit({
        ...result,
        complexType: { name: this.property.ComplexType, propertyName: this.property.Name },
      });
    });

    this.dialogRef.afterClosed().subscribe((result: { isNew: boolean; saved: boolean }) => {
      if (result?.saved) {
        const value = { ...this.value, ...this.changes };
        this.valueChanged.emit(value);
      }

      this.complexModalClosed.emit(result?.saved);

      this.changes = {};
    });
  }
}
