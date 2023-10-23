import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MockComponents } from 'ng-mocks';
import { storeStub } from '../../../../../test/test-stubs';

import { OperationDetailsComponent } from './operation-details.component';
import { OperationInfoComponent } from '../../presentation/operation-info/operation-info.component';
import { OperationLogsComponent } from '../../presentation/operation-logs/operation-logs.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import * as actions from '../../../operation.actions';

describe('OperationDetailsComponent', () => {
  let component: OperationDetailsComponent;
  let fixture: ComponentFixture<OperationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OperationDetailsComponent,
        MockComponents(
          PageHeaderComponent,
          OperationInfoComponent,
          OperationLogsComponent,
          MatTab,
          MatTabGroup
        ),
      ],
      imports: [NgxsModule.forRoot([])],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1).mockReturnValueOnce(1);
      component.ngOnInit();
    });

    it('should get customerId from state', () => expect(component.customerId).toBe(1));

    it('should get operationId from state', () => expect(component.operationId).toBe(1));

    it('should dispatch GetOperation action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.GetOperation());
    });
  });

  describe('ngOnDestroy()', () => {
    it('should dispatch ClearOperation action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.ClearOperation());
    });
  });

  describe('downloadReportClicked()', () => {
    const customerId = 1234;
    const operationId = 4567;

    beforeEach(() => {
      component.customerId = customerId;
      component.operationId = operationId;
      component.downloadReportClicked();
    });

    it('should dispatch GetDetails action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.GetDetails(customerId, operationId, true)
      );
    });
  });

  describe('downloadLogClicked()', () => {
    const customerId = 1234;
    const executionId = 4567;

    beforeEach(() => {
      component.customerId = customerId;
      component.downloadLogClicked(executionId);
    });

    it('should dispatch GetDetails action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.GetEvents(customerId, executionId, true)
      );
    });
  });

  describe('downloadArtifactClicked()', () => {
    const customerId = 1234;
    const executionId = 4567;

    beforeEach(() => {
      component.customerId = customerId;
      component.downloadArtifactClicked(executionId);
    });

    it('should dispatch GetArtifacts action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.GetArtifacts(customerId, executionId)
      );
    });
  });
});
