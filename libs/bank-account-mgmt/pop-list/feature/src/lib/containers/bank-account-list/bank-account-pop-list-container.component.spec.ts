import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopBamListFacade } from '@ui-coe/bank-account-mgmt/pop-list/data-access';
import {
  bankAccountListFacadeMock,
  contentFacadeMock,
  headerServiceMock,
  bankAccountSharedFacadeMock,
  bankAccountListMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { BankAccountPopListContainerComponent } from './bank-account-pop-list-container.component';
import {
  BankAccountSharedFacade,
  ContentFacade,
  HeaderService,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import { Router } from '@angular/router';
import { ButtonComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { PopListComponent, BankAccountsEmptyStateComponent } from '../../components';
import { BankAccountHeaderContainerComponent } from '@ui-coe/bank-account-mgmt/shared/ui';

describe('pop bank account list container', () => {
  let component: BankAccountPopListContainerComponent;
  let fixture: ComponentFixture<BankAccountPopListContainerComponent>;
  let listFacade: PopBamListFacade;
  let headerService: HeaderService;
  let sharedFacade: BankAccountSharedFacade;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BankAccountPopListContainerComponent,
        BankAccountsEmptyStateComponent,
        PopListComponent,
        BankAccountHeaderContainerComponent,
      ],
      imports: [SharedUiV2Module, MatCardModule, ButtonComponent],
      providers: [
        { provide: BankAccountSharedFacade, useValue: bankAccountSharedFacadeMock },
        { provide: PopBamListFacade, useValue: bankAccountListFacadeMock },
        { provide: ContentFacade, useValue: contentFacadeMock },
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: Router, useValue: { url: 'list', navigate: jest.fn() } },
      ],
    });
    fixture = TestBed.createComponent(BankAccountPopListContainerComponent);
    component = fixture.componentInstance;
    listFacade = TestBed.inject(PopBamListFacade);
    sharedFacade = TestBed.inject(BankAccountSharedFacade);
    headerService = TestBed.inject(HeaderService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(headerService.setHeaderLabel).toHaveBeenCalledWith('list');
    expect(listFacade.dispatchGetBankAccounts).toHaveBeenCalled();
  });

  // describe('header', () => {
  //   let searchElem: DebugElement;
  //   let toggleElem: DebugElement;
  //   let addButtonElem: DebugElement;
  //
  //   beforeEach(() => {
  //     searchElem = fixture.debugElement.query(By.css('#list__search'));
  //     toggleElem = fixture.debugElement.query(By.css('#list__active-toggle'));
  //     addButtonElem = fixture.debugElement.query(By.css('#list__add-btn'));
  //   });

  // ADD INPUT AND TOGGLE TESTS WHEN WE HANDLE SEARCH
  // it('should handle the add account click', () => {
  //   jest.spyOn(component, 'handleAddAccount');
  //   jest.spyOn(sharedFacade, 'dispatchSetSidePanelComponentId');
  //   addButtonElem.triggerEventHandler('click');
  //   expect(component.handleAddAccount).toHaveBeenCalled();
  //   expect(sharedFacade.dispatchSetSidePanelComponentId).toHaveBeenCalledWith('add');
  // });
  // });

  describe('skeleton loaders', () => {
    beforeEach(() => {
      component.loading$ = of(true);
      component.accounts$ = undefined;
      fixture.detectChanges();
    });

    it('should display skeleton loaders when accounts are undefined', () => {
      const skeletonElem: DebugElement = fixture.debugElement.query(
        By.css('ui-coe-bam-list-skeleton')
      );
      expect(skeletonElem).toBeTruthy();
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
      component.loading$ = of(false);
      component.accounts$ = of([]);
      fixture.detectChanges();
    });

    it('should display empty state when no accounts are returned', () => {
      const emptyStateElem: DebugElement = fixture.debugElement.query(
        By.css('ax-bank-account-empty-state')
      );
      expect(emptyStateElem).toBeTruthy();
    });
  });

  describe('pop list', () => {
    let list: DebugElement;

    beforeEach(() => {
      component.loading$ = of(false);
      fixture.detectChanges();
      list = fixture.debugElement.query(By.css('ui-coe-pop-list'));
    });

    it('should display the list', () => {
      expect(list).toBeTruthy();
    });

    // it('should handle list item selection', () => {
    //   jest.spyOn(component, 'handleAccountSelection');
    //   jest.spyOn(sharedFacade, 'dispatchSetSelectedAccountId');
    //   list.triggerEventHandler('bankAccountSelected', bankAccountListMock[0].accountId);
    //   expect(component.handleAccountSelection).toHaveBeenCalledWith(
    //     bankAccountListMock[0].accountId
    //   );
    //   expect(sharedFacade.dispatchSetSelectedAccountId).toHaveBeenCalledWith(
    //     bankAccountListMock[0].accountId
    //   );
    // });
  });
});
