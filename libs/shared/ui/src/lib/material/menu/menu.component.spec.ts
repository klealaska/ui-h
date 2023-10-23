import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuOption } from '../../shared/models/ax-menu';

import { MenuComponent } from './menu.component';

const menuOptionStub: MenuOption = {
  text: 'Test Option',
  selectable: true,
  value: true,
};

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [MatIconModule, MatMenuModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when id is provided by the input', () => {
      beforeEach(() => {
        component.id = '1';
        fixture.detectChanges();
      });

      it('should set id to the input given', () => expect(component.id).toBe('1'));
    });

    describe('when id is not provided by the input', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should set id to ax-mat-menu-', () => expect(component.id).toContain(`ax-mat-menu-`));
    });

    describe('logout option', () => {
      it('should not be added by default', () => {
        expect(component.menuOptions.length).toBe(0);
      });

      it('should be added when option is set to true', () => {
        component.addLogoutOption = true;
        fixture.detectChanges();
        expect(component.options.length).toBe(1);
      });
    });
  });

  describe('ngOnChanges()', () => {
    it('should change  menu options when menuOptions array change', () => {
      component.menuOptions = [{ text: 'Option 1' }, { text: 'Option 2' }];
      fixture.detectChanges();

      expect(component.options.length).toBe(2);
    });
  });

  describe('menuOptionSelected()', () => {
    const event = {
      stopPropagation: (): any => ({}),
    } as any;
    describe('when default logout option is selected,', () => {
      beforeEach(() => {
        jest.spyOn(component.logout, 'emit').mockImplementation();
      });
      it('should emit logout EventEmitter', () => {
        component.menuOptionSelected(event, component.defaultLogoutDropdownOption);
        expect(component.logout.emit).toHaveBeenCalled();
      });
    });

    describe('when a menu option is selected', () => {
      beforeEach(() => {
        jest.spyOn(component.selectedMenuItem, 'emit').mockImplementation();
      });
      it('should emit selectedMenuItem EventEmitter', () => {
        menuOptionStub.selectable = false;
        component.menuOptionSelected(event, menuOptionStub);
        expect(component.selectedMenuItem.emit).toHaveBeenCalledWith(menuOptionStub.text);
      });
    });

    describe('when a menu option selectable is clicked', () => {
      beforeEach(() => {
        jest.spyOn(component.selectedMenuItemChanged, 'emit').mockImplementation();
      });

      it('should toggle option value and emit selectedMenuItem EventEmitter', () => {
        const oldValue = menuOptionStub.value;
        component.toggleChange(menuOptionStub);

        expect(menuOptionStub.value).toBe(!oldValue);
        expect(component.selectedMenuItemChanged.emit).toHaveBeenCalled();
      });
    });
  });

  describe('toggleClicked()', () => {
    describe('when menu item toggle is clicked,', () => {
      const event = {
        stopPropagation: (): any => ({}),
      } as any;

      beforeEach(() => {
        jest.spyOn(event, 'stopPropagation').mockImplementation();
      });

      it('should avoid menu list close by stopping event propagation', () => {
        component.toggleClicked(event);
        expect(event.stopPropagation).toHaveBeenCalled();
      });
    });
  });

  describe('toggleChange()', () => {
    describe('when menu item toggle changed,', () => {
      beforeEach(() => {
        jest.spyOn(component.selectedMenuItemChanged, 'emit').mockImplementation();
      });

      it('should toggle option value and emit selectedMenuItem EventEmitter', () => {
        const oldValue = menuOptionStub.value;
        component.toggleChange(menuOptionStub);

        expect(menuOptionStub.value).toBe(!oldValue);
        expect(component.selectedMenuItemChanged.emit).toHaveBeenCalled();
      });
    });
  });
});
