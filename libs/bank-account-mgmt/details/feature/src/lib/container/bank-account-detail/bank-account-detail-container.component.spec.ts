import { BankAccountDetailContainerComponent } from './bank-account-detail-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankAccountDetailFacade } from '@ui-coe/bank-account-mgmt/details/data-access';
import {
  bankAccountDetailFacadeMock,
  BankAccountMgmtSharedTestModule,
  contentFacadeMock,
  bankAccountServiceMock,
  bankAccountDetailMock,
  bankAccountSharedFacadeMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import {
  BankAccountSharedFacade,
  ContentFacade,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BankAccountDetailsService } from '@ui-coe/bank-account-mgmt/details/data-access';
import { MatDialogModule } from '@angular/material/dialog';
import { IDetailBtnEmitEvent } from '@ui-coe/bank-account-mgmt/shared/types';

// const dialogStub = {
//   open: jest.fn(),
// };

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

describe('bank account detail container', () => {
  let component: BankAccountDetailContainerComponent;
  let fixture: ComponentFixture<BankAccountDetailContainerComponent>;
  let detailFacade: BankAccountDetailFacade;
  let sharedFacade: BankAccountSharedFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BankAccountMgmtSharedTestModule,
        MatDialogModule,
        BankAccountDetailContainerComponent,
      ],
      providers: [
        { provide: BankAccountDetailFacade, useValue: bankAccountDetailFacadeMock },
        { provide: BankAccountSharedFacade, useValue: bankAccountSharedFacadeMock },
        { provide: ContentFacade, useValue: contentFacadeMock },
        { provide: BankAccountDetailsService, useValue: bankAccountServiceMock },
        // { provide: MatDialog, useValue: dialogStub },
      ],
    });
    detailFacade = TestBed.inject(BankAccountDetailFacade);
    sharedFacade = TestBed.inject(BankAccountSharedFacade);
    fixture = TestBed.createComponent(BankAccountDetailContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('after component loads data', () => {
    describe('detail header', () => {
      it('should display the detail header component', () => {
        const detailHeaderElem: DebugElement = fixture.debugElement.query(
          By.css('ax-bam-detail-header')
        );
        expect(detailHeaderElem).toBeTruthy();
      });
    });

    describe('detail view', () => {
      it('should display the detail component', () => {
        const detailElem: DebugElement = fixture.debugElement.query(
          By.css('ax-bank-account-detail')
        );
        expect(detailElem).toBeTruthy();
      });

      it('should dispatch an event to reset the side panel and account when the side panel is closed', () => {
        const sideSheetEl: DebugElement = fixture.debugElement.query(By.css('ax-side-sheet-v2'));

        jest.spyOn(sharedFacade, 'dispatchResetSidePanel');
        jest.spyOn(detailFacade, 'dispatchResetDetails');
        sideSheetEl.triggerEventHandler('closeEvent');

        expect(sharedFacade.dispatchResetSidePanel).toHaveBeenCalled();
        expect(detailFacade.dispatchResetDetails).toHaveBeenCalled();
      });
    });

    // describe('activate', () => {
    //   it('should handle account activation event', () => {
    //     const expected: IDetailBtnEmitEvent = {
    //       account: {
    //         ...bankAccountDetailMock,
    //         bankAccountStatus: 'Inactive',
    //       },
    //     };
    //     jest.spyOn(detailFacade, 'dispatchActivateAccount');
    //     const detailHeaderElem: DebugElement = fixture.debugElement.query(
    //       By.css('ax-bam-detail-footer')
    //     );
    //     detailHeaderElem.triggerEventHandler('detailButtonClick', expected);
    //     expect(detailFacade.dispatchActivateAccount).toHaveBeenCalledWith(
    //       bankAccountDetailMock.accountId
    //     );
    //   });
    // });

    // describe('deactivate', () => {
    //   it('should handle account deactivate event', (done: DoneCallback) => {
    //     dialogStub.open.mockReturnValue({
    //       afterClosed: () => of({ event: 'Deactivate' }),
    //     } as MatDialogRef<DialogV2Component>);
    //
    //     const expected: IDetailBtnEmitEvent = {
    //       account: {
    //         ...bankAccountDetailMock,
    //         bankAccountStatus: 'Active',
    //       },
    //     };
    //     jest.spyOn(component['_dialog'], 'open');
    //     const detailHeaderElem: DebugElement = fixture.debugElement.query(
    //       By.css('ax-bam-detail-footer')
    //     );
    //
    //     detailHeaderElem.triggerEventHandler('detailButtonClick', expected);
    //     expect(component['_dialog'].open).toHaveBeenCalled();
    //
    //     component.dialogRef.afterClosed().subscribe(() => {
    //       jest.spyOn(detailFacade, 'dispatchDeactivateAccount');
    //       expect(detailFacade.dispatchDeactivateAccount).toHaveBeenCalledWith(
    //         bankAccountDetailMock.accountId
    //       );
    //       done();
    //     });
    //   });
    // });

    describe('approve or reject', () => {
      it('should handle account approve or reject event', () => {
        const expected: IDetailBtnEmitEvent = {
          account: {
            ...bankAccountDetailMock,
            bankAccountStatus: 'Pending',
          },
          updatedStatus: 'active',
        };
        jest.spyOn(detailFacade, 'dispatchStatusUpdate');
        const detailHeaderElem: DebugElement = fixture.debugElement.query(
          By.css('ax-bam-detail-footer')
        );
        detailHeaderElem.triggerEventHandler('detailButtonClick', expected);
        expect(detailFacade.dispatchStatusUpdate).toHaveBeenCalledWith({
          accountId: bankAccountDetailMock.accountId,
          status: 'active',
        });
      });
    });

    describe('unmask', () => {
      it('should handle an unmask account number event', () => {
        const detailsElem: DebugElement = fixture.debugElement.query(
          By.css('ax-bank-account-detail')
        );

        jest.spyOn(component, 'handleMaskClick');
        detailsElem.triggerEventHandler('maskClick', bankAccountDetailMock.accountId);
        expect(component.handleMaskClick).toHaveBeenCalledWith(bankAccountDetailMock.accountId);
        expect(detailFacade.dispatchGetUnmaskedAccountNumber).toHaveBeenCalledWith(
          bankAccountDetailMock.accountId
        );
      });
    });

    // describe('edit', () => {
    //   it('should handle the edit click event', () => {
    //     jest.spyOn(sharedFacade, 'dispatchSetSidePanelComponentId');
    //     const detailHeaderElem: DebugElement = fixture.debugElement.query(
    //       By.css('ax-bam-detail-footer')
    //     );
    //     detailHeaderElem.triggerEventHandler('editClick');
    //     expect(sharedFacade.dispatchSetSidePanelComponentId).toHaveBeenCalledWith('edit');
    //   });
    // });
  });
});
