import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountEditContainerComponent } from './bank-account-edit-container.component';
import { BankAccountDetailFacade } from '@ui-coe/bank-account-mgmt/details/data-access';
import {
  bankAccountDetailFacadeMock,
  bankAccountDetailMock,
  bankAccountSharedFacadeMock,
  contentFacadeMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import {
  BankAccountSharedFacade,
  ContentFacade,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('BankAccountEditContainerComponent', () => {
  let component: BankAccountEditContainerComponent;
  let fixture: ComponentFixture<BankAccountEditContainerComponent>;
  let sharedFacade: BankAccountSharedFacade;
  let detailFacade: BankAccountDetailFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountEditContainerComponent, NoopAnimationsModule],
      providers: [
        { provide: BankAccountDetailFacade, useValue: bankAccountDetailFacadeMock },
        { provide: BankAccountSharedFacade, useValue: bankAccountSharedFacadeMock },
        { provide: ContentFacade, useValue: contentFacadeMock },
      ],
    }).compileComponents();

    sharedFacade = TestBed.inject(BankAccountSharedFacade);
    detailFacade = TestBed.inject(BankAccountDetailFacade);
    fixture = TestBed.createComponent(BankAccountEditContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an event to reset the side panel and account when the side panel is closed', () => {
    const sideSheetEl: DebugElement = fixture.debugElement.query(By.css('ax-side-sheet-v2'));

    jest.spyOn(sharedFacade, 'dispatchResetSidePanel');
    jest.spyOn(detailFacade, 'dispatchResetDetails');
    sideSheetEl.triggerEventHandler('closeEvent');

    expect(sharedFacade.dispatchResetSidePanel).toHaveBeenCalled();
    expect(detailFacade.dispatchResetDetails).toHaveBeenCalled();
  });

  it('should dispatch an event for the detail side panel when back is clicked', () => {
    const editHeaderEl: DebugElement = fixture.debugElement.query(By.css('ax-bam-edit-header'));

    jest.spyOn(sharedFacade, 'dispatchSetSidePanelComponentId');
    editHeaderEl.triggerEventHandler('backClick');

    expect(sharedFacade.dispatchSetSidePanelComponentId).toHaveBeenCalledWith('detail');
  });

  it('should dispatch an edit event with the edit params when save is clicked', () => {
    const editParams = {
      nickName: 'new name',
      accountId: bankAccountDetailMock.accountId,
      externalBankReference: bankAccountDetailMock.externalBankReference,
    };
    (component as any)._editParams = editParams;

    const editFooterEl: DebugElement = fixture.debugElement.query(By.css('ax-bam-edit-footer'));
    jest.spyOn(detailFacade, 'dispatchEditBankAccount');
    jest.spyOn(component, 'backToDetails');
    editFooterEl.triggerEventHandler('saveClick');

    expect(component.backToDetails).toHaveBeenCalledTimes(1);
    expect(detailFacade.dispatchEditBankAccount).toHaveBeenCalledWith(editParams);
  });

  it('should update the edit params when nickname is changed', () => {
    const newNickname = 'new nickname';
    const editEl: DebugElement = fixture.debugElement.query(By.css('ax-bank-account-edit'));
    editEl.triggerEventHandler('nicknameChange', newNickname);

    expect((component as any)._editParams).toEqual({
      nickName: newNickname,
      accountId: bankAccountDetailMock.accountId,
      externalBankReference: bankAccountDetailMock.externalBankReference,
    });
  });

  it('should enable saving when nickname is changed', () => {
    const editEl: DebugElement = fixture.debugElement.query(By.css('ax-bank-account-edit'));
    expect(component.saveDisabled).toEqual(true);

    editEl.triggerEventHandler('nicknameChange', 'new nickname');
    expect(component.saveDisabled).toEqual(false);
  });
});
