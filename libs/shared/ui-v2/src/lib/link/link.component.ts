import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { ComponentSizes, LinkSize } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LinkComponent implements OnDestroy {
  @Input() disabled: boolean;
  @Input() size: LinkSize = ComponentSizes.sm;
  visited: boolean;

  visitedLink() {
    this.visited = true;
  }

  ngOnDestroy(): void {
    this.visited = false;
  }
}
