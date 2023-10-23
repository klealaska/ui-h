import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierPageHeaderComponent } from './bus-hier-page-header.component';
import { BusHierUiModule } from '../../bus-hier-ui.module';

describe('BusHierPageHeaderComponent', () => {
  let component: BusHierPageHeaderComponent;
  let fixture: ComponentFixture<BusHierPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusHierUiModule],
      declarations: [BusHierPageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
