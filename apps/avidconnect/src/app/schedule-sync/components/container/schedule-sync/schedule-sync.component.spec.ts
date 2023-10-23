import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { dialogStub, scheduleStub, storeStub } from '../../../../../test/test-stubs';
import { SharedModule } from '../../../../shared/shared.module';
import { ScheduleListComponent } from '../../presentation/schedule-list/schedule-list.component';
import * as actions from '../../../schedule-sync.actions';
import * as coreActions from '../../../../core/actions/core.actions';

import { ScheduleSyncComponent } from './schedule-sync.component';
import { AvidPage } from '../../../../core/enums';
import { ScheduleModalComponent } from '../../presentation/schedule-modal/schedule-modal.component';

describe('ScheduleSyncComponent', () => {
  let component: ScheduleSyncComponent;
  let fixture: ComponentFixture<ScheduleSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleSyncComponent, MockComponents(MatIcon, ScheduleListComponent)],
      imports: [SharedModule, NgxsModule.forRoot([]), RouterTestingModule],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1);
      component.ngOnInit();
    });

    it('should dispatch GetSchedules and GetNavigationChevron actions', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith([
        new actions.GetSchedules(),
        new coreActions.GetNavigationChevron(AvidPage.CustomerScheduleSync),
      ]);
    });
  });

  describe('scheduleStatusChanged()', () => {
    beforeEach(() => {
      component.scheduleStatusChanged(scheduleStub);
    });

    it('should toggle schedule active status', () => {
      expect(scheduleStub.isActive).toBe(false);
    });
  });

  describe('openScheduleModal', () => {
    beforeEach(() => {
      jest.spyOn(dialogStub, 'open');
      component.openScheduleModal();
    });

    it('should open ScheduleModalComponent dialog ', () => {
      expect(dialogStub.open).toHaveBeenCalledWith(ScheduleModalComponent, { data: {} });
    });
  });

  describe('editSchedule()', () => {
    beforeEach(() => {
      jest.spyOn(dialogStub, 'open');
      component.editSchedule(scheduleStub);
    });

    it('should open ScheduleModalComponent dialog ', () => {
      expect(dialogStub.open).toHaveBeenCalledWith(ScheduleModalComponent, {
        data: { schedule: scheduleStub },
      });
    });
  });
});
