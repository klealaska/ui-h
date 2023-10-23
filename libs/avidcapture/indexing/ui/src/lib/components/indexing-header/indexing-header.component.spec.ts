import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivityLogComponent } from '@ui-coe/avidcapture/shared/ui';
import { ButtonComponent, TooltipDirective } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { IndexingHeaderComponent } from './indexing-header.component';

describe('IndexingHeaderComponent', () => {
  let component: IndexingHeaderComponent;
  let fixture: ComponentFixture<IndexingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IndexingHeaderComponent,
        MockComponent(ActivityLogComponent),
        MockDirective(TooltipDirective),
        MockPipe(TranslatePipe),
      ],
      imports: [
        ButtonComponent,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexingHeaderComponent);
    component = fixture.componentInstance;
    component.markAsChoices = [];
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('ngOnChanges()', () => {
    describe('when hasNewEscalations is null', () => {
      beforeEach(() => {
        component.ngOnChanges({
          hasNewEscalations: null,
        });
      });

      it('should keep text as Mark As', () => expect(component.text).toBe('Mark As'));
    });
    describe('when there are not any new escalations', () => {
      beforeEach(() => {
        component.text = 'Mark As Escalation';
        component.ngOnChanges({
          hasNewEscalations: new SimpleChange(null, false, true),
        });
      });

      it('should set text to Mark As', () => expect(component.text).toBe('Mark As'));
    });
  });

  describe('itemSelected()', () => {
    beforeEach(() => {
      jest.spyOn(component.markAsSelected, 'emit').mockImplementation();
      component.itemSelected('mockEvent');
    });

    it('should emit mockEvent for selected item', () =>
      expect(component.markAsSelected.emit).toHaveBeenNthCalledWith(1, 'mockEvent'));
  });

  describe('activityLogClick()', () => {
    beforeEach(() => {
      jest.spyOn(component.expansionPanel, 'toggle');
      component.showing = false;
      component.activityLogClick();
    });

    it('should toggle expansion panel', () =>
      expect(component.expansionPanel.toggle).toHaveBeenCalledTimes(1));

    it('should set showing to true', () => expect(component.showing).toBeTruthy());
  });
});
