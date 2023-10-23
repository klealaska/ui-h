import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { BusHierUiModule } from '../../bus-hier-ui.module';
import { BusHierPageMainComponent } from './bus-hier-page-main.component';

describe('BusHierPageDetailsComponent', () => {
  let component: BusHierPageMainComponent;
  let fixture: ComponentFixture<BusHierPageMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusHierUiModule, ButtonComponent, MatIconModule],
      declarations: [BusHierPageMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
