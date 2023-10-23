import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import {
  dialogRefStub,
  registrationStub,
  routerStub,
  storeStub,
} from '../../../../../test/test-stubs';
import { MockComponents } from 'ng-mocks';

import { AccountingSystemComponent } from './accounting-system.component';
import { MatIcon } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxsModule, Store } from '@ngxs/store';
import * as coreActions from '../../../../core/actions/core.actions';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';

describe('AccountingSystemComponent', () => {
  let component: AccountingSystemComponent;
  let fixture: ComponentFixture<AccountingSystemComponent>;
  let loader: HarnessLoader;
  let settingsMenu: MatMenuHarness;
  let actionsMenu: MatMenuHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountingSystemComponent, MockComponents(MatIcon)],
      imports: [MatMenuModule, NoopAnimationsModule, NgxsModule.forRoot([])],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: Store,
          useValue: storeStub,
        },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AccountingSystemComponent);
    component = fixture.componentInstance;
    component.registration = registrationStub;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    settingsMenu = await loader.getHarness<MatMenuHarness>(
      MatMenuHarness.with({ selector: '.settingsMenu' })
    );
    actionsMenu = await loader.getHarness<MatMenuHarness>(
      MatMenuHarness.with({ selector: '.actionsMenu' })
    );
    component.registration = registrationStub;
    jest.spyOn(routerStub, 'navigate');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadPage()', () => {
    const url = '/customer-dashboard';
    beforeEach(() => {
      component.loadPage(url);
    });
    it('should set connector and registration ids', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
        new coreActions.SetConnectorId(component.registration.connectorId),
        new coreActions.SetRegistration(component.registration),
      ]));

    it('should redirect to customer dashboard connectors settings page', () =>
      expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [url]));
  });

  describe('should display the appropriate fields agnostic of menus', () => {
    it('should display title', () => {
      const titleElem: HTMLElement = fixture.nativeElement.querySelector('.title');
      expect(titleElem.textContent).toContain(registrationStub.description);
    });

    it('should display the correct created by data', () => {
      const createdByLabelElem: HTMLElement = fixture.nativeElement.querySelector(
        '.createdByContainer span'
      );
      const createdByValueElem: HTMLElement =
        fixture.nativeElement.querySelector('.createdByContainer p');
      expect(createdByLabelElem.textContent).toContain('Created by');
      expect(createdByValueElem.textContent).toContain(registrationStub.createdBy);
    });

    it('should display the correct modified by data', () => {
      const modifiedByLabelElem: HTMLElement = fixture.nativeElement.querySelector(
        '.modifiedByContainer span'
      );
      const modifiedByValueElem: HTMLElement =
        fixture.nativeElement.querySelector('.modifiedByContainer p');
      expect(modifiedByLabelElem.textContent).toContain('Last modified by');
      expect(modifiedByValueElem.textContent).toContain(registrationStub.modifiedBy);
    });
  });

  describe('settings menu', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadPage');
      settingsMenu.open();
    });

    it('should display the correct options in the settings menu', async () => {
      const menuItems: MatMenuItemHarness[] = await settingsMenu.getItems();
      expect(await menuItems[0].getText()).toContain('Settings');
      expect(await menuItems[1].getText()).toContain('Configure Data Types');
    });

    it('should handle the settings option', async () => {
      const menuItems = await settingsMenu.getItems();
      await menuItems[0].click();
      expect(component.loadPage).toHaveBeenCalledWith('/customer-dashboard/connectors/settings');
    });

    it('should handle the configure data types option', async () => {
      const menuItems = await settingsMenu.getItems();
      await menuItems[1].click();
      expect(component.loadPage).toHaveBeenCalledWith('/data-selection');
    });
  });

  describe('actions menu', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadPage');
      actionsMenu.open();
    });

    it('should display the correct options in the actions menu', async () => {
      const menuItems: MatMenuItemHarness[] = await actionsMenu.getItems();
      expect(await menuItems[0].getText()).toContain('Schedule Sync');
      expect(await menuItems[1].getText()).toContain('Sync Now');
    });

    it('should handle the schedule sync option', async () => {
      const menuItems = await actionsMenu.getItems();
      await menuItems[0].click();
      expect(component.loadPage).toHaveBeenCalledWith('/schedule-sync');
    });

    it('should handle the sync now option', async () => {
      const menuItems = await actionsMenu.getItems();
      await menuItems[1].click();
      expect(component.loadPage).toHaveBeenCalledWith('/sync-now');
    });
  });
});
