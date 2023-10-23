import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxLoadingSpinnerComponent } from './ax-loading-spinner.component';

describe('AxLoadingSpinnerComponent', () => {
  let component: AxLoadingSpinnerComponent;
  let fixture: ComponentFixture<AxLoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxLoadingSpinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
