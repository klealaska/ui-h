import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import {
  getAdvancedFilterFormStub,
  getAdvancedFilterStub,
  getBuyersStub,
} from '@ui-coe/avidcapture/shared/test';
import { Buyer, EscalationCategoryTypes } from '@ui-coe/avidcapture/shared/types';
import {
  ButtonComponent,
  DropdownComponent,
  InputComponent,
  SideSheetV2Component,
} from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { AdvancedFilterComponent } from './advanced-filter.component';

const searchFilterStub: Buyer = { id: '3', name: 'MockName' };

describe('AdvancedFilterComponent', () => {
  let component: AdvancedFilterComponent;
  let fixture: ComponentFixture<AdvancedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdvancedFilterComponent,
        MockComponent(SideSheetV2Component),
        MockPipe(TranslatePipe),
      ],
      imports: [
        BrowserAnimationsModule,
        ButtonComponent,
        DropdownComponent,
        InputComponent,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatIconModule,
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedFilterComponent);
    component = fixture.componentInstance;
    component.advancedFilters = getAdvancedFilterStub();
    component.buyerFilterList = [];
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('ngOnChanges()', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'setEscalationCategoryFilters').mockImplementation();
    });

    describe('when researchQueuesNotAllowedList has a new change & previousValue is not NULL', () => {
      const currentValue = [
        `-${EscalationCategoryTypes.RecycleBin}`,
        `-${EscalationCategoryTypes.None}`,
        `-${EscalationCategoryTypes.IndexingOpsQc}`,
        `-${EscalationCategoryTypes.ImageIssue}`,
      ];

      beforeEach(() => {
        component.ngOnChanges({
          researchQueuesNotAllowedList: new SimpleChange([], currentValue, true),
        });
      });

      it('should call setEscalationCategoryFilters function', () =>
        expect(component['setEscalationCategoryFilters']).toHaveBeenCalledTimes(1));
    });

    describe('when researchQueuesNotAllowedList is not in the changes list', () => {
      beforeEach(() => {
        component.ngOnChanges({ buyers: new SimpleChange(null, [], true) });
      });

      it('should NOT call setEscalationCategoryFilters function', () =>
        expect(component['setEscalationCategoryFilters']).not.toHaveBeenCalled());
    });

    describe('when showFilters changes to TRUE', () => {
      beforeEach(() => {
        jest.spyOn(component, 'panelOpened').mockImplementation();
        component.ngOnChanges({ showFilters: new SimpleChange(null, true, true) });
      });

      it('should call panelOpened function', () =>
        expect(component.panelOpened).toHaveBeenCalledTimes(1));
    });

    describe('when showFilters changes to FALSE', () => {
      beforeEach(() => {
        jest.spyOn(component, 'panelOpened').mockImplementation();
        component.ngOnChanges({ showFilters: new SimpleChange(null, false, true) });
      });

      it('should NOT call panelOpened function', () =>
        expect(component.panelOpened).not.toHaveBeenCalled());
    });
  });

  describe('advanceFilterForm', () => {
    describe('when generating advanceFilterForm and advancedFilters is null', () => {
      beforeEach(() => {
        component.advancedFilters = null;
        fixture.detectChanges();
      });

      it('should create the advancedFilterForm', () =>
        expect(component.advancedFilterForm.value).toEqual({
          buyerId: [],
          supplier: '',
          shipToName: '',
          invoiceNumber: '',
          sourceEmail: '',
          fileName: '',
          startDate: '',
          endDate: '',
          submittedStartDate: '',
          submittedEndDate: '',
          escalationCategoryIssue: [],
        }));
    });
    describe('when generating advanceFilterForm and advancedFilters is empty', () => {
      beforeEach(() => {
        component.advancedFilters = { buyerId: [] };
        fixture.detectChanges();
      });

      it('should create the advancedFilterForm', () =>
        expect(component.advancedFilterForm.value).toEqual({
          buyerId: [],
          supplier: '',
          shipToName: '',
          invoiceNumber: '',
          sourceEmail: '',
          fileName: '',
          startDate: '',
          endDate: '',
          submittedStartDate: '',
          submittedEndDate: '',
          escalationCategoryIssue: [],
        }));
    });

    describe('when generating advanceFilterForm and advancedFilters has values', () => {
      const advancedFilters = getAdvancedFilterFormStub();
      const expectedValue = {
        buyerId: [searchFilterStub],
        ...advancedFilters,
      };

      beforeEach(() => {
        advancedFilters.buyerId = [searchFilterStub];
        fixture.detectChanges();
        component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
      });

      it('should create the advancedFilterForm with advancedFilters values', () =>
        expect(component.advancedFilterForm.value).toEqual(expectedValue));
    });
  });

  describe('panelOpened()', () => {
    describe('when opening the advance filters panel', () => {
      beforeEach(() => {
        fixture.detectChanges();
        component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
        component.panelOpened();
      });

      it('should create the advancedFilterForm', () =>
        expect(component.advancedFilterForm.value).toEqual(getAdvancedFilterFormStub()));

      it('should update the buyerFilterList to the current forms buyerIds', () =>
        expect(component.buyerFilterList).toEqual([]));
    });

    describe('when searching for a buyer', () => {
      beforeEach(() => {
        jest.spyOn(component.buyerFilterTextChange, 'emit').mockImplementation();
        fixture.detectChanges();
        component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
        component.panelOpened();
      });

      it('should NOT emit avi for buyerFilterTextChange emitter when value is 1 character long', fakeAsync(() => {
        component.advancedFilterForm.get('buyerId').setValue('a');
        tick(500);
        expect(component.buyerFilterTextChange.emit).not.toHaveBeenCalled();
      }));

      it('should emit avi for buyerFilterTextChange emitter', fakeAsync(() => {
        component.advancedFilterForm.get('buyerId').setValue('avi');
        tick(500);
        expect(component.buyerFilterTextChange.emit).toHaveBeenNthCalledWith(1, 'avi');
      }));
    });
  });

  describe('panelClosed()', () => {
    beforeEach(() => {
      jest.spyOn(component.closeFilters, 'emit');
    });

    describe('when closing the form panel', () => {
      beforeEach(() => {
        component.buyerFilterList = [searchFilterStub];
        component['subscriptions'].push(of().subscribe());
        component.panelClosed();
      });

      it('should set showFilters to FALSE', () => expect(component.showFilters).toBeFalsy());

      it('should set the advancedFilterForm with advancedFilters values', () =>
        expect(component.buyerFilterList).toEqual([]));

      it('should emit closeFilters', () =>
        expect(component.closeFilters.emit).toHaveBeenCalledTimes(1));
    });
  });

  describe('resetDateRange()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
      component.resetDateRange();
    });

    it('should reset startDate and endDate from advancedFilter object', () => {
      expect(component.advancedFilterForm.get('startDate').value).toBeNull();
      expect(component.advancedFilterForm.get('endDate').value).toBeNull();
    });
  });

  describe('resetSubmittedDateRange()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
      component.resetSubmittedDateRange();
    });

    it('should reset startDate and endDate from advancedFilter object', () => {
      expect(component.advancedFilterForm.get('submittedStartDate').value).toBeNull();
      expect(component.advancedFilterForm.get('submittedEndDate').value).toBeNull();
    });
  });

  describe('reset()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      jest.spyOn(component.advancedFilterForm, 'reset');
      component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
      component.buyerFilterList = [{ id: '25', name: 'Avidxchange, Inc' }];
      component.reset();
    });

    it('should call advanced filter forms reset method', () =>
      expect(component.advancedFilterForm.reset).toHaveBeenCalledTimes(1));

    it('should remove all buyers from buyerFilterList', () =>
      expect(component.buyerFilterList.length).toBe(0));
  });

  describe('remove()', () => {
    describe('when buyerFilterList has only 1 object', () => {
      beforeEach(() => {
        fixture.detectChanges();
        component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
        component.buyerFilterList = [searchFilterStub];
        component.remove(searchFilterStub);
      });

      it('should remove item from array', () => expect(component.buyerFilterList).toEqual([]));
    });

    describe('when filteredBuyers has more than 1 object', () => {
      const buyers = getBuyersStub();
      beforeEach(() => {
        component.buyerFilterList = buyers;
        fixture.detectChanges();
        component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
        component.remove(searchFilterStub);
      });

      it('should remove item from array', () => {
        buyers.pop();
        expect(component.buyerFilterList).toEqual(buyers);
      });
    });
  });

  describe('submit()', () => {
    beforeEach(() => {
      jest.spyOn(component.filtersChanged, 'emit');
      fixture.detectChanges();
    });

    it('should remove startDate & endDate & submittedStartDate & submittedEndDate from emitted value', () => {
      component.advancedFilterForm.patchValue(getAdvancedFilterFormStub());
      component.submit();
      expect(component.filtersChanged.emit).toHaveBeenNthCalledWith(1, {
        ...getAdvancedFilterStub(),
        dateReceived: expect.anything(),
        dateSubmitted: expect.anything(),
      });
    });

    it('should not pass dateReceived if startDate is empty', () => {
      const filterValues = getAdvancedFilterFormStub();
      filterValues.startDate = null;
      component.advancedFilterForm.patchValue(filterValues);
      component.submit();
      const resultStub = getAdvancedFilterStub();
      delete resultStub.dateReceived;
      expect(component.filtersChanged.emit).toHaveBeenNthCalledWith(1, {
        ...resultStub,
        dateSubmitted: expect.anything(),
      });
    });

    it('should not pass dateReceived if endDate is empty', () => {
      const filterValues = getAdvancedFilterFormStub();
      filterValues.endDate = null;
      component.advancedFilterForm.patchValue(filterValues);
      component.submit();
      const resultStub = getAdvancedFilterStub();
      delete resultStub.dateReceived;
      expect(component.filtersChanged.emit).toHaveBeenNthCalledWith(1, {
        ...resultStub,
        dateSubmitted: expect.anything(),
      });
    });

    it('should not pass dateSubmitted if submittedStartDate is empty', () => {
      const filterValues = getAdvancedFilterFormStub();
      filterValues.submittedStartDate = null;
      component.advancedFilterForm.patchValue(filterValues);
      component.submit();
      const resultStub = getAdvancedFilterStub();
      delete resultStub.dateSubmitted;
      expect(component.filtersChanged.emit).toHaveBeenNthCalledWith(1, {
        ...resultStub,
        dateReceived: expect.anything(),
      });
    });

    it('should not pass dateSubmitted if submittedEndDate is empty', () => {
      const filterValues = getAdvancedFilterFormStub();
      filterValues.submittedEndDate = null;
      component.advancedFilterForm.patchValue(filterValues);
      component.submit();
      const resultStub = getAdvancedFilterStub();
      delete resultStub.dateSubmitted;
      expect(component.filtersChanged.emit).toHaveBeenNthCalledWith(1, {
        ...resultStub,
        dateReceived: expect.anything(),
      });
    });

    it('should not pass filters if value is empty', () => {
      const filterValues = getAdvancedFilterFormStub();
      filterValues.invoiceNumber = null;
      component.advancedFilterForm.patchValue(filterValues);
      component.submit();
      const resultStub = getAdvancedFilterStub();
      delete resultStub.invoiceNumber;
      expect(component.filtersChanged.emit).toHaveBeenNthCalledWith(1, {
        ...resultStub,
        dateReceived: expect.anything(),
        dateSubmitted: expect.anything(),
      });
    });
  });

  describe('closedUploadPicker()', () => {
    describe('Start date selected', () => {
      beforeEach(() => {
        component.advancedFilters = null;

        fixture.detectChanges();
        component.advancedFilterForm.controls['startDate'].setValue('01/01/2022');
        component.closedUploadPicker();
      });

      it('should set the current date in endDate if starDate has date asigned ', () => {
        expect(component.advancedFilterForm.controls['endDate'].value instanceof Date).toBeTruthy();
      });
    });

    describe('Start date no selected', () => {
      beforeEach(() => {
        component.advancedFilters = null;

        fixture.detectChanges();
        component.advancedFilterForm.controls['startDate'].setValue('');
        component.closedUploadPicker();
      });
      it('should set the blak in endDate if starDate is in blank', () => {
        component.advancedFilterForm.controls['startDate'].setValue('');
        expect(component.advancedFilterForm.controls['endDate'].value).toEqual('');
      });
    });
  });

  describe('closedSubmittedPicker()', () => {
    describe('Start date selected', () => {
      beforeEach(() => {
        component.advancedFilters = null;

        fixture.detectChanges();
        component.advancedFilterForm.controls['submittedStartDate'].setValue('01/01/2022');
        component.closedSubmittedPicker();
      });

      it('should set the current date in submittedEndDate if submittedStartDate has date asigned ', () => {
        expect(
          component.advancedFilterForm.controls['submittedEndDate'].value instanceof Date
        ).toBeTruthy();
      });
    });

    describe('Start date no selected', () => {
      beforeEach(() => {
        component.advancedFilters = null;

        fixture.detectChanges();
        component.advancedFilterForm.controls['startDate'].setValue('');
        component.closedSubmittedPicker();
      });
      it('should set the blak in submittedEndDate if starDate is in blank', () => {
        component.advancedFilterForm.controls['submittedStartDate'].setValue('');
        expect(component.advancedFilterForm.controls['submittedEndDate'].value).toEqual('');
      });
    });
  });

  describe('private setEscalationCategoryFilters()', () => {
    const bannedFilterList = [
      `-${EscalationCategoryTypes.RecycleBin}`,
      `-${EscalationCategoryTypes.None}`,
    ];
    beforeEach(() => {
      component.researchQueuesNotAllowedList = bannedFilterList;
      component['setEscalationCategoryFilters']();
    });

    it('should set escalationCategories global var to an array of values not including the bannedFilter list', () => {
      expect(
        component.escalationCategories.includes({
          text: EscalationCategoryTypes.RecycleBin,
          value: EscalationCategoryTypes.RecycleBin,
        })
      ).toBeFalsy();

      expect(
        component.escalationCategories.includes({
          text: EscalationCategoryTypes.None,
          value: EscalationCategoryTypes.None,
        })
      ).toBeFalsy();
    });
  });
});
