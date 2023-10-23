import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { TenantUiModule } from '@ui-coe/tenant/ui';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantUiModule, SharedUiV2Module],
      declarations: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test for fixed height', () => {
    component.fixedHeight = true;
    const result = component.getClass();
    expect(result).toBe('fixed-height');
  });
  it('should test for fixed height', () => {
    const result = component.getClass();
    expect(result).toBeFalsy();
  });
});
