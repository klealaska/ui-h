import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MANAGE_BUS_HIER } from '../../routing/bus-hier-routes';
import { BusHierFeatureContainerComponent } from './bus-hier-feature-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BusHierManageContainerComponent } from '../bus-hier-manage-container/bus-hier-manage-container.component';

describe('BusHierFeatureContainerComponent', () => {
  let component: BusHierFeatureContainerComponent;
  let fixture: ComponentFixture<BusHierFeatureContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: MANAGE_BUS_HIER, component: BusHierManageContainerComponent },
        ]),
      ],
      declarations: [BusHierFeatureContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
