import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrMgmtPageTitleComponent } from './usr-mgmt-page-title.component';

describe('UsrMgmtPageTitleComponent', () => {
  let component: UsrMgmtPageTitleComponent;
  let fixture: ComponentFixture<UsrMgmtPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsrMgmtPageTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrMgmtPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
