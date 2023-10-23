import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsrRolesListContainerComponent } from './usr-roles-list-container.component';

describe('UsrRolesListContainerComponent', () => {
  let component: UsrRolesListContainerComponent;
  let fixture: ComponentFixture<UsrRolesListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsrRolesListContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrRolesListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
