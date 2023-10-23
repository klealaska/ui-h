import { async, TestBed } from '@angular/core/testing';
import { SharedUiModule } from '@ui-coe/shared/ui';
import { DemoMenuFeatureModule } from './demo-menu-feature.module';

describe('DemoMenuFeatureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DemoMenuFeatureModule, SharedUiModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(DemoMenuFeatureModule).toBeDefined();
  });
});
