import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';

import { AdminUsersGridComponent } from './admin-users-grid.component';

describe('AdminUsersGridComponent', () => {
  let component: AdminUsersGridComponent;
  let fixture: ComponentFixture<AdminUsersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsersGridComponent],
      imports: [MatTableModule],
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

  describe('set behavior', () => {
    it('should set behavior depending user status', () => {
      const behavior = component.setBehavior('Active');

      expect(behavior).toEqual('Edit Member');
    });
  });
});
