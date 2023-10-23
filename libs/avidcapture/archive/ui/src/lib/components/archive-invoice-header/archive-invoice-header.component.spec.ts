import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { getCompositeDataStub } from '@ui-coe/avidcapture/shared/test';
import { ActivityLogComponent } from '@ui-coe/avidcapture/shared/ui';
import { AxLabelComponent } from '@ui-coe/shared/ui';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ArchiveInvoiceHeaderComponent } from './archive-invoice-header.component';

describe('ArchiveInvoiceHeaderComponent', () => {
  let component: ArchiveInvoiceHeaderComponent;
  let fixture: ComponentFixture<ArchiveInvoiceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArchiveInvoiceHeaderComponent,
        MockComponent(AxLabelComponent),
        MockComponent(ActivityLogComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [BrowserAnimationsModule, MatExpansionModule, MatIconModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveInvoiceHeaderComponent);
    component = fixture.componentInstance;
    component.archivedDocument = getCompositeDataStub();
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => expect(component).toBeTruthy());

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
