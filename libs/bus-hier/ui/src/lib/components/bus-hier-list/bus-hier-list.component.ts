import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { HierarchyType, IEditBusinessLevelName, IEntity } from '@ui-coe/bus-hier/shared/types';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonColors, FormFieldError } from '@ui-coe/shared/types';

@Component({
  selector: 'bus-hier-list',
  templateUrl: './bus-hier-list.component.html',
  styleUrls: ['./bus-hier-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierListComponent implements OnInit, OnChanges {
  businessNameForm: FormGroup;
  showBusinessLevelNameSideSheet: boolean;

  @Input() entityListTitle: string;
  @Input() entityListNameSingular: string;
  @Input() entityListSubTitle: string;
  @Input() entities: IEntity[];
  @Input() businessLevelID: string;
  @Input() errors: string[];

  @Output() saveBusinessLevelNameEdit = new EventEmitter<IEditBusinessLevelName>();
  @Output() selectEntity = new EventEmitter<{
    id: string;
    type: string;
    level: number;
    entityTypeName: string;
  }>();

  entitiesType = HierarchyType.ENTITIES;
  public readonly buttonColors = ButtonColors;

  ngOnInit(): void {
    this.businessNameForm = new FormGroup({
      singular: new FormControl(this.entityListNameSingular, [
        Validators.required,
        Validators.maxLength(256),
      ]),
      plural: new FormControl(this.entityListTitle, [
        Validators.required,
        Validators.maxLength(256),
      ]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entityListTitle && !changes.entityListTitle.firstChange) {
      this.businessNameForm.patchValue({
        plural: this.entityListTitle,
      });
    }
    if (changes.entityListNameSingular && !changes.entityListNameSingular.firstChange) {
      this.businessNameForm.patchValue({
        singular: this.entityListNameSingular,
      });
    }
  }

  openSideSheet() {
    this.showBusinessLevelNameSideSheet = true;
  }

  onCancelButtonClick() {
    this.businessNameForm.reset({
      singular: this.entityListNameSingular,
      plural: this.entityListTitle,
    });
    this.showBusinessLevelNameSideSheet = false;
  }

  onSaveButtonClick() {
    const event: IEditBusinessLevelName = {
      businessLevelId: this.businessLevelID,
      body: {
        businessLevelNameSingular: this.businessNameForm.value.singular,
        businessLevelNamePlural: this.businessNameForm.value.plural,
      },
    };
    this.saveBusinessLevelNameEdit.emit(event);
    this.showBusinessLevelNameSideSheet = false;
    this.businessNameForm.reset({
      singular: this.entityListNameSingular,
      plural: this.entityListTitle,
    });
  }

  buildErrorMessage(fieldName: string) {
    if (this.businessNameForm.controls[fieldName].errors) {
      if (this.businessNameForm.controls[fieldName].errors.required) {
        return {
          message: this.errors[0].replace('{{ fieldName }}', fieldName),
          icon: 'warning',
        };
      }
    }
  }
}
