import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'ax-mat-icon',
  templateUrl: './icon.component.html',
})
export class IconComponent implements OnInit {
  @Input() svgData: string;
  @Input() id = `ax-mat-icon-${new Date().getTime()}`;
  @Input() icon: string;
  @Input() height: string;
  @Input() width: string;

  // badge specific inputs
  @Input() matBadge: number | string;
  @Input() matBadgeOverlap: boolean;
  @Input() matBadgeSize = 'medium';
  @Input() matBadgePosition = 'after';
  @Input() matBadgeColor: string;
  @Input() matBadgeHidden: boolean;

  svg: SafeHtml;

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.svg = this.sanitizer.bypassSecurityTrustHtml(this.svgData);
    this.iconRegistry.addSvgIconLiteral('ax-mat-icon-svg', this.svg);
  }
}
