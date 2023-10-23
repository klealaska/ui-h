import { Component, DebugElement, ViewChild } from '@angular/core';
import { IBankAccountDetailsContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { bankAccountDetailsContentMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { BamEditHeaderComponent } from './bam-edit-header.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

@Component({
  selector: 'ax-bam-edit-header-mock-parent',
  template: `<ax-bam-edit-header #header [content]="content"></ax-bam-edit-header>`,
  standalone: true,
  imports: [BamEditHeaderComponent],
})
export class BamEditHeaderMockParentComponent {
  public content: IBankAccountDetailsContent = bankAccountDetailsContentMock;
  @ViewChild('header') public editHeader: BamEditHeaderComponent;
}

describe('bam-edit-header', () => {
  let component: BamEditHeaderMockParentComponent;
  let fixture: ComponentFixture<BamEditHeaderMockParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BamEditHeaderMockParentComponent,
        BamEditHeaderComponent,
        NoopAnimationsModule,
        ButtonComponent,
      ],
    });
    fixture = TestBed.createComponent(BamEditHeaderMockParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.editHeader).toBeTruthy();
  });

  it('should handle the back button click', () => {
    jest.spyOn(component.editHeader.backClick, 'emit');
    const cancelBtnElem: DebugElement = fixture.debugElement.query(By.css('ax-button'));
    cancelBtnElem.triggerEventHandler('click');
    expect(component.editHeader.backClick.emit).toHaveBeenCalled();
  });
});
