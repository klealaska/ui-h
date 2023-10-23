import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersGridComponent as SharedAdminUsersGridComponent } from '@ui-coe/shared/ui';
import { MockComponent } from 'ng-mocks';

import { AdminUsersGridComponent } from './admin-users-grid.component';

describe('AdminUsersGridComponent', () => {
  let component: AdminUsersGridComponent;
  let fixture: ComponentFixture<AdminUsersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsersGridComponent, MockComponent(SharedAdminUsersGridComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
