import { async, TestBed } from '@angular/core/testing';
import { DemoGameFeatureModule } from './demo-game-feature.module';

describe('DemoGameFeatureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DemoGameFeatureModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(DemoGameFeatureModule).toBeDefined();
  });
});
