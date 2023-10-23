import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipsAutocompleteComponent } from '@ui-coe/shared/ui';
import { MockComponent } from 'ng-mocks';

import { AdminUsersFilterComponent } from './admin-users-filter.component';

describe('AdminUsersFilterComponent', () => {
  let component: AdminUsersFilterComponent;
  let fixture: ComponentFixture<AdminUsersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsersFilterComponent, MockComponent(ChipsAutocompleteComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
