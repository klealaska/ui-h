import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ui-coe-bam-list-skeleton',
  template: ` <div class="list-skeleton__header">
      <div class="list-skeleton__label-container"><p>Account Number</p></div>
      <div class="list-skeleton__label-container"><p>Routing Number</p></div>
      <div class="list-skeleton__label-container"><p>Banking Institution</p></div>
      <div class="list-skeleton__label-container status"><p>Status</p></div>
    </div>
    <div class="list-skeleton__body-container">
      <div *ngFor="let _ of [].constructor(7)" class="list-skeleton__table-row">
        <div class="list-skeleton__row-item skeleton"></div>
      </div>
    </div>`,
  standalone: true,
  styleUrls: ['../skeleton-loader-base.scss', '../skeleton-loader-list.scss'],
  imports: [CommonModule],
})
export class BamlistSkeletonComponent {}
