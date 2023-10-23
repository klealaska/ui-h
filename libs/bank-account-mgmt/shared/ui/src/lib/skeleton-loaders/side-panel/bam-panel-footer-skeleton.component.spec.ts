import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BamPanelFooterSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('bam panel footer skeleton', () => {
  let fixture: ComponentFixture<BamPanelFooterSkeletonComponent>;
  let component: BamPanelFooterSkeletonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BamPanelFooterSkeletonComponent],
    });
    fixture = TestBed.createComponent(BamPanelFooterSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    const skeletonElem: DebugElement = fixture.debugElement.query(By.css('.skeleton'));
    expect(skeletonElem).toBeTruthy();
  });
});
