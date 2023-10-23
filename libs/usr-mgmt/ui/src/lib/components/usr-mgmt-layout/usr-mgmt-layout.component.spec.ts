import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrMgmtLayoutComponent } from './usr-mgmt-layout.component';

describe('UsrMgmtLayoutComponent', () => {
  let component: UsrMgmtLayoutComponent;
  let fixture: ComponentFixture<UsrMgmtLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsrMgmtLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrMgmtLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
