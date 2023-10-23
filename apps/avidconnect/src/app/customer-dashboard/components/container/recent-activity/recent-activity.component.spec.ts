import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { LoadingWrapperComponent } from '../../../../shared/components/loading-wrapper/loading-wrapper.component';
import { MockComponents } from 'ng-mocks';
import { customerStub, routerStub, storeStub } from '../../../../../test/test-stubs';

import { RecentActivityComponent } from './recent-activity.component';
import { MatIcon } from '@angular/material/icon';
import { OperationsListComponent } from '../../presentation/operations-list/operations-list.component';
import * as actions from '../../../customer-dashboard.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { AvidPage } from '../../../../core/enums';
import { Router } from '@angular/router';

describe('RecentActivityComponent', () => {
  let component: RecentActivityComponent;
  let fixture: ComponentFixture<RecentActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecentActivityComponent,
        MockComponents(LoadingWrapperComponent, MatIcon, OperationsListComponent),
      ],
      imports: [NgxsModule.forRoot([])],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
        { provide: Router, useValue: routerStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentActivityComponent);
    component = fixture.componentInstance;
    jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(customerStub);
    jest.spyOn(storeStub, 'dispatch');

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should get customer from state', () => expect(storeStub.selectSnapshot).toHaveBeenCalled());

    it('should get operations on component init', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
        new actions.QueryOperations(24),
        new coreActions.GetNavigationChevron(AvidPage.CustomerRecentActivity),
      ]));
  });

  describe('syncOperations()', () => {
    beforeEach(() => {
      component.syncOperations();
    });

    it('should do new query for operations from state', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, [
        new actions.QueryOperations(24),
        new coreActions.GetNavigationChevron(AvidPage.CustomerRecentActivity),
      ]));
  });

  describe('operationSelected()', () => {
    const operationId = 1;
    beforeEach(() => {
      jest.spyOn(storeStub, 'dispatch');
      component.operationSelected(operationId);
    });

    it('should dispatch SetOperationId action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new coreActions.SetOperationId(operationId));
    });

    it('should navigate tp operation details page', () => {
      expect(routerStub.navigate).toHaveBeenCalledWith(['operation-details']);
    });
  });
});
