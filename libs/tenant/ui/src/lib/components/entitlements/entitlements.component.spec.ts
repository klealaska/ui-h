import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { EntitlementsComponent } from './entitlements.component';

describe('EntitlementsComponent', () => {
  let component: EntitlementsComponent;
  let fixture: ComponentFixture<EntitlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [EntitlementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntitlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
