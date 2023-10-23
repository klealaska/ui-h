import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxHeaderComponent } from './ax-header.component';

describe('AxHeaderComponent', () => {
  let component: AxHeaderComponent;
  let fixture: ComponentFixture<AxHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
