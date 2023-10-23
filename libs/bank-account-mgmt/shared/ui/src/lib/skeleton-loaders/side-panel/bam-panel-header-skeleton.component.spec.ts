import { BamPanelHeaderSkeletonComponent } from './bam-panel-header-skeleton.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('bank account header skeleton', () => {
  let component: BamPanelHeaderSkeletonComponent;
  let fixture: ComponentFixture<BamPanelHeaderSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BamPanelHeaderSkeletonComponent],
    });
    fixture = TestBed.createComponent(BamPanelHeaderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the single loader for the header', () => {
    const headerLoaderElem: DebugElement = fixture.debugElement.query(By.css('.skeleton'));
    expect(headerLoaderElem).toBeTruthy();
  });
});
