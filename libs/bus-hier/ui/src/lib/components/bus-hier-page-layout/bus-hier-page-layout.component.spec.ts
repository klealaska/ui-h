import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierPageLayoutComponent } from './bus-hier-page-layout.component';

describe('BusHierPageLayoutComponent', () => {
  let component: BusHierPageLayoutComponent;
  let fixture: ComponentFixture<BusHierPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierPageLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
