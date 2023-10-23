import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from '@ui-coe/shared/ui-v2';
import { BusHierLoaderComponent } from './bus-hier-loader.component';

describe('BusHierLoaderComponent', () => {
  let component: BusHierLoaderComponent;
  let fixture: ComponentFixture<BusHierLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierLoaderComponent],
      imports: [SpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
