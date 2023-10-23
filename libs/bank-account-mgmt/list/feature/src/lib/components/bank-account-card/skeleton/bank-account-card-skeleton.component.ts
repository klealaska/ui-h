import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'ax-bank-account-card-skeleton',
  standalone: true,
  template: ` <mat-card>
    <mat-card-content>
      <div class="flex justify-between">
        <div class="w-1/2 skeleton skeleton-card-text"></div>
        <div class="w-1/4 skeleton skeleton-card-text"></div>
      </div>
      <div class="w-1/3 mt-2 skeleton skeleton-card-text"></div>
      <div class="w-1/2 mt-5 skeleton skeleton-card-text"></div>
    </mat-card-content>
  </mat-card>`,
  imports: [MatCardModule],
})
export class BankAccountCardSkeletonComponent {}
