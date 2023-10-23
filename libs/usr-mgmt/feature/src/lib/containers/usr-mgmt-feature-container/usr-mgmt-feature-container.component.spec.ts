import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrMgmtFeatureContainerComponent } from './usr-mgmt-feature-container.component';
import { RouterModule } from '@angular/router';

describe('UsrMgmtFeatureContainerComponent', () => {
  let component: UsrMgmtFeatureContainerComponent;
  let fixture: ComponentFixture<UsrMgmtFeatureContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [UsrMgmtFeatureContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrMgmtFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
