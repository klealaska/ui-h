import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOverlineComponent } from './card-overline.component';

describe('CardOverlineComponent', () => {
  let component: CardOverlineComponent;
  let fixture: ComponentFixture<CardOverlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOverlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardOverlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
