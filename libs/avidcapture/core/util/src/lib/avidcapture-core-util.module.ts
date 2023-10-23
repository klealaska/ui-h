import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class AvidcaptureCoreUtilModule {}
