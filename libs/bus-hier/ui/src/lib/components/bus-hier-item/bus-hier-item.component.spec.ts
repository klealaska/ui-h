import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { BusHierItemComponent } from './bus-hier-item.component';
import { TagComponent } from '@ui-coe/shared/ui-v2';

describe('BusHierItemComponent', () => {
  let component: BusHierItemComponent;
  let fixture: ComponentFixture<BusHierItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierItemComponent],
      imports: [SharedUiV2Module, TagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
