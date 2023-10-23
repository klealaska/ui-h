import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrRolesFeatureContainerComponent } from './usr-roles-feature-container.component';

describe('UsrRolesFeatureContainerComponent', () => {
  let component: UsrRolesFeatureContainerComponent;
  let fixture: ComponentFixture<UsrRolesFeatureContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsrRolesFeatureContainerComponent],
    });
    fixture = TestBed.createComponent(UsrRolesFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
