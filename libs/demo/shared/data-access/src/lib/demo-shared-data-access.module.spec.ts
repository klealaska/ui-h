import { async, TestBed } from '@angular/core/testing';
import { DemoSharedDataAccessModule } from './demo-shared-data-access.module';

describe('DemoSharedDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DemoSharedDataAccessModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(DemoSharedDataAccessModule).toBeDefined();
  });
});
