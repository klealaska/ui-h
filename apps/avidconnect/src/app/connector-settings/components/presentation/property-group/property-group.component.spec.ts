import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsoleLogger } from '@nestjs/common';
import { MockComponent } from 'ng-mocks';
import {
  groupSettingsStub,
  propertyGroupStub,
  settingsValueStub,
} from '../../../../../test/test-stubs';
import { PropertyItemComponent } from '../property-item/property-item.component';

import { PropertyGroupComponent } from './property-group.component';

describe('PropertyGroupComponent', () => {
  let component: PropertyGroupComponent;
  let fixture: ComponentFixture<PropertyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyGroupComponent, MockComponent(PropertyItemComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGroupComponent);
    component = fixture.componentInstance;
    component.propertyGroup = propertyGroupStub;
    component.settings = groupSettingsStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getPropertyValue', () => {
    it('should get property value from settings array', () => {
      const value = component.getPropertyValue('test');
      expect(value).toEqual(settingsValueStub.value);
    });

    it('should return undefined when settings is null', () => {
      component.settings = null;
      const value = component.getPropertyValue('test');
      expect(value).toBe(undefined);
    });
  });
});
