import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { IScrollSection } from '../models';
import { IKeepTrack } from '../models/keep-track.interface';
import { ScrollService } from './services/scroll.service';

@Directive({
  selector: '[uiCoeKeepTrack]',
})
export class KeepTrackDirective implements AfterViewInit {
  @Input() sections: IScrollSection[];
  @Input() offsetTop = 0; // add any padding or margin here from your scrollable area in pixels

  constructor(private scrollService: ScrollService, private host: ElementRef) {
    host.nativeElement.addEventListener('scroll', () => {
      this.keepTrack(host.nativeElement.scrollTop);
    });
  }
  private meta: IKeepTrack[] = [];

  ngAfterViewInit(): void {
    let sum = 0;
    this.sections?.forEach((element: IScrollSection, i: number) => {
      const el = this.host.nativeElement.querySelector(`#${element.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        sum += rect.top + rect.height;
        if (i === 0) {
          this.meta.push({
            begin: 0 + this.offsetTop,
            end: rect.height,
            id: element.id,
          });
        } else {
          this.meta.push({
            begin: this.meta[i - 1].end + 1,
            end: sum,
            id: element.id,
          });
        }
      }
    });
  }

  private keepTrack(yOffset: number): void {
    this.sections.forEach((element: IScrollSection) => {
      const section = this.meta.find(x => x.id === element.id);
      if (yOffset > section.begin && yOffset < section.end) {
        this.scrollService.activatedAnchor(section.id);
      }
    });
  }
}
