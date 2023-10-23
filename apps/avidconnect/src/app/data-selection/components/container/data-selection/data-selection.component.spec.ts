import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import {
  httpClientStub,
  registrationEnablementStub,
  storeStub,
} from '../../../../../test/test-stubs';
import { SharedModule } from '../../../../shared/shared.module';

import { DataSelectionComponent } from './data-selection.component';
import { RouterTestingModule } from '@angular/router/testing';
import * as actions from '../../../data-selection.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { AvidPage } from '../../../../core/enums';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('DataSelectionComponent', () => {
  let component: DataSelectionComponent;
  let fixture: ComponentFixture<DataSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSelectionComponent],
      imports: [SharedModule, NgxsModule.forRoot([]), RouterTestingModule],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: HttpClient,
          useValue: httpClientStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should dispatch GetOperationTypes and GetNavigationChevron actions', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith([
        new actions.GetOperationTypes(),
        new coreActions.GetNavigationChevron(AvidPage.CustomerDataSelection),
      ]);
    });
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });
    it('should dispatch ClearDataSelection action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.ClearDataSelection());
    });
  });

  describe('saveChanges()', () => {
    describe('when isOperationSelected = true', () => {
      beforeEach(() => {
        component.isOperationSelected = true;
        jest.spyOn(window.history, 'back');
        component.saveChanges();
      });

      it('should take user back to connector settings page', () => {
        expect(window.history.back).toHaveBeenCalled();
      });
    });

    describe('when isOperationSelected = false', () => {
      beforeEach(() => {
        component.isOperationSelected = false;
        component.saveChanges();
      });

      it('should dispatch SaveRegistrationEnablements action', () => {
        expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.SaveRegistrationEnablements());
      });
      it('should set operationselected flag to true', () => {
        expect(component.isOperationSelected).toBe(true);
      });
    });
  });

  describe('cancelChanges()', () => {
    describe('when  isOperationSelected = true', () => {
      beforeEach(() => {
        component.isOperationSelected = true;
        component.cancelChanges();
      });

      it('should set  isOperationSelected to false', () => {
        expect(component.isOperationSelected).toBe(false);
      });
    });

    describe('when  isOperationSelected = false', () => {
      beforeEach(() => {
        component.isOperationSelected = false;
        jest.spyOn(window.history, 'back');

        component.cancelChanges();
      });

      it('should take user back to connector settings page', () => {
        expect(window.history.back).toHaveBeenCalled();
      });
    });
  });

  describe('enablementStatusChanged()', () => {
    let enablementOpEl: DebugElement;
    beforeEach(() => {
      // make registrationEnablements$ writable to set the mock data since mocking selectors is weird with ngxs
      Object.defineProperty(component, 'registrationEnablements$', { writable: true });
      component.registrationEnablements$ = of([registrationEnablementStub]);
      component.isOperationSelected = true;

      fixture.detectChanges();

      enablementOpEl = fixture.debugElement.query(By.css('avc-registration-enablement-option'));
    });

    it('should dispatch UpdateRegistrationEnablement action', () => {
      enablementOpEl.triggerEventHandler('enablementChanged', registrationEnablementStub);
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.UpdateRegistrationEnablement(registrationEnablementStub)
      );
    });
  });

  describe('fileUploaded()', () => {
    beforeEach(() => {
      component.fileUploaded({ file: {}, operationTypeId: 1 });
    });

    it('should dispatch PostMappingFile action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.PostMappingFile(1, {} as any));
    });
  });

  describe('downloadFile()', () => {
    const data = {};
    beforeEach(() => {
      jest.spyOn(httpClientStub, 'get').mockReturnValue(of(data));
      window.URL.createObjectURL = jest.fn();
      component.downloadFile(registrationEnablementStub);
    });

    it('should get file from service', () => {
      expect(httpClientStub.get).toHaveBeenCalledWith(
        registrationEnablementStub.registrationEnablementUrl,
        expect.objectContaining({ responseType: 'application/json' })
      );
    });
  });
});
