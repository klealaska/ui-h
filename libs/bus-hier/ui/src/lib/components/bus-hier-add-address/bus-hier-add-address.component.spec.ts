import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { BusHierAddAddressComponent } from './bus-hier-add-address.component';

describe('BusHierAddAddressComponent', () => {
  let component: BusHierAddAddressComponent;
  let fixture: ComponentFixture<BusHierAddAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierAddAddressComponent],
      imports: [SharedUiV2Module, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierAddAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
