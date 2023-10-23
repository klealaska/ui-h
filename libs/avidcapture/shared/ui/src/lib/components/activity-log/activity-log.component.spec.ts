import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { compositeDataStub } from '@ui-coe/avidcapture/shared/test';
import {
  ActivityLogColumnValuePipe,
  ActivityLogCurrentValuePipe,
  ActivityLogDisplayLabelPipe,
  ActivityLogMachineValuePipe,
  ActivityLogNextValuePipe,
  DuplicateDocumentIdPipe,
  TimeZonePipe,
} from '@ui-coe/avidcapture/shared/util';
import { MockPipes } from 'ng-mocks';

import { ActivityLogComponent } from './activity-log.component';

const environmentStub = {
  avidSuiteInvoiceUrl: 'mock',
  lookupDisplayThreshold: '1',
  nonLookupDisplayThreshold: '1',
} as any;

describe('ActivityLogComponent', () => {
  let component: ActivityLogComponent;
  let fixture: ComponentFixture<ActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ActivityLogComponent,
        MockPipes(
          TranslatePipe,
          ActivityLogColumnValuePipe,
          ActivityLogCurrentValuePipe,
          ActivityLogDisplayLabelPipe,
          ActivityLogMachineValuePipe,
          ActivityLogNextValuePipe,
          DuplicateDocumentIdPipe,
          TimeZonePipe
        ),
      ],
      imports: [MatCardModule, MatIconModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogComponent);
    component = fixture.componentInstance;

    component.compositeData = compositeDataStub;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should assign composite data input to the global var of compositeDocument', () => {
      fixture.detectChanges();

      expect(component.compositeDocument).toBe(component.compositeData);
    });

    it('should define initialLookupFieldCheck', () => {
      component.supplierPredictionIsActive = true;
      component.isSponsorUser = true;

      fixture.detectChanges();

      expect(component.initialLookupFieldCheck).toBeTruthy();
    });

    it('should define initialNonLookupFieldCheck', () => {
      component.multipleDisplayThresholdsIsActive = true;
      component.isSponsorUser = true;

      fixture.detectChanges();

      expect(component.initialNonLookupFieldCheck).toBeTruthy();
    });
  });
});
