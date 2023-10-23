import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxLabelComponent } from './ax-label.component';

describe('AxLabelComponent', () => {
  let component: AxLabelComponent;
  let fixture: ComponentFixture<AxLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxLabelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
