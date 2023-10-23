import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Options } from '@ui-coe/shared/types';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InputDirective } from '../input/input.directive';
import { InputHeaderComponent } from '../input/input-header/input-header.component';
import { InputErrorComponent } from '../input/input-error/input-error.component';
import { InputHintComponent } from '../input/input-hint/input-hint.component';

@Component({
  selector: 'ax-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [
    InputErrorComponent,
    InputHintComponent,
    InputHeaderComponent,
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class AutocompleteComponent extends InputDirective implements OnInit {
  @Input() maxLength: number;
  @Input() options: Options[];
  @Output() selectEvent = new EventEmitter();
  filterOptions: Observable<Options[]>;

  ngOnInit() {
    this.filterOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): Options[] {
    const filterValue = value.toLowerCase();
    return this.options?.filter(option => option?.text?.toLowerCase().includes(filterValue));
  }
}
