import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AvatarComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent } from 'ng-mocks';

import { HeaderComponent } from './header.component';

const routerStub = {
  navigate: jest.fn(),
} as any;

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, MockComponent(AvatarComponent)],
      imports: [MatIconModule, MatMenuModule, MatToolbarModule],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      component.name = 'Mock Test';
      fixture.detectChanges();
    });

    it('should set the avatarName', () =>
      expect(component.avatarName).toEqual({
        first: 'Mock',
        last: 'Test',
      }));

    describe('when name passed in has more than two names ', () => {
      beforeEach(() => {
        component.name = 'Mock Stub Test';
        fixture.detectChanges();
      });

      it('should set the avatarName using first and last word of name string', () =>
        expect(component.avatarName).toEqual({
          first: 'Mock',
          last: 'Test',
        }));
    });
  });

  describe('navigate()', () => {
    describe('when homePath input is not passed in', () => {
      beforeEach(() => {
        component.navigate();
      });

      it('should navigate to the default homePath', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['queue']));
    });

    describe('when homePath input has a value passed in for it', () => {
      beforeEach(() => {
        component.homePath = 'mock';
        component.navigate();
      });

      it('should navigate to what ever is passed in for the homePath input', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['mock']));
    });
  });

  describe('menuOptionSelected()', () => {
    describe('when option selected is Logout', () => {
      const optionStub = {
        text: 'Logout',
      } as any;

      beforeEach(() => {
        jest.spyOn(component.logout, 'emit').mockImplementation();
        component.menuOptionSelected(optionStub);
      });

      it('should emit for the logout emitter', () =>
        expect(component.logout.emit).toHaveBeenCalledTimes(1));
    });

    describe('when option selected is NOT Logout', () => {
      const optionStub = {
        text: 'mock',
      } as any;

      beforeEach(() => {
        jest.spyOn(component.selectedMenuItem, 'emit').mockImplementation();
        component.menuOptionSelected(optionStub);
      });

      it('should emit for the selectedMenuItem emitter', () =>
        expect(component.selectedMenuItem.emit).toHaveBeenNthCalledWith(1, 'mock'));
    });
  });
});
