import { BamPanelSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('side panel skeleton loader', () => {
  let component: BamPanelSkeletonComponent;
  let fixture: ComponentFixture<BamPanelSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BamPanelSkeletonComponent],
    });
    fixture = TestBed.createComponent(BamPanelSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('it should load a handful of skeleton loaders for label and values', () => {
    const skeletonContainerElems: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.side-panel-skeleton__container')
    );
    expect(skeletonContainerElems.length).toBeGreaterThan(1);
  });
});
