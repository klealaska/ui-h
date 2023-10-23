import { ScrollAnchorDirective } from './scroll-anchor.directive';
import { ScrollService } from './services';

describe('ScrollAnchorDirective', () => {
  it('should create an instance', () => {
    const scrolleService: ScrollService = new ScrollService();
    const directive = new ScrollAnchorDirective(scrolleService);
    expect(directive).toBeTruthy();
  });
  it('should scroll to anchor', () => {
    const scrollService: ScrollService = new ScrollService();
    const directive = new ScrollAnchorDirective(scrollService);
    directive.id = 'anchor-id';
    jest.spyOn(directive['scrollService'], 'scroll').mockImplementation((): void => void 0);
    directive.navigate();
    expect(directive['scrollService'].scroll).toHaveBeenCalled();
  });
});
