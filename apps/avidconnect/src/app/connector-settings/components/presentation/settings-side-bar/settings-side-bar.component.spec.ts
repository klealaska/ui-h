import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSideBarComponent } from './settings-side-bar.component';

describe('SettingsSideBarComponent', () => {
  let component: SettingsSideBarComponent;
  let fixture: ComponentFixture<SettingsSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSideBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getErrorsCount()', () => {
    let count;
    describe('when error exists', () => {
      beforeEach(() => {
        component.errors = { propertyGroup: { property: 'error' } };
        count = component.getErrorsCount('propertyGroup');
      });

      it('should return 1 error found', () => {
        expect(count).toBe(1);
      });
    });

    describe('when error doesnt exists', () => {
      beforeEach(() => {
        component.errors = { error: { property: 'error' } };
        count = component.getErrorsCount('propertyGroup');
      });

      it('should return empty string', () => {
        expect(count).toBe('');
      });
    });
  });
});
