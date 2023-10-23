import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { Logout } from '@ui-coe/avidcapture/core/data-access';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

import { AvidcaptureMaintenancePageComponent } from './maintenance-page.component';

describe('AvidcaptureMaintenancePageComponent', () => {
  let store: Store;
  let component: AvidcaptureMaintenancePageComponent;
  let fixture: ComponentFixture<AvidcaptureMaintenancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AvidcaptureMaintenancePageComponent,
        NgxsModule.forRoot([], { developmentMode: true }),
        ButtonComponent,
        MatIconModule,
      ],
      providers: [
        { provide: USE_DEFAULT_LANG, useValue: undefined },
        { provide: USE_STORE, useValue: undefined },
        { provide: USE_EXTEND, useValue: undefined },
        { provide: DEFAULT_LANGUAGE, useValue: undefined },
        TranslateService,
        TranslateStore,
        TranslateLoader,
        TranslateCompiler,
        TranslateParser,
        MissingTranslationHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvidcaptureMaintenancePageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('redirectHome()', () => {
    beforeEach(() => {
      component.redirectHome();
    });

    it('should dispatch Logout', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new Logout()));
  });
});
