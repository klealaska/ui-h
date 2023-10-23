import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { TenantFeatureContainerComponent } from './tenant-feature-container.component';

describe('TenantFeatureContainerComponent', () => {
  let component: TenantFeatureContainerComponent;
  let fixture: ComponentFixture<TenantFeatureContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [TenantFeatureContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
