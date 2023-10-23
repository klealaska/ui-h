import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFacade } from '@ui-coe/shell/navigation/data-access';
import { provideMockStore } from '@ngrx/store/testing';

import { DashboardComponent } from './dashboard.component';
import { ContentFacade } from '@ui-coe/shared/data-access/content';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [AuthFacade, ContentFacade, provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
