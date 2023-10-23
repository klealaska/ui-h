import { Component } from '@angular/core';

@Component({
  selector: 'ax-add-form-skeleton',
  standalone: true,
  template: `
    <div>
      <div class="flex flex-col mr-2">
        <div class="w-1/3 skeleton skeleton-base-text"></div>
        <div class="w-1/2 mt-2 skeleton skeleton-input"></div>
      </div>
      <div class="flex flex-row mt-2">
        <div class="flex-col w-1/2 mr-2">
          <div class="w-1/2 skeleton skeleton-base-text"></div>
          <div class="mt-2 skeleton skeleton-input"></div>
        </div>
        <div class="flex-col w-1/2 ml-2">
          <div class="w-1/2 skeleton skeleton-base-text"></div>
          <div class="mt-2 skeleton skeleton-input"></div>
        </div>
      </div>
      <div class="flex-col w-2/3 mt-2">
        <div class="w-1/4 skeleton skeleton-base-text"></div>
        <div class="mt-2 skeleton skeleton-input"></div>
      </div>
      <div class="flex flex-row mt-2">
        <div class="w-12 skeleton skeleton-input mr-2"></div>
        <div class="w-12 skeleton skeleton-input"></div>
      </div>
    </div>
  `,
})
export class AddFormSkeletonComponent {}
