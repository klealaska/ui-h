import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierPageTitleComponent } from './bus-hier-page-title.component';

describe('BusHierPageTitleComponent', () => {
  let component: BusHierPageTitleComponent;
  let fixture: ComponentFixture<BusHierPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierPageTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
