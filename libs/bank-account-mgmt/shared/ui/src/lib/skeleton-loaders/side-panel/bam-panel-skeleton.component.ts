import { Component } from '@angular/core';

@Component({
  selector: 'ui-coe-bam-panel-skeleton',
  standalone: true,
  template: `<div class="flex flex-col">
    <div class="side-panel-skeleton__container">
      <div class="skeleton skeleton-base-text mb-2 w-1/3"></div>
      <div class="skeleton skeleton-base-text w-1/2"></div>
    </div>
    <div class="side-panel-skeleton__container mt-4">
      <div class="skeleton skeleton-base-text mb-2 w-1/3"></div>
      <div class="skeleton skeleton-base-text w-1/2"></div>
    </div>
    <div class="side-panel-skeleton__container mt-4">
      <div class="skeleton skeleton-base-text mb-2 w-1/3"></div>
      <div class="skeleton skeleton-base-text w-1/2"></div>
    </div>
    <div class="side-panel-skeleton__container mt-4">
      <div class="skeleton skeleton-base-text mb-2 w-1/3"></div>
      <div class="skeleton skeleton-base-text w-1/2"></div>
    </div>
    <div class="side-panel-skeleton__container mt-4">
      <div class="skeleton skeleton-base-text mb-2 w-1/3"></div>
      <div class="skeleton skeleton-base-text w-1/2"></div>
    </div>
  </div>`,
  imports: [],
  styleUrls: ['../skeleton-loader-base.scss'],
})
export class BamPanelSkeletonComponent {}
