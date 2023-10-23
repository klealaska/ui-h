import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import {
  Logout,
  QueryDocumentCardSetCounts,
  SendUnlockMessage,
  SetResearchPageEscalationCategoryList,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { HotkeysService } from '@ui-coe/avidcapture/indexing/util';
import {
  CoreStateMock,
  getBuyersStub,
  getCompositeDataStub,
  hasAllTheClaimsTokenStub,
  singleOrgTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { AvidPartners, UserMenuOptions } from '@ui-coe/avidcapture/shared/types';
import { CookieService } from '@ui-coe/avidcapture/shared/util';
import { AxDialogService } from '@ui-coe/shared/ui';
import { MockComponent } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { FullStoryService } from '../../../services/fullStory.service';
import { HeaderComponent } from '../header/header.component';
import { LayoutComponent } from './layout.component';

const eventSubject = new ReplaySubject<RouterEvent>(1);

const routerStub = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: '/',
};

const axDialogServiceSpy = {
  open: jest.fn(),
};
const hotkeysServiceStub = {
  openHelpModal: jest.fn(),
  addShortcut: jest.fn(),
};

const actionsStub = of([SendUnlockMessage]);

const cookieServiceStub = {
  getCookie: jest.fn(),
} as any;

const fullStoryServiceStub = {
  init: jest.fn(),
  identify: jest.fn(),
};

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent, MockComponent(HeaderComponent)],
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([CoreStateMock], { developmentMode: true }),
        MatIconModule,
        MatListModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
        {
          provide: AxDialogService,
          useValue: axDialogServiceSpy,
        },
        {
          provide: HotkeysService,
          useValue: hotkeysServiceStub,
        },
        {
          provide: Actions,
          useValue: actionsStub,
        },
        {
          provide: CookieService,
          useValue: cookieServiceStub,
        },
        {
          provide: FullStoryService,
          useValue: fullStoryServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockImplementation();
    component.favIcon = { href: '' } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('router events', () => {
      describe('when url includes indexing', () => {
        beforeEach(() => {
          store.reset({
            pendingPage: {
              filteredBuyers: getBuyersStub(),
            },
            core: {
              token: hasAllTheClaimsTokenStub,
              filteredBuyers: getBuyersStub(),
              userAccount: {
                preferred_username: 'mock',
                name: 'mockName',
                email: 'mockEmail',
              },
            },
          });
          routerStub.url = 'http://localhost.com/indexing/1';
          component.ngOnInit();
        });

        it('should dispatch QueryDocumentCardSetCounts action with filteredBuyers', () =>
          expect(store.dispatch).toHaveBeenNthCalledWith(1, [
            new SetResearchPageEscalationCategoryList([]),
            new QueryDocumentCardSetCounts(),
          ]));

        it('should call identify on ngOnInit', () => {
          expect(fullStoryServiceStub.identify).toHaveBeenCalledWith(
            'mock',
            'Mockname',
            'mockEmail'
          );
        });
      });

      describe('when url includes indexing but pendingQueue state is not defined', () => {
        beforeEach(() => {
          store.reset({
            core: {
              token: hasAllTheClaimsTokenStub,
              filteredBuyers: getBuyersStub(),
              userAccount: {
                preferred_username: 'mock',
                name: 'mockName',
                email: 'mockEmail',
              },
            },
          });
          routerStub.url = 'http://localhost.com/indexing/1';
          component.ngOnInit();
        });

        it('should dispatch QueryDocumentCardSetCounts action with empty array', () =>
          expect(store.dispatch).toHaveBeenNthCalledWith(1, [
            new SetResearchPageEscalationCategoryList([]),
            new QueryDocumentCardSetCounts(),
          ]));
      });

      describe('when url includes indexing but username is not defined', () => {
        beforeEach(() => {
          store.reset({
            core: {
              token: hasAllTheClaimsTokenStub,
              filteredBuyers: getBuyersStub(),
              userAccount: {
                preferred_username: undefined,
                name: 'mockName',
                email: 'mockEmail',
              },
            },
          });
          routerStub.url = 'http://localhost.com/indexing/1';
          component.ngOnInit();
        });

        it('should not dispatch QueryDocumentCardSetCounts', () =>
          expect(store.dispatch).not.toHaveBeenCalled());
      });

      describe('when url does NOT include indexing', () => {
        beforeEach(() => {
          store.reset({
            core: {
              token: hasAllTheClaimsTokenStub,
              filteredBuyers: getBuyersStub(),
              userAccount: {
                preferred_username: 'mock',
                name: 'mockName',
                email: 'mockEmail',
              },
            },
          });
          routerStub.url = 'http://localhost.com/queue';
          component.ngOnInit();
        });

        it('should dispatch SetResearchPageEscalationCategoryList action', () =>
          expect(store.dispatch).toHaveBeenNthCalledWith(
            1,
            new SetResearchPageEscalationCategoryList([])
          ));
      });

      describe('when url does NOT include indexing but username is not defined', () => {
        beforeEach(() => {
          store.reset({
            core: {
              token: hasAllTheClaimsTokenStub,
              filteredBuyers: getBuyersStub(),
              userAccount: {
                preferred_username: undefined,
              },
            },
          });
          routerStub.url = 'http://localhost.com/indexing/1';
          component.ngOnInit();
        });

        it('should not dispatch SetResearchPageEscalationCategoryList', () =>
          expect(store.dispatch).not.toHaveBeenCalled());
      });
    });

    describe('when user canViewAllBuyers', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: hasAllTheClaimsTokenStub,
            filteredBuyers: getBuyersStub(),
            userAccount: {
              preferred_username: 'mock',
              name: 'mockName',
              email: 'mockEmail',
            },
            userMenuOptions: [],
          },
        });
        component.ngOnInit();
      });

      it('should add client guidelines to the menuOptions', done => {
        component.menuOptions$.subscribe(value => {
          expect(value).toEqual([
            {
              text: UserMenuOptions.AvidInbox,
            },
            {
              text: UserMenuOptions.AvidInvoice,
            },
            {
              text: UserMenuOptions.ClientGuidelines,
            },
            {
              text: 'Logout',
            },
          ]);

          done();
        });
      });
    });

    describe('when user cannot ViewAllBuyers', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: singleOrgTokenStub,
            filteredBuyers: getBuyersStub(),
            userAccount: {
              preferred_username: 'mock',
            },
            userMenuOptions: [],
          },
        });
        component.ngOnInit();
      });

      it('should NOT add client guidelines to the menuOptions', done => {
        component.menuOptions$.subscribe(value => {
          expect(value).toEqual([
            {
              text: UserMenuOptions.AvidInbox,
            },
            {
              text: UserMenuOptions.AvidInvoice,
            },
            {
              text: 'Logout',
            },
          ]);

          done();
        });
      });
    });
  });

  describe('onTitleClick()', () => {
    beforeEach(() => {
      component.onTitleClick();
    });

    it('should navigate to /', () => expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['/']));
  });

  describe('onLogout()', () => {
    describe('when url includes indexing', () => {
      beforeEach(() => {
        store.selectSnapshot = jest.fn().mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData: getCompositeDataStub(),
            },
          })
        );
        routerStub.url = 'http://localhost.com/indexing/1';
        component.onLogout();
      });

      it('should call UnlockDocument action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new UnlockDocument('1')));
    });

    describe('when url DOES NOT include indexing', () => {
      beforeEach(() => {
        routerStub.url = 'http://localhost.com/queue';
        component.onLogout();
      });

      it('should call Logout action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new Logout()));
    });
  });

  describe('onMenuItemClick()', () => {
    let spyWindow: jest.SpyInstance;

    beforeEach(() => {
      spyWindow = jest.spyOn(window as any, 'open').mockReturnValue({});
    });

    it('should redirect to avid inbox when AvidInbox option is selected from user Menu', () => {
      component.onMenuItemClick(UserMenuOptions.AvidInbox);

      expect(spyWindow).toHaveBeenNthCalledWith(1, environment.avidInboxLink, '_blank');
    });

    it('should redirect to avid invoice suite when AvidInvoice option is selected from user Menu', () => {
      component.onMenuItemClick(UserMenuOptions.AvidInvoice);

      expect(spyWindow).toHaveBeenNthCalledWith(1, environment.avidInvoiceLink, '_blank');
    });

    it('should redirect to customer guidelines link when Customer Guidelines option is selected from user Menu', () => {
      component.onMenuItemClick(UserMenuOptions.ClientGuidelines);

      expect(spyWindow).toHaveBeenNthCalledWith(1, environment.clientGuidelinesLink, '_blank');
    });

    it('should open hotkeys modal when Hotkeys Guide option is selected from user Menu', () => {
      component.onMenuItemClick(UserMenuOptions.HotkeyGuide);

      expect(hotkeysServiceStub.openHelpModal).toHaveBeenCalled();
    });
  });

  describe('getTooltipMessage()', () => {
    describe('when there are NO filtered buyers', () => {
      it('should return non filtered message for tooltip', () =>
        expect(component.getTooltipMessage()).toBe('Invoices remaining in queue'));
    });

    describe('when there are filtered buyers', () => {
      beforeEach(() => {
        store.reset({
          pendingPage: {
            filteredBuyers: getBuyersStub(),
          },
        });
      });

      it('should return a filtered message for tooltip', () =>
        expect(component.getTooltipMessage()).toBe('Invoices remaining in filtered queue'));
    });
  });

  describe('private getLogo()', () => {
    describe('when cookie is for AvidXChange users', () => {
      beforeEach(() => {
        cookieServiceStub.getCookie.mockReturnValueOnce(AvidPartners.AvidXChange);
        component['getLogo']();
      });

      it('should set titleImage to the assets folder', () => {
        expect(component.titleImage).toBe('/assets/mini.svg');
      });

      it('should set favicon to the assets folder', () => {
        expect(component.favIcon.href).toBe('/assets/images/favicon/avid.ico');
      });
    });

    describe('when cookie is for Bank of America users', () => {
      beforeEach(() => {
        cookieServiceStub.getCookie.mockReturnValueOnce(AvidPartners.BankOfAmerica);
        component['getLogo']();
      });

      it('should set titleImage to the bofa environment var', () => {
        expect(component.titleImage).toBe(environment.titleImage.bofa);
      });

      it('should set favicon to the assets folder', () => {
        expect(component.favIcon.href).toBe('/assets/images/favicon/bofa.ico');
      });
    });

    describe('when cookie is for Com Data users', () => {
      beforeEach(() => {
        cookieServiceStub.getCookie.mockReturnValueOnce(AvidPartners.ComData);
        component['getLogo']();
      });

      it('should set titleImage to the comdata environment var', () => {
        expect(component.titleImage).toBe(environment.titleImage.comdata);
      });

      it('should set favicon to the assets folder', () => {
        expect(component.favIcon.href).toBe('/assets/images/favicon/comdata.ico');
      });
    });

    describe('when cookie is for Fifth Third Bank users', () => {
      beforeEach(() => {
        cookieServiceStub.getCookie.mockReturnValueOnce(AvidPartners.FifthThird);
        component['getLogo']();
      });

      it('should set titleImage to the fifth environment var', () => {
        expect(component.titleImage).toBe(environment.titleImage.fifth);
      });

      it('should set favicon to the assets folder', () => {
        expect(component.favIcon.href).toBe('/assets/images/favicon/fifththird.ico');
      });
    });

    describe('when cookie is for Key Bank users', () => {
      beforeEach(() => {
        cookieServiceStub.getCookie.mockReturnValueOnce(AvidPartners.KeyBank);
        component['getLogo']();
      });

      it('should set titleImage to the key environment var', () => {
        expect(component.titleImage).toBe(environment.titleImage.key);
      });

      it('should set favicon to the assets folder', () => {
        expect(component.favIcon.href).toBe('/assets/images/favicon/keybank.ico');
      });
    });

    describe('when cookie is not found', () => {
      beforeEach(() => {
        cookieServiceStub.getCookie.mockReturnValueOnce('');
        component['getLogo']();
      });

      it('should set titleImage to the assets folder', () => {
        expect(component.titleImage).toBe('/assets/mini.svg');
      });

      it('should set favicon to the assets folder', () => {
        expect(component.favIcon.href).toBe('/assets/images/favicon/avid.ico');
      });
    });
  });
});
