import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerAppComponent } from './loading-spinner-app.component';

describe('LoadingSpinnerAppComponent', () => {
  let component: LoadingSpinnerAppComponent;
  let fixture: ComponentFixture<LoadingSpinnerAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerAppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
