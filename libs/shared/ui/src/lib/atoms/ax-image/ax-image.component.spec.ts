import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxImageComponent } from './ax-image.component';

describe('AxImageComponent', () => {
  let component: AxImageComponent;
  let fixture: ComponentFixture<AxImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
