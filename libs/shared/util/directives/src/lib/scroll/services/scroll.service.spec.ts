import { TestBed } from '@angular/core/testing';
import { ScrollSectionDirective } from '../scroll-section.directive';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;
  let directive: ScrollSectionDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
    directive = new ScrollSectionDirective(null, service);
    directive.id = 'test';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should test register', () => {
    service.register(directive);
    expect(service['sections']).toBeTruthy();
    expect(service['sections'].get('test')).toBeTruthy();
  });
  it('should test remove', () => {
    service.remove(directive);
    expect(service['sections']).toBeTruthy();
    expect(service['sections'].get('test')).toBeFalsy();
  });

  it('should test scroll', () => {
    jest.spyOn(directive, 'scroll').mockImplementation((): void => void 0);
    service.register(directive);
    service.scroll('test');
    expect(directive.scroll).toHaveBeenCalled();
  });
  it('should test activatedAnchor', done => {
    const navIdTest = 'section-1';
    service.currentNavItem$.subscribe(navId => {
      expect(navId).toBe(navIdTest);
      done();
    });
    service.activatedAnchor(navIdTest);
  });
});
