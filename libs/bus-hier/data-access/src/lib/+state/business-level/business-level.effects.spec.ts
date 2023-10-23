import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { IBusinessLevelDetails, IGetTree } from '@ui-coe/bus-hier/shared/types';
import { Observable, of } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';

import * as BusinessLevelActions from './business-level.actions';
import { BusinessLevelEffects } from './business-level.effects';
import { BusinessLevelService } from '../../services/business-level.service';
import { TranslateService } from '@ngx-translate/core';
import * as TreeActions from '../tree/tree.actions';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('BusinessLevelEffects', () => {
  let actions$: Observable<any>;
  let effects: BusinessLevelEffects;
  let service: BusinessLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BusinessLevelEffects,
        ConfigService,
        provideMockActions(() => actions$),
        {
          provide: TranslateService,
          useValue: {
            get: jest.fn(() =>
              of({
                businessLevelRename: {
                  requiredErrorMessage: 'Enter the {{ fieldName }} name for the Business Level',
                  toaster: {
                    success: 'Changes Saved',
                    error: 'Error! Changes Not Saved',
                  },
                },
              })
            ),
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(BusinessLevelEffects);
    service = TestBed.inject(BusinessLevelService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should update business level name', () => {
    const businessLevelResponse: IBusinessLevelDetails = {
      businessLevelId: '123',
      erpId: '123',
      businessLevelNameSingular: 'company',
      businessLevelNamePlural: 'companies',
      level: 1,
      isActive: true,
      createdTimestamp: '2020-10-10',
      createdByUserId: '123',
      lastModifiedTimestamp: '2020-10-10',
      lastModifiedByUserId: '123',
    };

    actions$ = hot('-a', {
      a: BusinessLevelActions.updateBusinessLevelName({
        params: {
          orgId: '',
          erpId: '',
          selectedNode: '',
          entityId: '',
          businessLevelId: '123',
          body: {
            businessLevelNameSingular: 'company',
            businessLevelNamePlural: 'companies',
          },
        },
      }),
    });

    const response = cold('-a|', {
      a: businessLevelResponse,
    });

    const expected = cold('--(bc)', {
      b: BusinessLevelActions.updateBusinessLevelNameSuccess({
        response: businessLevelResponse,
      }),
      c: TreeActions.loadTree({
        payload: {
          erpId: '',
          orgId: '',
          entityId: '',
          selectedNode: '',
        },
      }),
    });

    jest.spyOn(service, 'updateBusinessLevelName').mockReturnValue(response);

    expect(effects.updateBusinessLevelName$).toBeObservable(expected);
  });

  it('should catch error when updating business level name', () => {
    const error = new Error('Error updating business level name');

    actions$ = hot('-a|', {
      a: BusinessLevelActions.updateBusinessLevelName({
        params: {
          businessLevelId: '123',
          body: {
            businessLevelNameSingular: 'company',
            businessLevelNamePlural: 'companies',
          },
        },
      }),
    });

    const response = cold('-#', {}, error);

    const expected = cold('--(b|)', {
      b: BusinessLevelActions.updateBusinessLevelNameFailure({
        error,
      }),
    });

    jest.spyOn(service, 'updateBusinessLevelName').mockReturnValue(response);

    expect(effects.updateBusinessLevelName$).toBeObservable(expected);
  });
});
