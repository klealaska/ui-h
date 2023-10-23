import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BamDetailFooterComponent } from './bam-detail-footer.component';
import { By } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import {
  bankAccountDetailMock,
  bankAccountDetailsContentMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import {
  IBankAccountDetailsContent,
  IBankAccountMapped,
} from '@ui-coe/bank-account-mgmt/shared/types';

@Component({
  selector: 'ax-detail-footer-parent-mock',
  template: `<ax-bam-detail-footer
    #detailFooter
    [content]="content"
    [account]="account"
  ></ax-bam-detail-footer>`,
})
export class DetailFooterParentMockComponent {
  @ViewChild('detailFooter') detailFooter: BamDetailFooterComponent;
  public content: IBankAccountDetailsContent = bankAccountDetailsContentMock;
  public account: IBankAccountMapped;
}

describe('bam detail footer', () => {
  let fixture: ComponentFixture<DetailFooterParentMockComponent>;
  let component: DetailFooterParentMockComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BamDetailFooterComponent],
      declarations: [DetailFooterParentMockComponent],
    });
    fixture = TestBed.createComponent(DetailFooterParentMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.detailFooter).toBeTruthy();
  });

  // describe('edit button', () => {
  //   let editButtonElem: DebugElement;
  //
  //   beforeEach(() => {
  //     component.account = bankAccountDetailMock;
  //     fixture.detectChanges();
  //     editButtonElem = fixture.debugElement.query(By.css('.bam-detail-footer__edit'));
  //   });
  //
  //   it('should display the edit button', () => {
  //     expect(editButtonElem).toBeTruthy();
  //   });
  //
  //   it('should handle an edit click', () => {
  //     jest.spyOn(component.detailFooter.editClick, 'emit');
  //     editButtonElem.triggerEventHandler('click');
  //     expect(component.detailFooter.editClick.emit).toHaveBeenCalled();
  //   });
  // });

  // describe('deactivate action button', () => {
  //   let actionButtons: DebugElement[];
  //
  //   beforeEach(() => {
  //     component.account = { ...bankAccountDetailMock, bankAccountStatus: 'Active' };
  //     fixture.detectChanges();
  //     actionButtons = fixture.debugElement.queryAll(By.css('.bam-detail-footer__account-actions'));
  //   });
  //
  //   it('should display deactivate for accounts with active status', () => {
  //     expect(actionButtons.length).toBe(1);
  //     expect(actionButtons[0].nativeElement.textContent).toContain('Deactivate');
  //   });
  //
  //   it('should handle a detail action button click', () => {
  //     jest.spyOn(component.detailFooter.detailButtonClick, 'emit');
  //     actionButtons[0].triggerEventHandler('click');
  //     expect(component.detailFooter.detailButtonClick.emit).toHaveBeenCalled();
  //   });
  // });
  //
  // describe('reactivate action button', () => {
  //   it('should display reactivate for accounts with inactive status', () => {
  //     component.account = { ...bankAccountDetailMock, bankAccountStatus: 'Inactive' };
  //     fixture.detectChanges();
  //     const actionButtons = fixture.debugElement.queryAll(
  //       By.css('.bam-detail-footer__account-actions')
  //     );
  //     expect(actionButtons[0].nativeElement.textContent).toContain('Reactivate');
  //   });
  //
  //   it('should display reactivate for accounts with locked status', () => {
  //     component.account = { ...bankAccountDetailMock, bankAccountStatus: 'Locked' };
  //     fixture.detectChanges();
  //     const actionButtons = fixture.debugElement.queryAll(
  //       By.css('.bam-detail-footer__account-actions')
  //     );
  //     expect(actionButtons[0].nativeElement.textContent).toContain('Reactivate');
  //   });
  // });

  describe('reject and approve action buttons', () => {
    it('should display reject and approve for accounts with pending status', () => {
      component.account = { ...bankAccountDetailMock, bankAccountStatus: 'Pending' };
      fixture.detectChanges();
      const actionButtons = fixture.debugElement.queryAll(
        By.css('.bam-detail-footer__account-actions')
      );
      expect(actionButtons.length).toBe(2);
      expect(actionButtons[0].nativeElement.textContent).toContain('Reject');
      expect(actionButtons[1].nativeElement.textContent).toContain('Approve');
    });

    it('should display approve for accounts with failed status', () => {
      component.account = { ...bankAccountDetailMock, bankAccountStatus: 'Failed' };
      fixture.detectChanges();
      const actionButtons = fixture.debugElement.queryAll(
        By.css('.bam-detail-footer__account-actions')
      );
      expect(actionButtons.length).toBe(1);
      expect(actionButtons[0].nativeElement.textContent).toContain('Approve');
    });
  });
});
