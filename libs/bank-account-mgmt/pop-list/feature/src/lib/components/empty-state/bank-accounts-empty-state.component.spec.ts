import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BankAccountsEmptyStateComponent } from './bank-accounts-empty-state.component';
import { ButtonComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'ax-bam-empty-state-mock',
  template: `<ax-bank-account-empty-state
    message="mock message"
    btnLabel="button label"
  ></ax-bank-account-empty-state>`,
})
export class MockBamEmptyStateComponent {
  @ViewChild(BankAccountsEmptyStateComponent)
  public emptyStateComponent: BankAccountsEmptyStateComponent;
}

describe('Bank Account Empty State', () => {
  let parentComponent: MockBamEmptyStateComponent;
  let component: BankAccountsEmptyStateComponent;
  let fixture: ComponentFixture<MockBamEmptyStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockBamEmptyStateComponent, BankAccountsEmptyStateComponent],
      imports: [SharedUiV2Module, ButtonComponent],
    });
    fixture = TestBed.createComponent(MockBamEmptyStateComponent);
    parentComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = parentComponent.emptyStateComponent;
  });

  it('should create the empty state component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct information in empty state template', () => {
    const emptyStateMessage: HTMLElement = fixture.debugElement.query(
      By.css('#emptyStateMessage')
    ).nativeElement;
    expect(emptyStateMessage.textContent.trim()).toBe('mock message');
  });
});
