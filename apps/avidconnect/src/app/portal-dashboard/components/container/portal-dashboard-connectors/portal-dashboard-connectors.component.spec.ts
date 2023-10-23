import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { PortalDashboardConnectorsComponent } from './portal-dashboard-connectors.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ConnectorsListComponent } from '../../presentation/connectors-list/connectors-list.component';
import { NgxsModule, Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { LoadingWrapperComponent } from '../../../../shared/components/loading-wrapper/loading-wrapper.component';
import { routerStub, storeStub } from '../../../../../test/test-stubs';
import * as actions from '../../../portal-dashboard.actions';
import * as coreactions from '../../../../core/actions/core.actions';
import { Router } from '@angular/router';

describe('PortalDashboardConnectorsComponent', () => {
  let component: PortalDashboardConnectorsComponent;
  let fixture: ComponentFixture<PortalDashboardConnectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PortalDashboardConnectorsComponent,
        MockComponents(
          LoadingWrapperComponent,
          ConnectorsListComponent,
          MatFormField,
          MatLabel,
          MatIcon
        ),
      ],
      imports: [FormsModule, NgxsModule.forRoot([])],
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
    fixture = TestBed.createComponent(PortalDashboardConnectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'dispatch');
      component.ngOnInit();
    });

    it('should dispatch QueryConnectors', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.QueryConnectors());
    });
  });

  describe('connectorSelected', () => {
    const connectorId = 1;
    beforeEach(() => {
      jest.spyOn(storeStub, 'dispatch');
      component.connectorSelected(connectorId);
    });

    it('should dispatch SetConnectorId', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new coreactions.SetConnectorId(connectorId));
    });
  });
});
