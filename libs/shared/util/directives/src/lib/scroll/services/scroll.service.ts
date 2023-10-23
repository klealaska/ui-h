import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScrollSectionDirective } from '../scroll-section.directive';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private sections = new Map<string | number, ScrollSectionDirective>();
  public currentNavItem$ = new Subject<string>();

  scroll(id: string | number) {
    this.sections.get(id)?.scroll();
  }

  register(section: ScrollSectionDirective) {
    this.sections.set(section.id, section);
  }

  remove(section: ScrollSectionDirective) {
    this.sections.delete(section.id);
  }

  activatedAnchor(section: string) {
    this.currentNavItem$.next(section);
  }
}
