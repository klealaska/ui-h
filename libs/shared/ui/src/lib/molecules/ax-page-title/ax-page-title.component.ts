import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'ax-page-title',
  templateUrl: './ax-page-title.component.html',
  styleUrls: ['./ax-page-title.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxPageTitleComponent implements OnInit {
  @Input() image: string;
  @Input() text: string;
  @Input() isBeta = false;
  @Input() lightThemeIsActive = false;
  @Input() canClickTitle = true;
  @Input() avidPartner: string;
  @Output() titleClick: EventEmitter<void> = new EventEmitter<void>();

  imageHeight: number;
  imageWidth: number;

  ngOnInit(): void {
    this.getImageDimensions();
  }

  onTitleClick(): void {
    if (this.canClickTitle) {
      this.titleClick.emit();
    } else {
      return;
    }
  }

  private getImageDimensions(): void {
    switch (this.avidPartner) {
      case 'avid':
        this.imageHeight = 58;
        this.imageWidth = 45;
        break;
      case 'bofa':
        this.imageHeight = 58;
        this.imageWidth = 350;
        break;
      case 'comdata':
        this.imageHeight = 55;
        this.imageWidth = 185;
        break;
      case 'fifththird':
        this.imageHeight = 58;
        this.imageWidth = 350;
        break;
      case 'keybank':
        this.imageHeight = 58;
        this.imageWidth = 350;
        break;
      default:
        this.imageHeight = 58;
        this.imageWidth = 58;
    }
  }
}
