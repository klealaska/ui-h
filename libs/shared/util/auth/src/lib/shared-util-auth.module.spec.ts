import { async, TestBed } from '@angular/core/testing';
import { SharedUtilAuthModule } from './shared-util-auth.module';

describe('SharedUtilAuthModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilAuthModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(SharedUtilAuthModule).toBeDefined();
  });
});
