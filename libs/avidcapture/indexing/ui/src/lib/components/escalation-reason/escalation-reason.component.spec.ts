import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { activityStub, escalationsStub, getActivityStub } from '@ui-coe/avidcapture/shared/test';
import {
  EscalationCategoryTypes,
  escalationCategoryReasonTypes,
} from '@ui-coe/avidcapture/shared/types';

import { EscalationReasonComponent } from './escalation-reason.component';

describe('XdcEscalationReasonComponent', () => {
  let component: EscalationReasonComponent;
  let fixture: ComponentFixture<EscalationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EscalationReasonComponent],
      imports: [MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationReasonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit(): escalationLabel definement', () => {
    describe('when escalation does not exist on activity', () => {
      const activityStub = getActivityStub();
      activityStub.escalation = null;

      beforeEach(() => {
        component.activity = activityStub;
        fixture.detectChanges();
      });

      it('should set escalationLabel to an empty string', () =>
        expect(component.escalationLabel).toBe(''));
    });

    describe('when reason is available', () => {
      beforeEach(() => {
        activityStub.escalation.category.issue = EscalationCategoryTypes.IndexerQa;
        activityStub.escalation.category.reason = escalationCategoryReasonTypes.reason.ShipToField;
        component.activity = activityStub;
        fixture.detectChanges();
      });

      afterEach(() => {
        escalationsStub.category.issue = '';
        escalationsStub.category.reason = '';
      });

      it('should return string of issue & reason', () =>
        expect(component.escalationLabel).toBe(
          `${EscalationCategoryTypes.IndexerQa} - ${escalationCategoryReasonTypes.reason.ShipToField}`
        ));
    });

    describe('when reason is not defined', () => {
      beforeEach(() => {
        activityStub.escalation.category.issue = EscalationCategoryTypes.IndexerQa;
        activityStub.escalation.category.reason = '';
        component.activity = activityStub;
        fixture.detectChanges();
      });

      afterEach(() => {
        escalationsStub.category.issue = '';
        escalationsStub.category.reason = '';
      });

      it('should return string of issue only', () =>
        expect(component.escalationLabel).toBe(`${EscalationCategoryTypes.IndexerQa}`));
    });
  });
});
