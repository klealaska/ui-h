import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankAccountListFacade } from '@ui-coe/bank-account-mgmt/list/data-access';
import {
  bankAccountListFacadeMock,
  contentFacadeMock,
  headerServiceMock,
  bankAccountListMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { BankAccountListContainerComponent } from './bank-account-list-container.component';
import { ContentFacade, HeaderService } from '@ui-coe/bank-account-mgmt/shared/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { BankAccountCardComponent, BankAccountsEmptyStateComponent } from '../../components';
import { BankAccountHeaderContainerComponent } from '@ui-coe/bank-account-mgmt/shared/ui';

describe('bank account list container', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  let component: BankAccountListContainerComponent;
  let fixture: ComponentFixture<BankAccountListContainerComponent>;
  let listFacade: BankAccountListFacade;
  let headerService: HeaderService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BankAccountListContainerComponent,
        BankAccountsEmptyStateComponent,
        BankAccountCardComponent,
        BankAccountHeaderContainerComponent,
      ],
      imports: [SharedUiV2Module, MatCardModule, ButtonComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { url: 'list' } },
        { provide: BankAccountListFacade, useValue: bankAccountListFacadeMock },
        { provide: ContentFacade, useValue: contentFacadeMock },
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: Router, useValue: { url: 'list', navigate: jest.fn() } },
      ],
    });
    fixture = TestBed.createComponent(BankAccountListContainerComponent);
    component = fixture.componentInstance;
    listFacade = TestBed.inject(BankAccountListFacade);
    headerService = TestBed.inject(HeaderService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(headerService.setHeaderLabel).toHaveBeenCalledWith('list');
    expect(listFacade.dispatchGetBankAccounts).toHaveBeenCalled();
  });

  describe('header', () => {
    let searchElem: DebugElement;
    let toggleElem: DebugElement;
    let addButtonElem: DebugElement;

    beforeEach(() => {
      searchElem = fixture.debugElement.query(By.css('#list__search'));
      toggleElem = fixture.debugElement.query(By.css('#list__active-toggle'));
      addButtonElem = fixture.debugElement.query(By.css('#list__add-btn'));
    });

    it('should display the correct elements', () => {
      expect(searchElem).toBeTruthy();
      expect(toggleElem).toBeTruthy();
      expect(addButtonElem).toBeTruthy();
    });

    // ADD INPUT AND TOGGLE TESTS WHEN WE HANDLE SEARCH
    it('should handle the add account click', () => {
      jest.spyOn(component, 'handleAddAccount');
      addButtonElem.triggerEventHandler('click');
      expect(component.handleAddAccount).toHaveBeenCalled();
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
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

  describe('bam cards', () => {
    let cards: DebugElement[];

    beforeEach(() => {
      cards = fixture.debugElement.queryAll(By.css('ax-bank-account-card'));
    });

    it('should display the cards', () => {
      expect(cards.length).toBe(6);
    });

    it('should call the card click handler', () => {
      jest.spyOn(component, 'handleAccountSelection');
      cards[0].triggerEventHandler('bankAccountSelected', bankAccountListMock[0].accountId);
      expect(component.handleAccountSelection).toHaveBeenCalledWith(
        bankAccountListMock[0].accountId
      );
      expect(router.navigate).toHaveBeenCalledWith([`../${bankAccountListMock[0].accountId}`], {
        relativeTo: activatedRoute,
      });
    });
  });
});
