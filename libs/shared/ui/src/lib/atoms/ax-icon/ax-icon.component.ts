import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ax-icon',
  templateUrl: './ax-icon.component.html',
  styleUrls: ['./ax-icon.component.scss'],
})
export class AxIconComponent implements OnInit, OnChanges {
  @Input() svgData: string;
  @Input() id: string;
  svg: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.id = this.id ?? `ax-icon-${new Date().getTime()}`;
    this.svg = this.sanitizer.bypassSecurityTrustHtml(this.svgData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.svgData.currentValue) {
      this.svg = this.sanitizer.bypassSecurityTrustHtml(changes.svgData.currentValue);
    }
  }
}
