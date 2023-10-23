import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuListItemComponent } from './menu-list-item.component';
import { By } from '@angular/platform-browser';

describe('MenuListItemComponent', () => {
  let component: MenuListItemComponent;
  let fixture: ComponentFixture<MenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuListItemComponent);
    component = fixture.componentInstance;
    component.item = {
      displayName: 'Tenant',
      iconName: 'cloud',
      route: 'tenant-spa',
      children: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add menu item', () => {
    expect(component.item).toBeDefined();
    expect(component.item).toEqual({
      displayName: 'Tenant',
      iconName: 'cloud',
      route: 'tenant-spa',
      children: [],
    });

    const items = fixture.debugElement.queryAll(By.css('.menu-list-item'));
    expect(items.length).toEqual(1);
  });

  it('should call applyFilter and emit data with undefined', async () => {
    const item = {
      displayName: 'Tenant',
      iconName: 'cloud',
      route: 'tenant-spa',
      children: [],
    };
    const spy = jest.spyOn(component.router, 'navigate');

    component.onItemSelected(item);
    fixture.detectChanges();

    expect(spy).toBeCalledWith([item.route]);
  });
});
