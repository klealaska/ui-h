import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectorHeaderComponent } from '../../../../shared/components/connector-header/connector-header.component';
import { MockComponents } from 'ng-mocks';

import { OperationInfoComponent } from './operation-info.component';
import { operationStub } from 'apps/avidconnect/src/test/test-stubs';

describe('OperationInfoComponent', () => {
  let component: OperationInfoComponent;
  let fixture: ComponentFixture<OperationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationInfoComponent, MockComponents(ConnectorHeaderComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getOperationDuration()', () => {
    let duration;

    describe('when no end date is defined', () => {
      beforeEach(() => {
        duration = component.getOperationDuration('2021-09-07T17:10:14.9', '');
      });

      it('should return an empty value', () => expect(duration).toBe(''));
    });

    describe('when end date is defined', () => {
      beforeEach(() => {
        duration = component.getOperationDuration(
          '2021-09-07T17:10:14.9',
          '2021-09-07T17:10:20.897'
        );
      });

      it('should set duration between start and end dates', () => expect(duration).toBe('0:00:05'));
    });

    describe('when duration result digits have 2 digits', () => {
      beforeEach(() => {
        duration = component.getOperationDuration(
          '2021-09-07T17:10:14.9',
          '2021-09-10T17:22:25.897'
        );
      });

      it('should set duration format correctly', () => expect(duration).toBe('72:12:10'));
    });

    describe('when operation has artifact and operation complete', () => {
      let showArtifactBtn;
      beforeEach(() => {
        const mockOperation = Object.assign(operationStub, { operationStatusTypeName: 'Success' });
        component.hasArtifact = true;
        showArtifactBtn = component.hasArtifact && component.isComplete(mockOperation);
      });

      it('should show Download Artifact button', () => expect(showArtifactBtn).toBe(true));
    });

    describe('when operation has no artifact', () => {
      let showArtifactBtn;
      beforeEach(() => {
        const mockOperation = Object.assign(operationStub, { operationStatusTypeName: 'Success' });
        component.hasArtifact = false;
        showArtifactBtn = component.hasArtifact && component.isComplete(mockOperation);
      });

      it('should NOT show Download Artifact button', () => expect(showArtifactBtn).toBe(false));
    });

    describe('when operation execution not complete', () => {
      let showArtifactBtn;
      beforeEach(() => {
        const mockOperation = Object.assign(operationStub, { operationStatusTypeName: 'Pending' });
        component.hasArtifact = true;
        showArtifactBtn = component.hasArtifact && component.isComplete(mockOperation);
      });

      it('should NOT show Download Artifact button', () => expect(showArtifactBtn).toBe(false));
    });
  });
});
