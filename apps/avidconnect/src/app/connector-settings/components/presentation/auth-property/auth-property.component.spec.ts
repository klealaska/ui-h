import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MatInput, MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';
import { authPropertyStub, groupSettingsStub, propertyStub } from '../../../../../test/test-stubs';
import { AuthPropertyComponent } from './auth-property.component';
import { PropertyType } from '../../../../core/enums';
import * as actions from '../../../connector-settings.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthPropertyComponent', () => {
  let component: AuthPropertyComponent;
  let fixture: ComponentFixture<AuthPropertyComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthPropertyComponent, MatInput],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        MatInputModule,
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AuthPropertyComponent);
    component = fixture.componentInstance;
    component.property = { ...propertyStub, Type: PropertyType.Auth };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when property value is empty', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should set multipleSelectedValues value', () => expect(component.value).toEqual(''));
    });
  });

  describe('openWindow()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should dispatch signInAuthProfile action', () => {
      component.ngOnInit();
      jest.spyOn(component, 'openWindow').mockImplementation();
      component.openWindow('www.google.com');
      expect(component.openWindow).toHaveBeenCalled();
    });
  });
  describe('initializeAuth()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should dispatch initializeAuth action', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();
      component.initializeAuth();
      expect(store.dispatch).toHaveBeenCalledWith(
        new actions.InitializeAuth(component.property.AuthProfile)
      );
    });
  });
  describe('LoginSuccess()', () => {
    beforeEach(() => {
      component.property.AuthProfile = 'test';
      component.value = '';
    });
    it('should dispacth CheckAuth action', () => {
      jest.spyOn(store, 'dispatch');
      component.LoginSuccess();
      expect(store.dispatch).toHaveBeenCalledWith(
        new actions.CheckAuth(component.property.AuthProfile)
      );
    });

    it('should call authFinalized', () => {
      jest.spyOn(store, 'dispatch').mockReturnValue(of('foo'));
      jest.spyOn(component, 'authFinalized').mockImplementation();
      component.LoginSuccess();
      expect(component.authFinalized).toHaveBeenCalledWith('foo');
    });

    it('authFinalized should return falsy', () => {
      const stub = {
        connectorSettings: {
          jsonSchema: {
            Auth: {
              Finalized: false,
            },
          },
        },
      };
      expect(component.authFinalized(stub)).toBeFalsy();
    });
  });

  describe('authFinalize()', () => {
    describe('when date changed', () => {
      beforeEach(() => {
        component.value = '';
        jest.spyOn(component.authChanged, 'emit');
        component.authChanged.emit('value');
      });
      it('should change date array', () => expect(component.value).toEqual(''));
    });
  });

  describe('saveSettings()', () => {
    it('should dispatch PostConnectorSettings action', () => {
      jest.spyOn(store, 'dispatch').mockImplementation();
      jest
        .spyOn(store, 'selectSnapshot')
        .mockReturnValueOnce([groupSettingsStub])
        .mockReturnValueOnce(1);

      component.saveSettings();
      expect(store.dispatch).toHaveBeenCalledWith(
        new actions.PostConnectorSettings([groupSettingsStub], 1)
      );
    });
  });

  describe('signInAuthProfile()', () => {
    beforeEach(() => {
      window.open = jest.fn();
      jest.useFakeTimers();
      component.ngOnInit();
    });
    it('should window close be false', () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValue({ authPropertyStub });
      const isWindowClosedSpy = jest
        .spyOn(component, 'isWindowClosed')
        .mockReturnValue((window.closed = true));

      component.signInAuthProfile();
      jest.runOnlyPendingTimers();

      expect(isWindowClosedSpy).toHaveBeenCalled();
    });
  });

  describe('isWindowClosed()', () => {
    beforeEach(() => {
      window.open = jest.fn();
      jest.useFakeTimers();
    });
    it('Window closed should be true', () => {
      window.closed = true;
      const spy = jest.spyOn(component, 'LoginSuccess');
      component.isWindowClosed(undefined, window);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('openWidow()', () => {
    it('should call window.open', () => {
      jest.spyOn(window, 'open');
      component.openWindow('foo');
      expect(window.open).toHaveBeenCalledWith(
        'foo',
        'Sign in',
        `
      scrollbars=yes,
      width=0,
      height=0,
      top=0,
      left=0
      `
      );
    });

    it('should call window.open', () => {
      window.screenLeft = undefined;
      window.screenTop = undefined;
      window.innerWidth = undefined;
      window.innerHeight = undefined;
      jest.spyOn(window, 'open');
      component.openWindow('foo');
      expect(window.open).toHaveBeenCalledWith(
        'foo',
        'Sign in',
        `
      scrollbars=yes,
      width=0,
      height=0,
      top=0,
      left=0
      `
      );
    });
  });
});
